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
import { useMemo } from "react";
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

type LayoutPosition = { x: number; y: number };

const nodeDims = (center?: boolean) => {
  const w = center ? CENTER_NODE_SIZE : NODE_SIZE;
  return { width: w, height: w + LABEL_EXTRA_HEIGHT };
};

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

function SocialGraphView({ nodes, edges }: { nodes: ImageNode[]; edges: Edge[] }) {
  return (
    <div style={{ width: "50vw", height: "50vh", padding: "4px" }}>
      <ReactFlow<ImageNode, Edge>
        nodes={nodes}
        edges={edges}
        edgeTypes={{ middle: MiddleArrowEdge }}
        nodeTypes={{ image: ImageNodeComponent }}
        fitView
        minZoom={0.01}
        maxZoom={2}
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
      >
        <Background />
      </ReactFlow>
    </div>
  );
}

function runSimulation(nodes: SimulationImageNode[], edges: Edge[]): SimulationImageNode[] {
  const simulationEdges = edges.map((e) => ({ ...e }));

  const simulation = forceSimulation(nodes)
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
          return sourceId === "1" || targetId === "1" ? 260 : 200;
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

  return nodes;
}

function initSimulationNodes(nodes: ImageNode[]): SimulationImageNode[] {
  return nodes.map((node) => {
    const isCenter = node.data.kind === "main";
    return {
      ...node,
      x: isCenter ? 500 : 500 + (Math.random() - 0.5) * 600,
      y: isCenter ? 400 : 400 + (Math.random() - 0.5) * 600,
      fx: isCenter ? 500 : undefined,
      fy: isCenter ? 400 : undefined,
    };
  });
}

function buildPersonGraph({ main, others }: GraphData): { nodes: ImageNode[]; edges: Edge[] } {
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

  const simulationNodes = initSimulationNodes(nodes);
  runSimulation(simulationNodes, edges);

  return { nodes: toPositionedNodes(simulationNodes), edges };
}

function toPositionedNodes(simNodes: SimulationImageNode[]): ImageNode[] {
  return simNodes.map((node) => ({
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
}

export function WebHoundSocialGraph({ main, others }: GraphData) {
  const { nodes, edges } = buildPersonGraph({ main, others });
  return <SocialGraphView nodes={nodes} edges={edges} />;
}

const MAIN_POS: LayoutPosition = { x: 500, y: 400 };

// Hexagonal close packing for the incremental graph. Connection cells are
// assigned by insertion index (followees first, then followers), so a node's
// position depends only on its index: as new connections arrive the graph
// grows outward ring by ring, existing nodes never move and none ever
// overlap. A small deterministic jitter hides the grid while keeping the
// packing dense enough that pictures stay separated.
const CLUSTER_SPACING = 120;
const CLUSTER_JITTER = 10;

function hashJitter(seed: number, dim: number): number {
  const t = Math.sin(seed * 127.1 + dim * 311.7 + 1.0) * 43758.5453;
  return (t - Math.floor(t) - 0.5) * 2 * CLUSTER_JITTER;
}

function hexClusterPosition(index: number): LayoutPosition {
  if (index === 0) {
    return { x: MAIN_POS.x, y: MAIN_POS.y };
  }

  // Ring r starts after rings 0..r-1, which hold 1 + 3*(r-1)*r cells.
  let ring = 1;
  while (1 + 3 * ring * (ring + 1) <= index) {
    ring++;
  }
  const ringStart = 1 + 3 * (ring - 1) * ring;
  const offset = index - ringStart;
  const side = Math.floor(offset / ring);
  const step = offset % ring;

  const angle = (side * Math.PI) / 3;
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);
  const bx = Math.cos(angle + Math.PI / 3);
  const by = Math.sin(angle + Math.PI / 3);

  return {
    x:
      MAIN_POS.x +
      (ax * ring + (bx - ax) * step) * CLUSTER_SPACING +
      hashJitter(index, 0),
    y:
      MAIN_POS.y +
      (ay * ring + (by - ay) * step) * CLUSTER_SPACING +
      hashJitter(index, 1),
  };
}

function nodeAt(
  id: string,
  user: PersonData,
  kind: "main" | "to" | "by",
  center: LayoutPosition,
): ImageNode {
  const dims = nodeDims(kind === "main");
  return {
    id,
    type: "image",
    position: { x: center.x - dims.width / 2, y: center.y - dims.height / 2 },
    ...dims,
    data: { label: user.label, image: user.image, onClick: user.onClick, kind },
  };
}

function incrementalEdges(nodes: ImageNode[]): Edge[] {
  return nodes
    .filter((node) => node.id !== "1")
    .map((node) => ({
      id: `1-${node.id}`,
      source: "1",
      target: node.id,
      style: { stroke: node.data.kind === "by" ? "green" : "blue", strokeWidth: 2 },
      data: { kind: node.data.kind },
      sourceHandle: "center-source",
      targetHandle: "center-target",
    }));
}

export function WebHoundSocialGraphIncremental(props: {
  main: PersonData;
  followees: PersonData[];
  followers: PersonData[];
}) {
  const { main, followees, followers } = props;

  const nodes = useMemo<ImageNode[]>(() => {
    const others: ImageNode[] = [];
    const push = (user: PersonData, kind: "to" | "by") => {
      const index = others.length + 1;
      others.push(nodeAt(`${kind}-${user.label}`, user, kind, hexClusterPosition(index)));
    };
    followees.forEach((user) => push(user, "to"));
    followers.forEach((user) => push(user, "by"));
    return [nodeAt("1", main, "main", MAIN_POS), ...others];
  }, [main, followees, followers]);

  const edges = useMemo<Edge[]>(() => incrementalEdges(nodes), [nodes]);

  return <SocialGraphView nodes={nodes} edges={edges} />;
}
