import {
  ReactFlow,
  Handle,
  Position,
  Background,
  type Node,
  type Edge,
  type NodeProps,
  type NodeTypes,
  MarkerType,
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
import { MiddleArrowEdge } from "./custom-edge";

export type ImageNodeData = PersonData & {
  kind: "main" | "to" | "by";
};
type ImageNode = Node<ImageNodeData, "image">;
type SimulationImageNode = ImageNode & SimulationNodeDatum;

const NODE_SIZE = 80;
const CENTER_NODE_SIZE = 120;
const LABEL_EXTRA_HEIGHT = 30;

function ImageNodeComponent({ data }: NodeProps<ImageNode>) {
  const size = data.kind === "main" ? CENTER_NODE_SIZE : NODE_SIZE;
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
        referrerPolicy="no-referrer"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: (() => {
            switch (data.kind) {
              case "main":
                return "4px solid pink";
              case "by":
                return "3px solid green";
              case "to":
                return "3px solid blue";
            }
          })(),
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
    data: { label: main.label, image: main.image, onClick: main.onClick, kind: "main" },
  };

  const otherNodes: ImageNode[] = others.map(({ person, kind }, i) => ({
    id: `${i + 2}`,
    type: "image",
    position: { x: 0, y: 0 },
    ...nodeDims(false),
    data: { label: person.label, image: person.image, onClick: person.onClick, kind: kind },
  }));

  const nodes: ImageNode[] = [mainNode, ...otherNodes];

  const edges: Edge[] = otherNodes.map((node) => ({
    id: `${mainNode.id}-${node.id}`,
    source: mainNode.id,
    target: node.id,
    style: {
      stroke: (() => {
        switch (node.data.kind) {
          case "by":
            return "green";
          case "to":
            return "blue";
        }
      })(),
      strokeWidth: 2,
    },
    data: { kind: node.data.kind },
    sourceHandle: "center-source",
    targetHandle: "center-target",
  }));

  const simulationNodes: SimulationImageNode[] = nodes.map((node) => {
    const isCenter = node.data.kind === "main";
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
    <div style={{ width: "50vw", height: "50vh", padding: "4px" }}>
      <ReactFlow<ImageNode, Edge>
        nodes={nodes}
        edges={edges}
        edgeTypes={{ middle: MiddleArrowEdge }}
        nodeTypes={{ image: ImageNodeComponent }}
        fitView
        defaultEdgeOptions={{
          type: "middle",
          style: {
            stroke: "black",
            strokeWidth: 2,
          },
        }}
        onNodeClick={(_, node) => node.data.onClick?.()}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.01}
        maxZoom={100}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
