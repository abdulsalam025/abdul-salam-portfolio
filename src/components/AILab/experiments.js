/** Toy, browser-side experiment definitions.
 *  Nothing here is a trained production model.
 *  Where math runs, it is a small educational implementation.
 */

export const PHASES = [
  "IDLE",
  "RECEIVING INPUT",
  "PREPROCESSING",
  "FEATURE EXTRACTION",
  "FORWARD PROPAGATION",
  "ACTIVATION",
  "GENERATING OUTPUT",
  "COMPLETE",
];

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function relu(z) {
  return Math.max(0, z);
}

export function softmax(values) {
  const max = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - max));
  const sum = exps.reduce((acc, v) => acc + v, 0);
  return exps.map((v) => v / sum);
}

export function dense(input, weights, bias, activate) {
  return weights.map((row, i) => {
    let z = bias[i];
    for (let j = 0; j < input.length; j += 1) z += row[j] * input[j];
    return activate ? activate(z) : z;
  });
}

function randomMatrix(rows, cols, rng, scale = 0.85) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (rng() * 2 - 1) * scale)
  );
}

function randomBias(n, rng, scale = 0.15) {
  return Array.from({ length: n }, () => (rng() * 2 - 1) * scale);
}

export const SENTIMENT_LEXICON = {
  good: 1.2,
  great: 1.6,
  excellent: 1.8,
  love: 1.5,
  clear: 0.8,
  fast: 0.7,
  useful: 1.1,
  clean: 0.7,
  works: 0.9,
  helpful: 1.1,
  nice: 0.9,
  solid: 0.8,
  bad: -1.4,
  slow: -0.9,
  broken: -1.7,
  bug: -1.1,
  crash: -1.6,
  hate: -1.8,
  confusing: -1.2,
  worse: -1.3,
  fail: -1.4,
  error: -0.8,
  ugly: -1.1,
};

export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function classifySentiment(text) {
  const tokens = tokenize(text);
  const hits = [];
  let score = 0;
  tokens.forEach((token) => {
    if (SENTIMENT_LEXICON[token] == null) return;
    hits.push({ token, weight: SENTIMENT_LEXICON[token] });
    score += SENTIMENT_LEXICON[token];
  });
  const magnitude = hits.reduce((acc, hit) => acc + Math.abs(hit.weight), 0);
  const unknown = tokens.length === 0 || magnitude === 0;
  const positive = score >= 0;
  const confidence = unknown ? 0 : Math.min(0.97, 0.55 + magnitude / (magnitude + 3));
  return {
    model: "Educational sentiment lexicon",
    tokens,
    hits,
    score,
    unknown,
    label: unknown ? "UNKNOWN" : positive ? "POSITIVE" : "NEGATIVE",
    confidence,
    note: "Hand-written lexicon. Not a trained classifier.",
  };
}

export const RECOMMENDER_TAGS = ["python", "ml", "react", "web", "dsa", "backend"];

export const RECOMMENDER_ITEMS = [
  { id: "neuron", title: "Build a neuron", tags: ["python", "ml"] },
  { id: "linalg", title: "Linear algebra for ML", tags: ["ml", "dsa"] },
  { id: "react-ui", title: "React interface patterns", tags: ["react", "web"] },
  { id: "rest", title: "Small REST APIs", tags: ["backend", "web"] },
  { id: "trees", title: "Decision trees from scratch", tags: ["ml", "dsa"] },
  { id: "attn", title: "Attention notes", tags: ["ml", "python"] },
];

function tagVector(tags) {
  return RECOMMENDER_TAGS.map((tag) => (tags.includes(tag) ? 1 : 0));
}

export function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function recommend(selectedTags) {
  const user = tagVector(selectedTags);
  const ranked = RECOMMENDER_ITEMS.map((item) => ({
    ...item,
    score: cosine(user, tagVector(item.tags)),
  })).sort((a, b) => b.score - a.score);
  return {
    model: "Content-based cosine recommender",
    input: selectedTags,
    ranked,
    output: ranked.filter((item) => item.score > 0),
    note: "Cosine on 0/1 tag vectors. Not collaborative filtering.",
  };
}

export const DEFAULT_NN_INPUT = [0.82, 0.31, 0.64, 0.18];

export function runTinyNetwork(seed = 7, input = DEFAULT_NN_INPUT) {
  const rng = mulberry32(seed);
  const vector = input.slice(0, 4);
  while (vector.length < 4) vector.push(0);
  const sizes = [4, 6, 6, 5, 3];
  const weights = [];
  const biases = [];
  for (let i = 0; i < sizes.length - 1; i += 1) {
    weights.push(randomMatrix(sizes[i + 1], sizes[i], rng));
    biases.push(randomBias(sizes[i + 1], rng));
  }
  const activations = [vector.slice()];
  let current = vector;
  for (let i = 0; i < weights.length; i += 1) {
    const isLast = i === weights.length - 1;
    current = dense(current, weights[i], biases[i], isLast ? null : relu);
    if (isLast) current = softmax(current);
    activations.push(current.slice());
  }
  const labels = ["CLASS A", "CLASS B", "CLASS C"];
  const top = activations[activations.length - 1]
    .map((value, index) => ({ label: labels[index], value }))
    .sort((a, b) => b.value - a.value)[0];
  const paramCount = weights.reduce((acc, matrix) => acc + matrix.length * matrix[0].length, 0)
    + biases.reduce((acc, bias) => acc + bias.length, 0);
  return {
    sizes,
    weights,
    biases,
    activations,
    labels,
    top,
    input: vector,
    paramCount,
    note: "Untrained toy network. Weights are seeded random. Forward pass only.",
  };
}

export function toyAttention(tokens, seed = 11) {
  const list = tokens.length ? tokens : ["ML"];
  const rng = mulberry32(seed);
  const dim = 4;
  const embeddings = list.map(() => Array.from({ length: dim }, () => rng() * 2 - 1));
  const scores = list.map((_, i) =>
    list.map((__, j) => {
      let dot = 0;
      for (let d = 0; d < dim; d += 1) dot += embeddings[i][d] * embeddings[j][d];
      return dot / Math.sqrt(dim);
    })
  );
  const weights = scores.map((row) => softmax(row));
  return {
    tokens: list,
    embeddings,
    weights,
    note: "Untrained toy attention: softmax(QK^T / sqrt(d)) on random embeddings.",
  };
}

const TREE = {
  id: "root",
  feature: "study_hours",
  threshold: 4,
  left: {
    id: "n1",
    feature: "practice_sets",
    threshold: 2,
    left: { id: "leaf0", prediction: "REVIEW" },
    right: { id: "leaf1", prediction: "PRACTICE" },
  },
  right: {
    id: "n2",
    feature: "sleep_hours",
    threshold: 6,
    left: { id: "leaf2", prediction: "REST" },
    right: { id: "leaf3", prediction: "READY" },
  },
};

export const TREE_SAMPLE = { study_hours: 6.5, practice_sets: 3, sleep_hours: 7 };

export function walkTree(node, sample, path = []) {
  const nextPath = [...path, node.id];
  if (node.prediction) return { path: nextPath, prediction: node.prediction };
  const goLeft = sample[node.feature] < node.threshold;
  return walkTree(goLeft ? node.left : node.right, sample, nextPath);
}

export function kmeans(points, k = 3, iterations = 4, seed = 21) {
  const rng = mulberry32(seed);
  let centroids = Array.from({ length: k }, () => {
    const pick = points[Math.floor(rng() * points.length)];
    return { x: pick.x + (rng() - 0.5) * 8, y: pick.y + (rng() - 0.5) * 8 };
  });
  const frames = [{ type: "initialize", centroids: cloneCentroids(centroids), assignments: points.map(() => -1) }];
  let assignments = points.map(() => 0);
  for (let iter = 0; iter < iterations; iter += 1) {
    assignments = points.map((point) => nearest(point, centroids));
    frames.push({ type: "assign", centroids: cloneCentroids(centroids), assignments: assignments.slice() });
    centroids = centroids.map((_, index) => {
      const members = points.filter((__, i) => assignments[i] === index);
      if (members.length === 0) return centroids[index];
      return {
        x: members.reduce((acc, p) => acc + p.x, 0) / members.length,
        y: members.reduce((acc, p) => acc + p.y, 0) / members.length,
      };
    });
    frames.push({ type: "update", centroids: cloneCentroids(centroids), assignments: assignments.slice() });
  }
  frames.push({ type: "converged", centroids: cloneCentroids(centroids), assignments: assignments.slice() });
  return frames;
}

function nearest(point, centroids) {
  let best = 0;
  let bestDist = Infinity;
  centroids.forEach((c, i) => {
    const d = (point.x - c.x) ** 2 + (point.y - c.y) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return best;
}

function cloneCentroids(centroids) {
  return centroids.map((c) => ({ x: c.x, y: c.y }));
}

export function makeClusterPoints(seed = 19) {
  const rng = mulberry32(seed);
  const centers = [
    { x: 28, y: 30 },
    { x: 72, y: 34 },
    { x: 50, y: 72 },
  ];
  const points = [];
  centers.forEach((center, cluster) => {
    for (let i = 0; i < 12; i += 1) {
      points.push({
        id: cluster + "-" + i,
        x: center.x + (rng() - 0.5) * 22,
        y: center.y + (rng() - 0.5) * 22,
        home: cluster,
      });
    }
  });
  return points;
}

export const IMAGE_SIZE = 32;

export const IMAGE_SAMPLES = [
  { id: "digit", name: "Stroke 7", hint: "high-contrast line" },
  { id: "scene", name: "Horizon", hint: "smooth color field" },
  { id: "face", name: "Portrait", hint: "centered oval" },
  { id: "noise", name: "Texture", hint: "high frequency" },
];

export const IMAGE_LABELS = ["STROKE", "SCENE", "PORTRAIT", "TEXTURE"];

export const KERNELS = {
  edge: { name: "EDGE", k: [-1, -1, -1, -1, 8, -1, -1, -1, -1], div: 1 },
  sobel: { name: "SOBEL-X", k: [-1, 0, 1, -2, 0, 2, -1, 0, 1], div: 1 },
  blur: { name: "BLUR", k: [1, 2, 1, 2, 4, 2, 1, 2, 1], div: 16 },
};

function setPx(data, size, x, y, r, g, b) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const i = (y * size + x) * 4;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  data[i + 3] = 255;
}

function stampDisk(data, size, cx, cy, rad, r, g, b) {
  const r2 = rad * rad;
  const x0 = Math.max(0, Math.floor(cx - rad));
  const y0 = Math.max(0, Math.floor(cy - rad));
  const x1 = Math.min(size - 1, Math.ceil(cx + rad));
  const y1 = Math.min(size - 1, Math.ceil(cy + rad));
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) setPx(data, size, x, y, r, g, b);
    }
  }
}

function stampLine(data, size, x0, y0, x1, y1, width, r, g, b) {
  const steps = Math.max(size * 3, Math.hypot(x1 - x0, y1 - y0) * 3);
  for (let s = 0; s <= steps; s += 1) {
    const t = s / steps;
    stampDisk(data, size, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, width, r, g, b);
  }
}

export function renderSampleData(id, size = IMAGE_SIZE) {
  const data = new Array(size * size * 4).fill(0);
  for (let i = 3; i < data.length; i += 4) data[i] = 255;
  if (id === "digit") {
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) setPx(data, size, x, y, 6, 16, 24);
    }
    stampLine(data, size, size * 0.16, size * 0.2, size * 0.82, size * 0.18, size * 0.055, 232, 251, 255);
    stampLine(data, size, size * 0.82, size * 0.18, size * 0.34, size * 0.88, size * 0.055, 232, 251, 255);
    return data;
  }
  if (id === "scene") {
    for (let y = 0; y < size; y += 1) {
      const t = y / (size - 1);
      let r;
      let g;
      let b;
      if (t < 0.48) {
        const u = t / 0.48;
        r = 20 + u * 106;
        g = 54 + u * 146;
        b = 92 + u * 131;
      } else {
        const u = (t - 0.48) / 0.52;
        r = 45 - u * 37;
        g = 106 - u * 78;
        b = 79 - u * 58;
      }
      for (let x = 0; x < size; x += 1) setPx(data, size, x, y, r, g, b);
    }
    stampDisk(data, size, size * 0.74, size * 0.18, size * 0.09, 244, 227, 178);
    return data;
  }
  if (id === "face") {
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) setPx(data, size, x, y, 27, 40, 56);
    }
    const cx = size / 2;
    const cy = size * 0.52;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const nx = (x - cx) / (size * 0.28);
        const ny = (y - cy) / (size * 0.34);
        if (nx * nx + ny * ny <= 1) setPx(data, size, x, y, 224, 184, 154);
      }
    }
    stampDisk(data, size, size * 0.4, size * 0.46, size * 0.035, 42, 28, 20);
    stampDisk(data, size, size * 0.6, size * 0.46, size * 0.035, 42, 28, 20);
    stampLine(data, size, size * 0.42, size * 0.64, size * 0.58, size * 0.64, size * 0.02, 139, 58, 58);
    return data;
  }
  const rng = mulberry32(33);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const n = Math.floor(rng() * 220);
      setPx(data, size, x, y, n, Math.floor(n * 0.55), 160 + Math.floor(rng() * 80));
    }
  }
  return data;
}

export function paintSample(ctx, id, size) {
  const data = renderSampleData(id, size);
  const image = ctx.createImageData(size, size);
  for (let i = 0; i < data.length; i += 1) image.data[i] = data[i];
  ctx.putImageData(image, 0, 0);
}

function previewFromData(data, size) {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(size, size);
  for (let i = 0; i < data.length; i += 1) image.data[i] = data[i];
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

export function makeSamplePixels(id, size = IMAGE_SIZE) {
  const data = renderSampleData(id, size);
  return {
    id,
    name: (IMAGE_SAMPLES.find((item) => item.id === id) || {}).name || id,
    width: size,
    height: size,
    data,
    preview: previewFromData(data, size),
    source: "sample",
  };
}

export function pixelsFromImageData(imageData, name = "upload") {
  return {
    id: "upload",
    name,
    width: imageData.width,
    height: imageData.height,
    data: Array.from(imageData.data),
    preview: "",
    source: "upload",
  };
}

export function emptyPixels(size = IMAGE_SIZE, id = "digit") {
  const data = new Array(size * size * 4).fill(0);
  for (let i = 3; i < data.length; i += 4) data[i] = 255;
  return { id, name: id, width: size, height: size, data, preview: "", source: "empty" };
}

function lumaAt(pixels, x, y) {
  const i = (y * pixels.width + x) * 4;
  return (0.299 * pixels.data[i] + 0.587 * pixels.data[i + 1] + 0.114 * pixels.data[i + 2]) / 255;
}

export function convolveGray(pixels, kernel, divisor) {
  const width = pixels.width;
  const height = pixels.height;
  const out = new Array(width * height).fill(0);
  const k = kernel;
  const div = divisor || 1;
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      let z = 0;
      let ki = 0;
      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          z += lumaAt(pixels, x + kx, y + ky) * k[ki];
          ki += 1;
        }
      }
      out[y * width + x] = z / div;
    }
  }
  return out;
}

export function pool2(values, width, height) {
  const pw = Math.floor(width / 2);
  const ph = Math.floor(height / 2);
  const out = new Array(pw * ph).fill(0);
  for (let y = 0; y < ph; y += 1) {
    for (let x = 0; x < pw; x += 1) {
      const a = values[(y * 2) * width + x * 2];
      const b = values[(y * 2) * width + x * 2 + 1];
      const c = values[(y * 2 + 1) * width + x * 2];
      const d = values[(y * 2 + 1) * width + x * 2 + 1];
      out[y * pw + x] = Math.max(a, b, c, d);
    }
  }
  return { values: out, width: pw, height: ph };
}

export function imageFeatures(pixels) {
  const width = pixels.width;
  const height = pixels.height;
  const data = pixels.data;
  const n = width * height;
  let sum = 0;
  let sum2 = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  let center = 0;
  let centerN = 0;
  let centerWarm = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const yv = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      sum += yv;
      sum2 += yv * yv;
      r += data[i] / 255;
      g += data[i + 1] / 255;
      b += data[i + 2] / 255;
      const cx = x / width - 0.5;
      const cy = y / height - 0.5;
      if (cx * cx + cy * cy < 0.08) {
        center += yv;
        centerWarm += (data[i] - data[i + 2]) / 255;
        centerN += 1;
      }
    }
  }
  const brightness = sum / n;
  const contrast = Math.sqrt(Math.max(0, sum2 / n - brightness * brightness));
  const edges = convolveGray(pixels, KERNELS.edge.k, 1);
  let edgeEnergy = 0;
  for (let i = 0; i < edges.length; i += 1) edgeEnergy += Math.abs(edges[i]);
  edgeEnergy /= n;
  let highFreq = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 1; x < width; x += 1) {
      highFreq += Math.abs(lumaAt(pixels, x, y) - lumaAt(pixels, x - 1, y));
    }
  }
  highFreq /= n;
  return {
    brightness: brightness,
    contrast: contrast,
    edgeEnergy: edgeEnergy,
    highFreq: highFreq,
    colorVar: Math.abs(r - g) / n + Math.abs(g - b) / n,
    greenBias: g / n,
    warmBias: (r - b) / n,
    centerMass: centerN ? center / centerN : brightness,
    centerWarm: centerN ? centerWarm / centerN : 0,
    centerDelta: (centerN ? center / centerN : brightness) - brightness,
  };
}

export function classifyImagePixels(pixels) {
  const features = imageFeatures(pixels);
  const maps = {
    edge: convolveGray(pixels, KERNELS.edge.k, 1),
    sobel: convolveGray(pixels, KERNELS.sobel.k, 1),
    blur: convolveGray(pixels, KERNELS.blur.k, KERNELS.blur.div),
  };
  const pooled = pool2(maps.edge, pixels.width, pixels.height);
  const logits = [
    1.6 * features.edgeEnergy + 2.4 * features.contrast - 1.8 * features.colorVar - 2.2 * features.highFreq,
    3.4 * features.greenBias - 2.6 * features.edgeEnergy - 2.0 * features.highFreq + 0.4 * features.brightness,
    4.8 * features.centerDelta + 3.2 * features.centerWarm + 1.4 * features.centerMass - 0.8 * features.highFreq,
    4.2 * features.highFreq + 2.2 * features.colorVar - 1.4 * features.contrast - 1.1 * features.centerDelta,
  ];
  const scores = softmax(logits);
  const ranked = IMAGE_LABELS.map((label, index) => ({ label: label, value: scores[index] }))
    .sort((a, b) => b.value - a.value);
  return {
    model: "Educational 4-class pixel classifier",
    pixels: pixels,
    features: features,
    maps: maps,
    pooled: pooled,
    labels: IMAGE_LABELS,
    scores: scores,
    ranked: ranked,
    top: ranked[0],
    note: "Real pixels, real 3x3 convolution and pooling. Linear head is hand-authored, not ImageNet.",
  };
}

export function downsampleImageElement(img, size = IMAGE_SIZE) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#061018";
  ctx.fillRect(0, 0, size, size);
  const scale = Math.min(size / img.width, size / img.height);
  const w = Math.max(1, img.width * scale);
  const h = Math.max(1, img.height * scale);
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  return {
    id: "upload",
    name: "Uploaded image",
    width: size,
    height: size,
    data: Array.from(ctx.getImageData(0, 0, size, size).data),
    preview: canvas.toDataURL("image/png"),
    source: "upload",
  };
}

export const EXPERIMENTS = [
  {
    id: "nn",
    code: "01",
    name: "Neural Network",
    type: "Classification",
    activation: "ReLU",
    honest: "Untrained toy MLP. Forward pass uses seeded random weights on your 4-D input.",
    pipeline: ["INPUT", "PREPROCESS", "INPUT LAYER", "HIDDEN 01", "HIDDEN 02", "HIDDEN 03", "ACTIVATION", "OUTPUT"],
  },
  {
    id: "text",
    code: "02",
    name: "Text Classification",
    type: "Sentiment (lexicon)",
    activation: "Lexicon sum",
    honest: "Hand-written polarity lexicon. Type text and run. Not an LLM.",
    pipeline: ["TEXT INPUT", "TOKENIZATION", "EMBEDDINGS", "FEATURE REPRESENTATION", "CLASSIFIER", "OUTPUT"],
    sample: "This interface is clean, useful and works great for debugging.",
  },
  {
    id: "image",
    code: "03",
    name: "Image Classification",
    type: "Pixel features + linear head",
    activation: "Softmax",
    honest: "Connected. 32x32 pixels, 3x3 convolution, pool, hand-authored 4-class head. Not ImageNet.",
    pipeline: ["IMAGE INPUT", "CONVOLUTION", "FEATURE MAP", "POOLING", "FEATURE EXTRACTION", "CLASSIFIER", "OUTPUT"],
  },
  {
    id: "recs",
    code: "04",
    name: "Recommendation System",
    type: "Content-based",
    activation: "Cosine",
    honest: "Cosine similarity on tag vectors. Toggle tags and run.",
    pipeline: ["USER PROFILE", "USER FEATURES", "ITEM FEATURES", "EMBEDDINGS", "SIMILARITY", "RANKING", "RECOMMENDATIONS"],
    selectedTags: ["python", "ml"],
  },
  {
    id: "transformer",
    code: "05",
    name: "Transformer",
    type: "Self-attention (toy)",
    activation: "Softmax",
    honest: "Untrained toy attention on random embeddings of your tokens.",
    pipeline: ["TOKENS", "EMBEDDINGS", "POSITIONAL ENCODING", "SELF-ATTENTION", "MULTI-HEAD", "FEED FORWARD", "OUTPUT"],
    tokens: ["ML", "systems", "need", "data", "flow", "care"],
  },
  {
    id: "cnn",
    code: "06",
    name: "CNN",
    type: "3x3 filters on pixels",
    activation: "ReLU",
    honest: "Same connected image. Three real kernels (edge, sobel, blur) then pool. Educational head.",
    pipeline: ["IMAGE", "CONVOLUTION", "FEATURE MAP", "POOLING", "FEATURE EXTRACTION", "CLASSIFIER"],
  },
  {
    id: "tree",
    code: "07",
    name: "Decision Tree",
    type: "Rule path",
    activation: "Threshold",
    honest: "Hand-authored 3-feature tree. Move the sliders and the path is computed.",
    pipeline: ["ROOT", "FEATURE TEST", "BRANCH", "FEATURE TEST", "BRANCH", "PREDICTION"],
    tree: TREE,
    sample: TREE_SAMPLE,
  },
  {
    id: "cluster",
    code: "08",
    name: "Clustering",
    type: "k-means",
    activation: "Nearest centroid",
    honest: "Real k-means on synthetic 2D points. k=3, 4 iterations.",
    pipeline: ["INITIALIZE", "ASSIGN", "UPDATE CENTROIDS", "REPEAT", "CONVERGED"],
  },
];

export function getExperiment(id) {
  return EXPERIMENTS.find((item) => item.id === id) || EXPERIMENTS[0];
}

export function countParams(experiment, extras) {
  if (experiment.id === "nn") return extras.network.paramCount;
  if (experiment.id === "recs") return RECOMMENDER_TAGS.length * RECOMMENDER_ITEMS.length;
  if (experiment.id === "transformer") return extras.attention.tokens.length * 4 * 3;
  if (experiment.id === "tree") return 3;
  if (experiment.id === "cluster") return extras.points.length * 2;
  if (experiment.id === "image" || experiment.id === "cnn") return IMAGE_SIZE * IMAGE_SIZE * 3 + 16;
  return 0;
}

export function defaultInputs() {
  return {
    nnInput: DEFAULT_NN_INPUT.slice(),
    text: EXPERIMENTS[1].sample,
    imageId: "digit",
    imagePixels: null,
    tags: ["python", "ml"],
    tokensText: EXPERIMENTS[4].tokens.join(" "),
    treeSample: { study_hours: TREE_SAMPLE.study_hours, practice_sets: TREE_SAMPLE.practice_sets, sleep_hours: TREE_SAMPLE.sleep_hours },
  };
}

export { TREE };