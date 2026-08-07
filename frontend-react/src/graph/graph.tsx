import {
  ReactFlow,
  Handle,
  Position,
  Background,
  type Node,
  type Edge,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";
import "@xyflow/react/dist/style.css";

import type { PersonData, GraphData } from "./dtos";

export type ImageNodeData = PersonData & {
  center?: boolean;
};
type ImageNode = Node<ImageNodeData, "image">;
type SimulationImageNode = ImageNode & SimulationNodeDatum;

const NODE_SIZE = 80;
const CENTER_NODE_SIZE = 120;
const LABEL_EXTRA_HEIGHT = 30;

function ImageNodeComponent({ data }: NodeProps<ImageNode>) {
  const size = data.center ? CENTER_NODE_SIZE : NODE_SIZE;
  const imageCenterY = size / 2;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "transparent",
        position: "relative",
        width: size,
        height: size + LABEL_EXTRA_HEIGHT,
        cursor: data.onClick ? "pointer" : "default",
      }}
    >
      <Handle
        type="source"
        position={Position.Top}
        id="center-source"
        style={{
          position: "absolute",
          top: imageCenterY,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="center-target"
        style={{
          position: "absolute",
          top: imageCenterY,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <img
        src={data.image}
        alt={data.label}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: data.center ? "4px solid #2563eb" : "3px solid white",
          boxShadow: "0 4px 15px rgba(0,0,0,.25)",
        }}
      />

      <div
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: 600,
          color: "#222",
          textShadow: "0 1px 3px white",
        }}
      >
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  image: ImageNodeComponent,
};

function buildPersonGraph({ main, others }: GraphData): { nodes: ImageNode[]; edges: Edge[] } {
  const nodeDims = (center?: boolean) => {
    const w = center ? CENTER_NODE_SIZE : NODE_SIZE;
    return { width: w, height: w + LABEL_EXTRA_HEIGHT };
  };

  const mainNode: ImageNode = {
    id: "1",
    type: "image",
    position: { x: 0, y: 0 },
    ...nodeDims(true),
    data: { label: main.label, image: main.image, onClick: main.onClick, center: true },
  };

  const otherNodes: ImageNode[] = others.map((person, i) => ({
    id: `${i + 2}`,
    type: "image",
    position: { x: 0, y: 0 },
    ...nodeDims(false),
    data: { label: person.label, image: person.image, onClick: person.onClick },
  }));

  const nodes: ImageNode[] = [mainNode, ...otherNodes];

  const edges: Edge[] = otherNodes.map((node) => ({
    id: `${mainNode.id}-${node.id}`,
    source: mainNode.id,
    target: node.id,
    sourceHandle: "center-source",
    targetHandle: "center-target",
  }));

  const simulationNodes: SimulationImageNode[] = nodes.map((node) => {
    const isCenter = node.data.center === true;
    return {
      ...node,
      x: isCenter ? 500 : 500 + (Math.random() - 0.5) * 600,
      y: isCenter ? 400 : 400 + (Math.random() - 0.5) * 600,
      fx: isCenter ? 500 : undefined,
      fy: isCenter ? 400 : undefined,
    };
  });

  const simulationEdges = edges.map((e) => ({ ...e }));

  const simulation = forceSimulation(simulationNodes)
    .force(
      "link",
      forceLink<SimulationImageNode, (typeof simulationEdges)[number]>(simulationEdges)
        .id((node) => node.id)
        .distance((edge) => {
          const sourceId =
            typeof edge.source === "object"
              ? (edge.source as SimulationImageNode).id
              : (edge.source as string);
          const targetId =
            typeof edge.target === "object"
              ? (edge.target as SimulationImageNode).id
              : (edge.target as string);
          return sourceId === mainNode.id || targetId === mainNode.id ? 260 : 200;
        })
        .strength(0.9),
    )
    .force("charge", forceManyBody().strength(-900))
    .force(
      "collision",
      forceCollide<SimulationImageNode>((node) => {
        const w = node.width ?? NODE_SIZE;
        const h = node.height ?? NODE_SIZE + LABEL_EXTRA_HEIGHT;
        return Math.max(w, h) / 2 + 15;
      }),
    )
    .force("center", forceCenter(500, 400))
    .force("x", forceX(500).strength(0.03))
    .force("y", forceY(400).strength(0.03));

  for (let i = 0; i < 500; i++) {
    simulation.tick();
  }
  simulation.stop();

  const layoutedNodes: ImageNode[] = simulationNodes.map((node) => ({
    ...node,
    position: {
      x: (node.x ?? 0) - (node.width ?? NODE_SIZE) / 2,
      y: (node.y ?? 0) - (node.height ?? NODE_SIZE + LABEL_EXTRA_HEIGHT) / 2,
    },
    measured: {
      width: node.width ?? NODE_SIZE,
      height: node.height ?? NODE_SIZE + LABEL_EXTRA_HEIGHT,
    },
  }));

  return { nodes: layoutedNodes, edges };
}

export function WebHoundSocialGraph({ main, others }: GraphData) {
  const { nodes, edges } = buildPersonGraph({ main, others });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow<ImageNode, Edge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          type: "straight",
          style: {
            stroke: "black",
            strokeWidth: 2,
          },
        }}
        onNodeClick={(_, node) => node.data.onClick?.()}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
