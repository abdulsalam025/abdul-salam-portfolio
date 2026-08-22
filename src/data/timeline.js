export const TIMELINE_FILTERS = [
  { id: "all", label: "All" },
  { id: "project", label: "Project" },
  { id: "ai-ml", label: "AI / ML" },
  { id: "web", label: "Web" },
  { id: "experiment", label: "Experiment" },
  { id: "engineering", label: "Engineering" }
];

export const TIMELINE = [
  { id: "tl-ailab", title: "Interactive AI Lab", summary: "Browser-side neuron, lexicon classifier, cosine recommender. Image model is not connected.", category: "ai-ml", recency: "recent", status: "completed", tags: ["JavaScript", "React", "Math"], details: ["Forward pass is computed in the page: z = w1*x1 + w2*x2 + b, then an activation.", "Text classification uses a hand-written lexicon and can return unknown.", "Recommendations use cosine similarity on a fixed 8-item tag dataset.", "No fake accuracy or latency is displayed."], href: "#ailab" },
  { id: "tl-github", title: "Public GitHub snapshot", summary: "Live profile, repos, language bytes and public events from the GitHub API.", category: "engineering", recency: "recent", status: "completed", tags: ["API", "React"], details: ["One shared hook feeds About, the dashboard and the GitHub section.", "Language percents come from /repos/.../languages byte totals.", "Rate-limit, empty, error and session cache are real states.", "There is no contribution heatmap."], href: "#github" },
  { id: "tl-casestudies", title: "Project case studies", summary: "Four projects open a working case-study dialog driven by src/data/projects.js.", category: "engineering", recency: "recent", status: "completed", tags: ["React", "SVG"], details: ["Problem, goal, users, solution, architecture and learnings are data.", "Architecture nodes are interactive.", "Live demo and source buttons are omitted because those URLs are not published."], href: "#projects" },
  { id: "tl-water", title: "Water Delivery System", summary: "React UI talking to a Node/Express order workflow.", category: "web", recency: "previous", status: "completed", tags: ["React", "Node.js", "Express"], details: ["Customer-facing ordering interface and delivery steps.", "This write-up does not claim a production database."], projectId: "water" },
  { id: "tl-sports", title: "Community Sports Equipment Library", summary: "Design-thinking web concept for sharing unused sports equipment.", category: "web", recency: "previous", status: "completed", tags: ["HTML", "CSS", "JavaScript"], details: ["Built as a student-oriented front end.", "No live inventory API is claimed."], projectId: "sports" },
  { id: "tl-flight", title: "Flight Reservation System", summary: "Python workflow for search, passenger data and booking.", category: "project", recency: "previous", status: "completed", tags: ["Python", "Logic"], details: ["States are separated so invalid passenger data cannot silently book.", "Records stay in program memory."], projectId: "flight" },
  { id: "tl-jarvis", title: "Jarvis assistant", summary: "Python personal assistant for commands that are actually implemented.", category: "experiment", recency: "previous", status: "ongoing", tags: ["Python", "AI"], details: ["This is a student project, not a production voice agent.", "Unknown requests should fail honestly.", "Speech input is not claimed unless it is wired and testable."], projectId: "jarvis" }
];