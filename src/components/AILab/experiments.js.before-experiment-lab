export const ACTIVATIONS = {
  sigmoid: {
    id: "sigmoid",
    label: "sigmoid",
    formula: "1 / (1 + e^(-z))",
    fn: (z) => {
      const clamped = Math.max(-40, Math.min(40, z));
      return 1 / (1 + Math.exp(-clamped));
    },
  },
  relu: {
    id: "relu",
    label: "ReLU",
    formula: "max(0, z)",
    fn: (z) => Math.max(0, z),
  },
  tanh: {
    id: "tanh",
    label: "tanh",
    formula: "tanh(z)",
    fn: (z) => Math.tanh(z),
  },
  linear: {
    id: "linear",
    label: "linear",
    formula: "z",
    fn: (z) => z,
  },
};

export function runNeuron({ x1, x2, w1, w2, bias, activationId }) {
  const act = ACTIVATIONS[activationId] || ACTIVATIONS.sigmoid;
  const z = w1 * x1 + w2 * x2 + bias;
  const output = act.fn(z);
  let interpretation;
  if (act.id === "sigmoid") {
    interpretation =
      output >= 0.5
        ? "This single neuron is treated as class A because sigmoid(z) is at least 0.5. It is not a trained production model."
        : "This single neuron is treated as class B because sigmoid(z) is below 0.5. It is not a trained production model.";
  } else if (act.id === "relu") {
    interpretation =
      output === 0
        ? "ReLU is off. The weighted sum was zero or negative, so the neuron passed 0."
        : "ReLU is on. The weighted sum was positive, so the neuron passed z through unchanged.";
  } else if (act.id === "tanh") {
    interpretation =
      output >= 0
        ? "tanh(z) is non-negative, so the signal is on the positive side of [-1, 1]."
        : "tanh(z) is negative, so the signal is on the negative side of [-1, 1].";
  } else {
    interpretation = "Linear activation returns z itself. There is no extra non-linearity.";
  }

  return {
    model: "Single artificial neuron (forward pass only)",
    input: [x1, x2],
    weights: [w1, w2],
    bias,
    z,
    activationId: act.id,
    activationFormula: act.formula,
    output,
    process: "z = w1*x1 + w2*x2 + b, then output = " + act.formula,
    interpretation,
  };
}

export const TEXT_CATEGORIES = [
  { id: "ml", label: "Machine learning" },
  { id: "software", label: "Software engineering" },
  { id: "web", label: "Web development" },
];

export const TEXT_LEXICON = {
  neural: { ml: 2 },
  network: { ml: 1 },
  gradient: { ml: 2 },
  dataset: { ml: 1 },
  model: { ml: 1 },
  inference: { ml: 2 },
  weight: { ml: 1 },
  python: { ml: 1, software: 1 },
  algorithm: { ml: 1, software: 2 },
  bug: { software: 2 },
  test: { software: 2 },
  git: { software: 2 },
  function: { software: 1 },
  debug: { software: 2 },
  api: { software: 1, web: 2 },
  react: { web: 2 },
  css: { web: 2 },
  html: { web: 2 },
  browser: { web: 2 },
  component: { web: 1, software: 1 },
  frontend: { web: 2 },
  backend: { software: 1, web: 1 },
};

export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function classifyText(text) {
  const tokens = tokenize(text);
  const scores = { ml: 0, software: 0, web: 0 };
  const hits = [];

  tokens.forEach((token) => {
    const entry = TEXT_LEXICON[token];
    if (!entry) return;
    Object.keys(entry).forEach((cat) => {
      scores[cat] += entry[cat];
      hits.push({ token, category: cat, weight: entry[cat] });
    });
  });

  const ranked = TEXT_CATEGORIES
    .map((cat) => ({ ...cat, score: scores[cat.id] }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const unknown = tokens.length === 0 || top.score === 0;

  return {
    model: "Educational lexicon classifier",
    method: "Tokenize the input, look up each token in a small hand-written lexicon, add the weights, pick the highest score. This is not an LLM and not a trained model.",
    input: text,
    tokens,
    hits,
    scores,
    ranked,
    output: unknown ? "Unknown / not enough signal" : top.label,
    interpretation: unknown
      ? "No lexicon tokens were found. The classifier refuses to guess."
      : "Winning category is " + top.label + " with score " + top.score + " from the matched tokens listed above.",
  };
}

export const RECOMMENDER_ITEMS = [
  { id: "py-dsa", title: "Python data structures drills", tags: ["python", "dsa"] },
  { id: "c-memory", title: "C memory and pointers notes", tags: ["c", "dsa"] },
  { id: "ml-math", title: "Linear algebra for ML", tags: ["ml", "math"] },
  { id: "neuron", title: "Build a neuron from scratch", tags: ["ml", "python"] },
  { id: "react-ui", title: "React interface patterns", tags: ["react", "web"] },
  { id: "rest", title: "Designing small REST APIs", tags: ["backend", "web"] },
  { id: "git-flow", title: "Git debugging workflow", tags: ["git", "software"] },
  { id: "js-async", title: "JavaScript async control flow", tags: ["javascript", "web"] },
];

export const RECOMMENDER_TAGS = ["python", "c", "dsa", "ml", "math", "react", "web", "backend", "git", "software", "javascript"];

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
  const ranked = RECOMMENDER_ITEMS
    .map((item) => ({ ...item, score: cosine(user, tagVector(item.tags)) }))
    .sort((a, b) => b.score - a.score);

  return {
    model: "Content-based cosine recommender",
    method: "User preferences and each item become 0/1 tag vectors. Score = cosine similarity. Items with score 0 are not recommended.",
    input: selectedTags,
    dataset: RECOMMENDER_ITEMS,
    ranked,
    output: ranked.filter((item) => item.score > 0),
    interpretation: selectedTags.length === 0
      ? "No preferences selected, so every score is 0."
      : "Higher cosine means more tag overlap with the selected preferences.",
  };
}