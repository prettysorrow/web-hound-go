import {
  BaseEdge,
  EdgeLabelRenderer,
  getSimpleBezierPath,
  getStraightPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

export function MiddleArrowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  data,
}: EdgeProps<Edge<{ kind: "to" | "by" }>>) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const isBackward = data?.kind === "by";

  const dx = isBackward ? sourceX - targetX : targetX - sourceX;
  const dy = isBackward ? sourceY - targetY : targetY - sourceY;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const color = (style?.stroke as string) ?? "black";

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px) rotate(${angle}deg)`,
            pointerEvents: "all",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 12 12" style={{ overflow: "visible" }}>
            <polygon points="0,0 12,6 0,12" fill={color} />
          </svg>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
