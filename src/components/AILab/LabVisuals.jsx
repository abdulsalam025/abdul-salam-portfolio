import { IMAGE_LABELS, IMAGE_SAMPLES, KERNELS, RECOMMENDER_TAGS, TREE } from "./experiments";

const NN_KEYS = ["in", "h1", "h2", "h3", "out"];

function nodePos(layerIndex, nodeIndex, count, width, height) {
  const xs = [70, 170, 280, 390, 510];
  const span = height - 48;
  const y = count === 1 ? height / 2 : 28 + (span * nodeIndex) / (count - 1);
  return { x: xs[layerIndex], y: y };
}

export function PipelineStrip({ stages, active }) {
  return (
    <ol className="lab-pipe" aria-label="Processing pipeline">
      {stages.map((stage, index) => (
        <li key={stage} className={index === active ? "is-on" : index < active ? "is-done" : ""}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          {stage}
        </li>
      ))}
    </ol>
  );
}

export function NeuralNetViz({ network, viz, status }) {
  const layers = network.activations;
  const width = 580;
  const height = 280;
  const edges = [];
  for (let l = 0; l < layers.length - 1; l += 1) {
    layers[l].forEach(function (_, i) {
      layers[l + 1].forEach(function (__, j) {
        const a = nodePos(l, i, layers[l].length, width, height);
        const b = nodePos(l + 1, j, layers[l + 1].length, width, height);
        const live = viz.layerIndex > l || (viz.layerIndex === l + 1 && viz.nodeIndex >= j);
        const pulse = viz.layerIndex === l + 1 && viz.nodeIndex === j;
        edges.push({ key: l + "-" + i + "-" + j, a: a, b: b, live: live, pulse: pulse });
      });
    });
  }

  return (
    <svg className="lab-svg" viewBox={"0 0 " + width + " " + height} role="img" aria-label="Neural network graph">
      {edges.map(function (edge) {
        return (
          <line
            key={edge.key}
            x1={edge.a.x}
            y1={edge.a.y}
            x2={edge.b.x}
            y2={edge.b.y}
            className={"nn-edge" + (edge.live ? " is-live" : "") + (edge.pulse ? " is-pulse" : "")}
          />
        );
      })}
      {layers.map(function (layer, l) {
        return layer.map(function (value, i) {
          const p = nodePos(l, i, layer.length, width, height);
          const lit = Boolean(viz.lit[l + "-" + i]);
          const current = viz.layerIndex === l && viz.nodeIndex === i;
          return (
            <g key={l + "-" + i} transform={"translate(" + p.x + " " + p.y + ")"}>
              {current && <circle r="14" className="nn-halo" />}
              <circle r="8" className={"nn-node" + (lit ? " is-on" : "") + (current ? " is-now" : "")} />
              {lit && (
                <text y="3" className="nn-val">
                  {value.toFixed(2)}
                </text>
              )}
            </g>
          );
        });
      })}
      {["IN", "H1", "H2", "H3", "OUT"].map(function (label, i) {
        return (
          <text key={label} x={[70, 170, 280, 390, 510][i]} y="16" className="nn-cap">
            {label}
          </text>
        );
      })}
      {status !== "IDLE" && (
        <text x="16" y="272" className="nn-cap">
          DATA FLOW - FORWARD PASS - {network.top.label}
        </text>
      )}
    </svg>
  );
}

export function TextViz({ sentiment, viz }) {
  return (
    <div className="lab-textviz">
      <div className="lab-tokenrow">
        {(viz.tokens.length ? viz.tokens : sentiment.tokens.slice(0, 8)).map(function (token) {
          const hit = (viz.hits || []).find(function (item) { return item.token === token; });
          return (
            <span key={token + String(hit && hit.weight)} className={"lab-token" + (hit ? " is-hit" : "")}>
              {token}
              {hit ? <em>{(hit.weight > 0 ? "+" : "") + hit.weight.toFixed(1)}</em> : null}
            </span>
          );
        })}
      </div>
      <div className="lab-resultcard">
        <span className="eyebrow">CONNECTED OUTPUT</span>
        <strong>{viz.stage >= 5 ? sentiment.label : "-"}</strong>
        <p>
          {viz.stage >= 5
            ? (sentiment.confidence * 100).toFixed(1) + "% lexicon confidence - score " + sentiment.score.toFixed(2)
            : "Waiting for classifier stage"}
        </p>
        <small>Educational lexicon - not a trained model.</small>
      </div>
    </div>
  );
}

function HeatGrid({ values, width, height, gain, highlight }) {
  const max = Math.max(0.001, ...values.map(function (v) { return Math.abs(v); }));
  const cells = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const raw = values[y * width + x] || 0;
      const n = Math.min(1, Math.abs(raw) / max);
      const on = highlight && x >= highlight.x && x < highlight.x + 3 && y >= highlight.y && y < highlight.y + 3;
      cells.push(
        <i
          key={x + "-" + y}
          className={on ? "is-win" : raw < 0 ? "is-neg" : ""}
          style={{ opacity: 0.12 + n * 0.85 * Math.max(0.2, gain || 1) }}
        />
      );
    }
  }
  return (
    <div className="lab-gridpix" style={{ gridTemplateColumns: "repeat(" + width + ", 1fr)" }}>
      {cells}
    </div>
  );
}

function PixelGrid({ pixels, highlight }) {
  const cells = [];
  for (let y = 0; y < pixels.height; y += 1) {
    for (let x = 0; x < pixels.width; x += 1) {
      const i = (y * pixels.width + x) * 4;
      const r = pixels.data[i];
      const g = pixels.data[i + 1];
      const b = pixels.data[i + 2];
      const on = highlight && x >= highlight.x && x < highlight.x + 3 && y >= highlight.y && y < highlight.y + 3;
      cells.push(
        <i
          key={x + "-" + y}
          className={on ? "is-win" : ""}
          style={{ background: "rgb(" + r + "," + g + "," + b + ")", opacity: 1 }}
        />
      );
    }
  }
  return (
    <div className="lab-gridpix is-photo" style={{ gridTemplateColumns: "repeat(" + pixels.width + ", 1fr)" }}>
      {cells}
    </div>
  );
}

export function ImageViz({ image, viz, isCnn }) {
  const kx = (viz.kernel * 2) % 26;
  const ky = (viz.kernel * 3) % 26;
  const highlight = viz.stage >= 1 ? { x: kx, y: ky } : null;
  const gain = viz.mapGain || 0.2;
  const maps = [
    { name: KERNELS.edge.name, values: image.maps.edge },
    { name: KERNELS.sobel.name, values: image.maps.sobel },
    { name: KERNELS.blur.name, values: image.maps.blur },
  ];

  return (
    <div className={"lab-imgrid" + (isCnn ? " lab-cnn" : "")}>
      <figure>
        <figcaption>IMAGE - {image.pixels.name}</figcaption>
        {image.pixels.preview ? (
          <img className="lab-photo" src={image.pixels.preview} alt={image.pixels.name} />
        ) : (
          <PixelGrid pixels={image.pixels} highlight={highlight} />
        )}
      </figure>
      {(isCnn ? maps : maps.slice(0, 1)).map(function (map) {
        return (
          <figure key={map.name}>
            <figcaption>{map.name}</figcaption>
            <HeatGrid values={map.values} width={image.pixels.width} height={image.pixels.height} gain={gain} highlight={highlight} />
          </figure>
        );
      })}
      {!isCnn && (
        <figure>
          <figcaption>POOLED 16x16</figcaption>
          <HeatGrid values={image.pooled.values} width={image.pooled.width} height={image.pooled.height} gain={gain + 0.2} />
        </figure>
      )}
      <div className="lab-scores">
        {IMAGE_LABELS.map(function (label, index) {
          return (
            <div key={label} className={viz.stage >= 5 && image.top.label === label ? "is-top" : ""}>
              <span>{label}</span>
              <b>
                <i style={{ width: (viz.stage >= 5 ? image.scores[index] * 100 : 0) + "%" }} />
              </b>
              <em>{viz.stage >= 5 ? (image.scores[index] * 100).toFixed(1) + "%" : "-"}</em>
            </div>
          );
        })}
        <small>
          Connected pixel pipeline. Educational 4-class head - not ImageNet.
          {viz.stage >= 5 ? " Output: " + image.top.label + "." : ""}
        </small>
      </div>
    </div>
  );
}

export function RecsViz({ recs, viz }) {
  return (
    <div className="lab-recs">
      <div className="lab-userchip">
        <span className="eyebrow">USER PROFILE</span>
        <div>{(recs.input || []).map(function (tag) { return <b key={tag}>{tag}</b>; })}</div>
      </div>
      <ul>
        {recs.ranked.map(function (item, index) {
          const show = viz.reveal >= 4 || (viz.reveal >= 2 && index < 3);
          return (
            <li key={item.id} className={show ? "is-on" : ""} style={{ opacity: show ? 1 : 0.35 }}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <em>{viz.reveal >= 4 ? item.score.toFixed(3) : "-"}</em>
            </li>
          );
        })}
      </ul>
      <small>Score = cosine on 0/1 tag vectors.</small>
    </div>
  );
}

export function TransformerViz({ attention, viz }) {
  const tokens = attention.tokens;
  const n = tokens.length;
  const width = 560;
  const height = 220;
  const xs = tokens.map(function (_, i) { return 40 + (i * (width - 80)) / Math.max(1, n - 1); });
  const arcs = [];
  tokens.forEach(function (_, i) {
    tokens.forEach(function (__, j) {
      if (i === j) return;
      const w = attention.weights[i][j];
      if (w < 0.12) return;
      arcs.push({ i: i, j: j, w: w });
    });
  });
  return (
    <svg className="lab-svg" viewBox={"0 0 " + width + " " + height} role="img" aria-label="Toy self-attention">
      {arcs.map(function (arc) {
        const x1 = xs[arc.i];
        const x2 = xs[arc.j];
        const mid = (x1 + x2) / 2;
        const lift = 40 + arc.w * 70;
        return (
          <path
            key={arc.i + "-" + arc.j}
            d={"M " + x1 + " 150 Q " + mid + " " + (150 - lift) + " " + x2 + " 150"}
            className="attn-arc"
            style={{ opacity: 0.12 + arc.w * 0.8 * (viz.attn || 0) }}
          />
        );
      })}
      {tokens.map(function (token, i) {
        return (
          <g key={token + "-" + i} transform={"translate(" + xs[i] + " 150)"}>
            <rect x="-28" y="-16" width="56" height="32" rx="8" className={viz.stage >= 0 ? "tok-box is-on" : "tok-box"} />
            <text y="5">{token}</text>
          </g>
        );
      })}
      <text x="16" y="24" className="nn-cap">SELF-ATTENTION - STRENGTH = TOY SOFTMAX</text>
    </svg>
  );
}

function collectNodes(node, depth, x, acc) {
  if (depth == null) depth = 0;
  if (x == null) x = 0;
  if (acc == null) acc = [];
  acc.push(Object.assign({}, node, { depth: depth, x: x }));
  if (node.left) collectNodes(node.left, depth + 1, x - (2 - depth), acc);
  if (node.right) collectNodes(node.right, depth + 1, x + (2 - depth), acc);
  return acc;
}

export function TreeViz({ treeWalk, viz }) {
  const nodes = collectNodes(TREE);
  const width = 560;
  const height = 260;
  const pos = {};
  nodes.forEach(function (node) {
    pos[node.id] = {
      x: 280 + node.x * 78,
      y: 36 + node.depth * 70,
    };
  });
  const path = viz.path || [];
  return (
    <svg className="lab-svg" viewBox={"0 0 " + width + " " + height} role="img" aria-label="Decision tree path">
      {nodes.map(function (node) {
        if (!node.left && !node.right) return null;
        return ["left", "right"].map(function (side) {
          if (!node[side]) return null;
          const a = pos[node.id];
          const b = pos[node[side].id];
          const on = path.includes(node.id) && path.includes(node[side].id);
          return (
            <line
              key={node.id + "-" + side}
              x1={a.x}
              y1={a.y + 16}
              x2={b.x}
              y2={b.y - 16}
              className={"nn-edge" + (on ? " is-live" : "")}
            />
          );
        });
      })}
      {nodes.map(function (node) {
        const p = pos[node.id];
        const on = path.includes(node.id);
        const label = node.prediction || node.feature + " < " + node.threshold;
        return (
          <g key={node.id} transform={"translate(" + p.x + " " + p.y + ")"}>
            <rect x="-54" y="-16" width="108" height="32" rx="8" className={on ? "tok-box is-on" : "tok-box"} />
            <text y="5">{label}</text>
          </g>
        );
      })}
      {treeWalk.prediction && path.includes(treeWalk.path[treeWalk.path.length - 1]) && (
        <text x="16" y="250" className="nn-cap">
          PREDICTION - {treeWalk.prediction}
        </text>
      )}
    </svg>
  );
}

export function ClusterViz({ points, viz }) {
  const frame = viz.frame || { centroids: [], assignments: points.map(function () { return -1; }) };
  const pull = frame.type === "assign" || frame.type === "update" || frame.type === "converged" ? 0.22 : 0;
  return (
    <svg className="lab-svg" viewBox="0 0 200 120" role="img" aria-label="k-means feature space">
      {points.map(function (point, index) {
        const group = frame.assignments[index];
        const centroid = group >= 0 ? frame.centroids[group] : null;
        const x = centroid ? point.x + (centroid.x - point.x) * pull : point.x;
        const y = centroid ? point.y + (centroid.y - point.y) * pull : point.y;
        return (
          <circle
            key={point.id}
            cx={x * 2}
            cy={y * 1.1}
            r="2.2"
            className={"km-pt km-" + (group < 0 ? "none" : group)}
          />
        );
      })}
      {frame.centroids.map(function (c, i) {
        return (
          <g key={i}>
            <circle cx={c.x * 2} cy={c.y * 1.1} r="5" className={"km-c km-" + i} />
            <circle cx={c.x * 2} cy={c.y * 1.1} r="9" className={"km-c-ring km-" + i} />
          </g>
        );
      })}
      <text x="4" y="12" className="nn-cap">2D FEATURE SPACE</text>
    </svg>
  );
}

export function ExperimentVisual({ experiment, bundle, viz, status }) {
  if (experiment.id === "nn") {
    return <NeuralNetViz network={bundle.network} viz={viz} status={status} />;
  }
  if (experiment.id === "text") {
    return <TextViz sentiment={bundle.sentiment} viz={viz} />;
  }
  if (experiment.id === "image") {
    return <ImageViz image={bundle.image} viz={viz} isCnn={false} />;
  }
  if (experiment.id === "cnn") {
    return <ImageViz image={bundle.image} viz={viz} isCnn />;
  }
  if (experiment.id === "recs") {
    return <RecsViz recs={bundle.recs} viz={viz} />;
  }
  if (experiment.id === "transformer") {
    return <TransformerViz attention={bundle.attention} viz={viz} />;
  }
  if (experiment.id === "tree") {
    return <TreeViz treeWalk={bundle.treeWalk} viz={viz} />;
  }
  return <ClusterViz points={bundle.points} viz={viz} />;
}

function Table({ headers, rows }) {
  return (
    <table>
      <thead>
        <tr>{headers.map(function (h) { return <th key={h}>{h}</th>; })}</tr>
      </thead>
      <tbody>
        {rows.map(function (row, i) {
          return (
            <tr key={i} className={row.on ? "is-now" : ""}>
              {row.cells.map(function (cell, j) { return <td key={j}>{cell}</td>; })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function XRayTable({ experiment, bundle, viz }) {
  if (experiment.id === "nn") {
    const layerIndex = Math.max(0, viz.layerIndex);
    const layer = bundle.network.activations[layerIndex] || [];
    const weights = layerIndex === 0 ? null : bundle.network.weights[layerIndex - 1];
    return (
      <div className="lab-xray">
        <span className="eyebrow">NEURAL X-RAY - LAYER {String(layerIndex + 1).padStart(2, "0")}</span>
        <Table
          headers={["NODE", "ACTIVATION", "WEIGHT[0]"]}
          rows={layer.map(function (value, i) {
            return {
              on: viz.nodeIndex === i,
              cells: [
                "N" + String(i + 1).padStart(2, "0"),
                viz.lit[layerIndex + "-" + i] ? value.toFixed(3) : "-",
                weights ? Math.abs(weights[i][0]).toFixed(3) : "1.000",
              ],
            };
          })}
        />
        <small>{bundle.network.note}</small>
      </div>
    );
  }

  if (experiment.id === "text") {
    return (
      <div className="lab-xray">
        <span className="eyebrow">X-RAY - LEXICON HITS</span>
        <Table
          headers={["TOKEN", "WEIGHT"]}
          rows={(bundle.sentiment.hits.length ? bundle.sentiment.hits : [{ token: "(none)", weight: 0 }]).map(function (hit) {
            return {
              on: false,
              cells: [hit.token, hit.weight.toFixed(2)],
            };
          })}
        />
        <small>{bundle.sentiment.note}</small>
      </div>
    );
  }

  if (experiment.id === "image" || experiment.id === "cnn") {
    const f = bundle.image.features;
    return (
      <div className="lab-xray">
        <span className="eyebrow">X-RAY - PIXEL FEATURES</span>
        <Table
          headers={["FEATURE", "VALUE"]}
          rows={[
            ["brightness", f.brightness],
            ["contrast", f.contrast],
            ["edgeEnergy", f.edgeEnergy],
            ["highFreq", f.highFreq],
            ["warmBias", f.warmBias],
            ["greenBias", f.greenBias],
            ["centerDelta", f.centerDelta],
            ["centerWarm", f.centerWarm],
          ].map(function (pair) { return { on: false, cells: [pair[0], pair[1].toFixed(3)] }; })}
        />
        <Table
          headers={["CLASS", "SCORE"]}
          rows={bundle.image.ranked.map(function (row) {
            return {
              on: row.label === bundle.image.top.label,
              cells: [row.label, (row.value * 100).toFixed(1) + "%"],
            };
          })}
        />
        <small>{bundle.image.note}</small>
      </div>
    );
  }

  if (experiment.id === "recs") {
    return (
      <div className="lab-xray">
        <span className="eyebrow">X-RAY - COSINE TABLE</span>
        <Table
          headers={["ITEM", "TAGS", "SCORE"]}
          rows={bundle.recs.ranked.map(function (item) {
            return {
              on: item.score === bundle.recs.ranked[0].score,
              cells: [item.title, item.tags.join(", "), item.score.toFixed(3)],
            };
          })}
        />
        <small>{bundle.recs.note}</small>
      </div>
    );
  }

  if (experiment.id === "transformer") {
    const tokens = bundle.attention.tokens;
    return (
      <div className="lab-xray">
        <span className="eyebrow">X-RAY - ATTENTION ROW 0</span>
        <Table
          headers={["FROM", "TO", "WEIGHT"]}
          rows={tokens.map(function (token, i) {
            return {
              on: i === 0,
              cells: [tokens[0], token, bundle.attention.weights[0][i].toFixed(3)],
            };
          })}
        />
        <small>{bundle.attention.note}</small>
      </div>
    );
  }

  if (experiment.id === "tree") {
    return (
      <div className="lab-xray">
        <span className="eyebrow">X-RAY - DECISION PATH</span>
        <Table
          headers={["STEP", "NODE"]}
          rows={bundle.treeWalk.path.map(function (id, i) {
            return {
              on: (viz.path || []).includes(id),
              cells: [String(i + 1), id],
            };
          })}
        />
        <small>Prediction {bundle.treeWalk.prediction}. Hand-authored thresholds.</small>
      </div>
    );
  }

  const last = bundle.clusterFrames[bundle.clusterFrames.length - 1];
  return (
    <div className="lab-xray">
      <span className="eyebrow">X-RAY - CENTROIDS</span>
      <Table
        headers={["K", "X", "Y"]}
        rows={last.centroids.map(function (c, i) {
          return {
            on: false,
            cells: [String(i), c.x.toFixed(1), c.y.toFixed(1)],
          };
        })}
      />
      <small>Real k-means frames. Iteration cap = 4.</small>
    </div>
  );
}

export function LabControls({ experiment, inputs, setInputs, onUpload }) {
  if (experiment.id === "nn") {
    return (
      <div className="lab-inputs">
        <span className="eyebrow">INPUT VECTOR</span>
        {inputs.nnInput.map(function (value, i) {
          return (
            <label key={i}>
              x{i + 1}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={value}
                onChange={function (e) {
                  const next = inputs.nnInput.slice();
                  next[i] = Number(e.target.value);
                  setInputs({ nnInput: next });
                }}
              />
              <em>{value.toFixed(2)}</em>
            </label>
          );
        })}
      </div>
    );
  }
  if (experiment.id === "text") {
    return (
      <div className="lab-inputs">
        <span className="eyebrow">TEXT INPUT</span>
        <textarea
          rows="3"
          value={inputs.text}
          onChange={function (e) { setInputs({ text: e.target.value }); }}
        />
      </div>
    );
  }
  if (experiment.id === "image" || experiment.id === "cnn") {
    return (
      <div className="lab-inputs">
        <span className="eyebrow">IMAGE INPUT</span>
        <div className="lab-thumbs">
          {IMAGE_SAMPLES.map(function (sample) {
            return (
              <button
                key={sample.id}
                type="button"
                className={inputs.imageId === sample.id && !inputs.imagePixels ? "is-on" : ""}
                onClick={function () { setInputs({ imageId: sample.id, imagePixels: null }); }}
              >
                {sample.name}
              </button>
            );
          })}
          <label className="lab-upload">
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
            />
          </label>
        </div>
      </div>
    );
  }
  if (experiment.id === "recs") {
    return (
      <div className="lab-inputs">
        <span className="eyebrow">USER TAGS</span>
        <div className="lab-thumbs">
          {RECOMMENDER_TAGS.map(function (tag) {
            const on = inputs.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                className={on ? "is-on" : ""}
                onClick={function () {
                  setInputs({
                    tags: on ? inputs.tags.filter(function (t) { return t !== tag; }) : inputs.tags.concat(tag),
                  });
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if (experiment.id === "transformer") {
    return (
      <div className="lab-inputs">
        <span className="eyebrow">TOKEN SEQUENCE</span>
        <input
          type="text"
          value={inputs.tokensText}
          onChange={function (e) { setInputs({ tokensText: e.target.value }); }}
        />
      </div>
    );
  }
  if (experiment.id === "tree") {
    const fields = [
      { key: "study_hours", max: 10, step: 0.5 },
      { key: "practice_sets", max: 8, step: 1 },
      { key: "sleep_hours", max: 10, step: 0.5 },
    ];
    return (
      <div className="lab-inputs">
        <span className="eyebrow">SAMPLE FEATURES</span>
        {fields.map(function (field) {
          return (
            <label key={field.key}>
              {field.key}
              <input
                type="range"
                min="0"
                max={field.max}
                step={field.step}
                value={inputs.treeSample[field.key]}
                onChange={function (e) {
                  const next = Object.assign({}, inputs.treeSample);
                  next[field.key] = Number(e.target.value);
                  setInputs({ treeSample: next });
                }}
              />
              <em>{inputs.treeSample[field.key]}</em>
            </label>
          );
        })}
      </div>
    );
  }
  return (
    <div className="lab-inputs">
      <span className="eyebrow">CLUSTER INPUT</span>
      <p className="lab-hint">36 synthetic 2D points. Press RUN to execute k-means.</p>
    </div>
  );
}

export { NN_KEYS };