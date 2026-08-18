import { useEffect, useId, useState } from "react";
import "./ArchitectureViewer.css";

export default function ArchitectureViewer({ nodes = [], title = "System architecture" }) {
  const uid = useId();
  const [activeId, setActiveId] = useState(nodes[0]?.id || null);

  useEffect(() => {
    setActiveId(nodes[0]?.id || null);
  }, [nodes]);

  if (!nodes.length) {
    return (
      <div className="arch-empty" role="status">
        No architecture is documented for this project yet.
      </div>
    );
  }

  const active = nodes.find((node) => node.id === activeId) || nodes[0];
  const width = 320;
  const nodeH = 56;
  const gap = 36;
  const padX = 16;
  const padY = 12;
  const height = padY * 2 + nodes.length * nodeH + (nodes.length - 1) * gap;

  const selectByIndex = (index) => {
    const next = nodes[(index + nodes.length) % nodes.length];
    setActiveId(next.id);
  };

  const onKeyDown = (event) => {
    const index = nodes.findIndex((node) => node.id === active.id);
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectByIndex(index + 1);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectByIndex(index - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveId(nodes[0].id);
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveId(nodes[nodes.length - 1].id);
    }
  };

  return (
    <div className="arch-viewer">
      <p className="arch-hint">
        Select a node. Use arrow keys when the diagram is focused.
      </p>

      <div className="arch-layout">
        <div
          className="arch-svg-wrap"
          tabIndex={0}
          role="listbox"
          aria-label={title}
          aria-activedescendant={uid + "-" + active.id}
          onKeyDown={onKeyDown}
        >
          <svg
            className="arch-svg"
            viewBox={"0 0 " + width + " " + height}
            width="100%"
            height={height}
            role="presentation"
          >
            <defs>
              <marker
                id={uid + "-arrow"}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" className="arch-marker" />
              </marker>
            </defs>

            {nodes.map((node, index) => {
              if (index === nodes.length - 1) return null;
              const x = width / 2;
              const y1 = padY + index * (nodeH + gap) + nodeH;
              const y2 = y1 + gap;
              return (
                <line
                  key={"edge-" + node.id}
                  x1={x}
                  y1={y1 + 2}
                  x2={x}
                  y2={y2 - 6}
                  className="arch-edge"
                  markerEnd={"url(#" + uid + "-arrow)"}
                />
              );
            })}

            {nodes.map((node, index) => {
              const x = padX;
              const y = padY + index * (nodeH + gap);
              const isActive = node.id === active.id;
              return (
                <g
                  key={node.id}
                  id={uid + "-" + node.id}
                  role="option"
                  aria-selected={isActive}
                  className={isActive ? "arch-node is-active" : "arch-node"}
                  onClick={() => setActiveId(node.id)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={x}
                    y={y}
                    width={width - padX * 2}
                    height={nodeH}
                    rx="12"
                    className="arch-node-shape"
                  />
                  <text x={x + 14} y={y + 22} className="arch-node-index">
                    {String(index + 1).padStart(2, "0")}
                  </text>
                  <text x={x + 48} y={y + 24} className="arch-node-label">
                    {node.label}
                  </text>
                  <text x={x + 48} y={y + 42} className="arch-node-tech">
                    {node.technology}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="case-block arch-detail" aria-live="polite">
          <h4>{active.label}</h4>
          <p><strong>Role.</strong> {active.role}</p>
          <p><strong>Responsibility.</strong> {active.responsibility}</p>
          <p><strong>Data flow.</strong> {active.dataFlow}</p>
          <p><strong>Technology.</strong> {active.technology}</p>
        </aside>
      </div>
    </div>
  );
}