import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EXPERIMENTS,
  classifyImagePixels,
  classifySentiment,
  countParams,
  defaultInputs,
  getExperiment,
  kmeans,
  makeClusterPoints,
  makeSamplePixels,
  recommend,
  runTinyNetwork,
  toyAttention,
  walkTree,
} from "./experiments";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function padTime(ms) {
  const total = Math.max(0, ms);
  const s = Math.floor(total / 1000);
  const rem = total % 1000;
  return String(s).padStart(2, "0") + ":" + String(rem).padStart(3, "0");
}

function layerName(index, total) {
  return String(index + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
}

function tokenList(text) {
  const parts = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
  return parts.length ? parts : ["ML"];
}

function resolvePixels(inputs) {
  if (inputs.imagePixels && inputs.imagePixels.data && inputs.imagePixels.data.length) {
    return inputs.imagePixels;
  }
  return makeSamplePixels(inputs.imageId || "digit");
}

function buildBundle(experiment, seed, inputs) {
  const network = runTinyNetwork(seed, inputs.nnInput);
  const sentiment = classifySentiment(inputs.text || EXPERIMENTS[1].sample);
  const recs = recommend(inputs.tags && inputs.tags.length ? inputs.tags : ["python"]);
  const attention = toyAttention(tokenList(inputs.tokensText), seed + 3);
  const treeWalk = walkTree(EXPERIMENTS[6].tree, inputs.treeSample || EXPERIMENTS[6].sample);
  const points = makeClusterPoints(seed + 5);
  const clusterFrames = kmeans(points, 3, 4, seed + 9);
  const image = classifyImagePixels(resolvePixels(inputs));
  return { network, sentiment, recs, attention, treeWalk, points, clusterFrames, image };
}

function makeNNSteps(bundle) {
  const activations = bundle.network.activations;
  const weights = bundle.network.weights;
  const steps = [];
  const layerMeta = [
    { key: "in", label: "INPUT LAYER", phase: "FEATURE EXTRACTION" },
    { key: "h1", label: "HIDDEN LAYER 01", phase: "FORWARD PROPAGATION" },
    { key: "h2", label: "HIDDEN LAYER 02", phase: "FORWARD PROPAGATION" },
    { key: "h3", label: "HIDDEN LAYER 03", phase: "ACTIVATION" },
    { key: "out", label: "OUTPUT", phase: "GENERATING OUTPUT" },
  ];
  steps.push({
    phase: "RECEIVING INPUT",
    op: "Receiving Input",
    log: "Input vector accepted [" + bundle.network.input.map((v) => v.toFixed(2)).join(", ") + "]",
    stage: 0,
    delay: 220,
  });
  steps.push({
    phase: "PREPROCESSING",
    op: "Preprocessing",
    log: "Preprocessing complete",
    stage: 1,
    delay: 240,
  });
  activations.forEach((layer, layerIndex) => {
    const meta = layerMeta[layerIndex];
    layer.forEach((value, nodeIndex) => {
      const weight =
        layerIndex === 0
          ? 1
          : Math.abs(weights[layerIndex - 1][nodeIndex][0] || 0);
      steps.push({
        phase: meta.phase,
        op: layerIndex === 0 ? "Input Encoding" : layerIndex === activations.length - 1 ? "Softmax Output" : "Forward Propagation",
        log:
          layerIndex === 0
            ? "Input node N" + (nodeIndex + 1) + " loaded"
            : meta.label + " node N" + (nodeIndex + 1) + " activated",
        stage: layerIndex + 2,
        layerIndex: layerIndex,
        nodeIndex: nodeIndex,
        node: "N" + String(nodeIndex + 1).padStart(2, "0"),
        layerLabel: layerName(layerIndex, activations.length),
        activation: value,
        weight: weight,
        delay: 90,
        kind: "nn-node",
      });
    });
  });
  steps.push({
    phase: "COMPLETE",
    op: "Inference Complete",
    log: "Output generated - " + bundle.network.top.label,
    stage: 7,
    delay: 0,
  });
  return steps;
}

function makePipelineSteps(logs, extra) {
  const mapped = [
    { phase: "RECEIVING INPUT", op: "Receiving Input" },
    { phase: "PREPROCESSING", op: "Preprocessing" },
    { phase: "FEATURE EXTRACTION", op: "Feature Extraction" },
    { phase: "FORWARD PROPAGATION", op: "Forward Pass" },
    { phase: "ACTIVATION", op: "Activation" },
    { phase: "GENERATING OUTPUT", op: "Generating Output" },
    { phase: "COMPLETE", op: "Complete" },
  ];
  return mapped.map((item, index) => ({
    phase: item.phase,
    op: item.op,
    log: logs[index] || item.op,
    stage: index,
    delay: item.phase === "COMPLETE" ? 0 : 280,
    ...(extra ? extra(index, item) : {}),
  }));
}

function buildSteps(experiment, bundle) {
  if (experiment.id === "nn") return makeNNSteps(bundle);
  if (experiment.id === "text") {
    const tokens = bundle.sentiment.tokens.slice(0, 8);
    return [
      { phase: "RECEIVING INPUT", op: "Receiving Input", log: "Text input received", stage: 0, delay: 220, tokens: [] },
      { phase: "PREPROCESSING", op: "Tokenization", log: "Tokenization complete (" + tokens.length + " tokens)", stage: 1, delay: 260, tokens: tokens },
      { phase: "FEATURE EXTRACTION", op: "Embedding Lookup", log: "Token features assembled", stage: 2, delay: 260, tokens: tokens, hits: bundle.sentiment.hits },
      { phase: "FORWARD PROPAGATION", op: "Feature Representation", log: "Lexicon weights applied", stage: 3, delay: 260, tokens: tokens, hits: bundle.sentiment.hits },
      { phase: "ACTIVATION", op: "Classifier", log: "Polarity score " + bundle.sentiment.score.toFixed(2), stage: 4, delay: 240, score: bundle.sentiment.score },
      { phase: "GENERATING OUTPUT", op: "Generating Output", log: "Label " + bundle.sentiment.label, stage: 5, delay: 240 },
      { phase: "COMPLETE", op: "Complete", log: "Classification complete", stage: 6, delay: 0 },
    ];
  }
  if (experiment.id === "image" || experiment.id === "cnn") {
    const top = bundle.image.top;
    return makePipelineSteps(
      [
        "Image tensor accepted (" + bundle.image.pixels.width + "x" + bundle.image.pixels.height + ")",
        "3x3 convolution window started",
        "Feature maps written (edge / sobel / blur)",
        "2x2 max-pool reduced spatial size",
        "Dense features extracted from pixels",
        "Class scores written - " + top.label + " " + (top.value * 100).toFixed(1) + "%",
        "Pipeline complete - educational head",
      ],
      function (index) { return { kernel: Math.min(index, 5), mapGain: (index + 1) / 7 }; }
    );
  }
  if (experiment.id === "recs") {
    return [
      { phase: "RECEIVING INPUT", op: "User Profile", log: "User profile loaded", stage: 0, delay: 220, reveal: 0 },
      { phase: "PREPROCESSING", op: "User Features", log: "User tags encoded [" + bundle.recs.input.join(", ") + "]", stage: 1, delay: 240, reveal: 1 },
      { phase: "FEATURE EXTRACTION", op: "Item Features", log: "Item catalog encoded", stage: 2, delay: 240, reveal: 2 },
      { phase: "FORWARD PROPAGATION", op: "Embeddings", log: "Tag embeddings aligned", stage: 3, delay: 240, reveal: 3 },
      { phase: "ACTIVATION", op: "Similarity", log: "Cosine scores computed", stage: 4, delay: 260, reveal: 4 },
      { phase: "GENERATING OUTPUT", op: "Ranking", log: "Items ranked by score", stage: 5, delay: 260, reveal: 5 },
      { phase: "COMPLETE", op: "Recommendations", log: "Recommendation list ready", stage: 6, delay: 0, reveal: 6 },
    ];
  }
  if (experiment.id === "transformer") {
    return [
      { phase: "RECEIVING INPUT", op: "Tokens", log: "Token sequence received", stage: 0, delay: 220, attn: 0 },
      { phase: "PREPROCESSING", op: "Embeddings", log: "Token embeddings created", stage: 1, delay: 240, attn: 0.15 },
      { phase: "FEATURE EXTRACTION", op: "Positional Encoding", log: "Positions added to embeddings", stage: 2, delay: 240, attn: 0.25 },
      { phase: "FORWARD PROPAGATION", op: "Self-Attention", log: "Attention scores computed", stage: 3, delay: 280, attn: 0.7 },
      { phase: "ACTIVATION", op: "Multi-Head Attention", log: "Heads merged", stage: 4, delay: 260, attn: 0.9 },
      { phase: "GENERATING OUTPUT", op: "Feed Forward", log: "FFN applied", stage: 5, delay: 240, attn: 1 },
      { phase: "COMPLETE", op: "Output", log: "Contextual tokens ready", stage: 6, delay: 0, attn: 1 },
    ];
  }
  if (experiment.id === "tree") {
    const path = bundle.treeWalk.path;
    const steps = [
      { phase: "RECEIVING INPUT", op: "Sample Loaded", log: "Feature vector received", stage: 0, delay: 220, path: [] },
    ];
    path.forEach((id, index) => {
      const isLeaf = index === path.length - 1;
      steps.push({
        phase: isLeaf ? "GENERATING OUTPUT" : index === 0 ? "PREPROCESSING" : "FEATURE EXTRACTION",
        op: isLeaf ? "Prediction" : "Feature Test",
        log: isLeaf ? "Prediction " + bundle.treeWalk.prediction : "Visited " + id,
        stage: Math.min(index + 1, 5),
        delay: 320,
        path: path.slice(0, index + 1),
      });
    });
    steps.push({
      phase: "COMPLETE",
      op: "Complete",
      log: "Decision path complete",
      stage: 5,
      delay: 0,
      path: path,
    });
    return steps;
  }
  return bundle.clusterFrames.map((frame, index) => ({
    phase:
      frame.type === "initialize"
        ? "PREPROCESSING"
        : frame.type === "converged"
          ? "COMPLETE"
          : "FORWARD PROPAGATION",
    op:
      frame.type === "initialize"
        ? "Initialize"
        : frame.type === "assign"
          ? "Assign"
          : frame.type === "update"
            ? "Update Centroids"
            : "Converged",
    log:
      frame.type === "initialize"
        ? "Centroids initialized"
        : frame.type === "assign"
          ? "Points assigned to nearest centroid"
          : frame.type === "update"
            ? "Centroids moved to cluster means"
            : "k-means converged (iteration cap)",
    stage: index,
    delay: frame.type === "converged" ? 0 : 420,
    frame: frame,
  }));
}

function idleViz(experiment, bundle) {
  return {
    stage: -1,
    layerIndex: -1,
    nodeIndex: -1,
    lit: {},
    tokens: [],
    hits: [],
    kernel: 0,
    mapGain: 0,
    reveal: -1,
    attn: 0,
    path: [],
    frame: experiment.id === "cluster"
      ? { type: "idle", centroids: [], assignments: bundle.points.map(function () { return -1; }) }
      : null,
  };
}

export function useLabEngine(experimentId) {
  const experiment = useMemo(function () { return getExperiment(experimentId); }, [experimentId]);
  const [seed] = useState(7);
  const [inputs, setInputs] = useState(defaultInputs);
  const bundle = useMemo(function () { return buildBundle(experiment, seed, inputs); }, [experiment, seed, inputs]);
  const steps = useMemo(function () { return buildSteps(experiment, bundle); }, [experiment, bundle]);

  const [status, setStatus] = useState("IDLE");
  const [paused, setPaused] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const [viz, setViz] = useState(function () { return idleViz(experiment, bundle); });
  const [log, setLog] = useState([]);
  const [xray, setXray] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [live, setLive] = useState({
    operation: "Idle",
    node: "-",
    layer: "-",
    activation: 0,
    weight: 0,
    progress: 0,
  });

  const startedAt = useRef(0);
  const elapsedBase = useRef(0);
  const runningRef = useRef(false);
  const pausedRef = useRef(false);
  const stepRef = useRef(-1);
  const stepsRef = useRef(steps);
  const rafRef = useRef(0);

  stepsRef.current = steps;
  pausedRef.current = paused;

  const applyStep = useCallback(function (index, list) {
    const step = list[index];
    if (!step) return;
    setStatus(step.phase);
    setStepIndex(index);
    stepRef.current = index;
    setLive({
      operation: step.op,
      node: step.node || "-",
      layer: step.layerLabel || layerName(Math.max(0, step.stage || 0), Math.max(1, list.length)),
      activation: step.activation != null ? step.activation : 0,
      weight: step.weight != null ? step.weight : 0,
      progress: Math.round(((index + 1) / list.length) * 100),
    });
    setViz(function (prev) {
      const lit = Object.assign({}, prev.lit);
      if (step.kind === "nn-node") {
        const key = step.layerIndex + "-" + step.nodeIndex;
        lit[key] = true;
      }
      return {
        stage: step.stage != null ? step.stage : prev.stage,
        layerIndex: step.layerIndex != null ? step.layerIndex : prev.layerIndex,
        nodeIndex: step.nodeIndex != null ? step.nodeIndex : prev.nodeIndex,
        lit: lit,
        tokens: step.tokens != null ? step.tokens : prev.tokens,
        hits: step.hits != null ? step.hits : prev.hits,
        kernel: step.kernel != null ? step.kernel : prev.kernel,
        mapGain: step.mapGain != null ? step.mapGain : prev.mapGain,
        reveal: step.reveal != null ? step.reveal : prev.reveal,
        attn: step.attn != null ? step.attn : prev.attn,
        path: step.path != null ? step.path : prev.path,
        frame: step.frame != null ? step.frame : prev.frame,
      };
    });
    setLog(function (prev) {
      const stamp = padTime(Date.now() - startedAt.current);
      return prev.slice(-10).concat([{ t: stamp, text: step.log }]).slice(-12);
    });
  }, []);

  const clearTimer = useCallback(function () {
    if (rafRef.current) {
      window.clearTimeout(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const finishIdleClock = useCallback(function () {
    runningRef.current = false;
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(function () {
    clearTimer();
    runningRef.current = false;
    pausedRef.current = false;
    stepRef.current = -1;
    setPaused(false);
    setStatus("IDLE");
    setStepIndex(-1);
    setViz(idleViz(experiment, bundle));
    setLog([]);
    setElapsed(0);
    elapsedBase.current = 0;
    startedAt.current = 0;
    setLive({
      operation: "Idle",
      node: "-",
      layer: "-",
      activation: 0,
      weight: 0,
      progress: 0,
    });
  }, [bundle, clearTimer, experiment]);

  const run = useCallback(function () {
    if (paused && status !== "IDLE" && status !== "COMPLETE") {
      setPaused(false);
      pausedRef.current = false;
      startedAt.current = Date.now() - elapsedBase.current;
      runningRef.current = true;
      return;
    }
    clearTimer();
    runningRef.current = true;
    pausedRef.current = false;
    setPaused(false);
    stepRef.current = -1;
    setStepIndex(-1);
    setViz(idleViz(experiment, bundle));
    setLog([{ t: "00:000", text: "Run started - educational pipeline" }]);
    setLive({
      operation: "Receiving Input",
      node: "-",
      layer: "-",
      activation: 0,
      weight: 0,
      progress: 0,
    });
    setStatus("RECEIVING INPUT");
    startedAt.current = Date.now();
    elapsedBase.current = 0;
  }, [bundle, clearTimer, experiment, paused, status]);

  const pause = useCallback(function () {
    if (!runningRef.current || status === "IDLE" || status === "COMPLETE") return;
    setPaused(true);
    pausedRef.current = true;
    elapsedBase.current = Date.now() - startedAt.current;
    clearTimer();
  }, [clearTimer, status]);

  const patchInputs = useCallback(function (partial) {
    setInputs(function (prev) { return Object.assign({}, prev, partial); });
  }, []);

  useEffect(function () {
    reset();
  }, [experiment.id]);

  useEffect(function () {
    if (status === "IDLE") setViz(idleViz(experiment, bundle));
  }, [bundle, experiment, status]);

  useEffect(function () {
    if (!runningRef.current || paused) return undefined;
    const list = stepsRef.current;
    const next = stepRef.current + 1;
    if (next >= list.length) {
      runningRef.current = false;
      setStatus("COMPLETE");
      return undefined;
    }
    const delay = REDUCED ? 0 : (list[next].delay != null ? list[next].delay : 200);
    rafRef.current = window.setTimeout(function () {
      applyStep(next, list);
      if (next === list.length - 1) {
        runningRef.current = false;
      }
    }, delay);
    return function () { clearTimer(); };
  }, [applyStep, clearTimer, paused, status, stepIndex, seed, experiment.id]);

  useEffect(function () {
    if (!runningRef.current || paused || status === "IDLE" || status === "COMPLETE") return undefined;
    const id = window.setInterval(function () {
      setElapsed(Date.now() - startedAt.current);
    }, 80);
    return function () { window.clearInterval(id); };
  }, [paused, status, stepIndex]);

  useEffect(function () { return function () { finishIdleClock(); }; }, [finishIdleClock]);

  const params = countParams(experiment, bundle);
  const nodeTotal =
    experiment.id === "nn"
      ? bundle.network.activations.reduce(function (acc, layer) { return acc + layer.length; }, 0)
      : experiment.pipeline.length;
  const activeNodes =
    experiment.id === "nn" ? Object.keys(viz.lit).length : Math.max(0, viz.stage + 1);

  var confidence = 0;
  if (experiment.id === "nn") confidence = bundle.network.top.value;
  else if (experiment.id === "text") confidence = bundle.sentiment.confidence;
  else if (experiment.id === "recs") confidence = (bundle.recs.output[0] && bundle.recs.output[0].score) || 0;
  else if (experiment.id === "image" || experiment.id === "cnn") confidence = status === "IDLE" ? 0 : bundle.image.top.value;
  else if (status === "COMPLETE") confidence = 0.8;

  const simLatency = status === "IDLE" ? 0 : 8 + live.progress * 0.18;

  return {
    experiment: experiment,
    experiments: EXPERIMENTS,
    bundle: bundle,
    status: status,
    paused: paused,
    xray: xray,
    setXray: setXray,
    viz: viz,
    log: log,
    live: live,
    elapsed: elapsed,
    params: params,
    nodeTotal: nodeTotal,
    activeNodes: activeNodes,
    confidence: confidence,
    simLatency: simLatency,
    run: run,
    pause: pause,
    reset: reset,
    inputs: inputs,
    setInputs: patchInputs,
    running: runningRef.current && !paused && status !== "COMPLETE" && status !== "IDLE",
  };
}