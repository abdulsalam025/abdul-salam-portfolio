export const CURRENT_FOCUS = [
  "Machine Learning foundations",
  "Data Structures",
  "Software Engineering",
];

export const TECH_STACK = [
  "Python",
  "C",
  "JavaScript",
  "React",
  "HTML & CSS",
  "Git & GitHub",
  "AI / ML",
  "Node.js",
];

export const PROJECTS = [
  {
    id: "sports", featured: true, status: "Prototype",
    number: "01",
    type: "DESIGN THINKING / WEB",
    title: "Community Sports Equipment Library",
    tags: ["HTML", "CSS", "JavaScript"],
    desc: "A platform designed to connect students, institutions and organizations with reusable sports equipment.",
    liveUrl: null,
    sourceUrl: null,
    problem:
      "Sports equipment is expensive and often unused after a season. Students and smaller institutions struggle to access gear, while other groups store equipment that could be reused.",
    goal:
      "Design a simple web experience that makes shared sports equipment easier to discover and request, using design-thinking methods rather than a heavy product stack.",
    users: [
      "Students who need affordable access to sports gear",
      "Institutions that can lend or list unused equipment",
      "Organizations that want to support reuse instead of new purchases",
    ],
    solution:
      "A student-oriented website for browsing reusable equipment, understanding who can share it, and following a lightweight request flow. The first version focuses on clarity and accessibility, not accounts or payments.",
    technology: [
      { name: "HTML", role: "Page structure and content sections" },
      { name: "CSS", role: "Layout, visual hierarchy, responsive presentation" },
      { name: "JavaScript", role: "Interface behaviour and interaction" },
    ],
    architecture: [
      {
        id: "user",
        label: "USER",
        role: "Student, institution, or organization",
        responsibility: "Browse equipment and start a request",
        dataFlow: "Reads listings and submits a request through the page",
        technology: "Web browser",
      },
      {
        id: "ui",
        label: "WEB INTERFACE",
        role: "Presentation layer",
        responsibility: "Show equipment, filters, and request steps",
        dataFlow: "Renders static content and handles clicks/forms in the browser",
        technology: "HTML, CSS, JavaScript",
      },
      {
        id: "logic",
        label: "CLIENT LOGIC",
        role: "Interaction layer",
        responsibility: "Update the interface from user actions",
        dataFlow: "Stays in the browser - no separate API was published for this version",
        technology: "Vanilla JavaScript",
      },
    ],
    implementation: [
      "Structured pages for the equipment-sharing concept",
      "A student-oriented interface for discovering items",
      "Front-end interaction without a published backend",
    ],
    challenges: [
      {
        problem: "The idea is a network of people and institutions, but the first build is a front-end concept.",
        solution: "Kept the scope honest: communicate the sharing model clearly instead of faking a live inventory database.",
      },
      {
        problem: "Design-thinking work can stay as slides if it never becomes a usable interface.",
        solution: "Turned the concept into an actual HTML/CSS/JavaScript page that a visitor can click through.",
      },
    ],
    learnings: [
      "A useful system starts with the user problem, not the framework.",
      "Static front-ends still need information architecture and clear empty states.",
      "Reuse and access problems are as much about trust and process as they are about UI.",
    ],
    future: [
      "Real listing data instead of concept content",
      "Request status a lender can actually update",
      "Moderation so equipment availability stays accurate",
    ],
  },
  {
    id: "flight", featured: false, status: "Academic Project",
    number: "02",
    type: "PYTHON / SOFTWARE",
    title: "Flight Reservation System",
    tags: ["Python", "Logic"],
    desc: "A reservation system focused on flight search, passenger information and booking workflows.",
    liveUrl: null,
    sourceUrl: null,
    problem:
      "Booking a flight is a multi-step workflow: search, choose a flight, collect passenger details, then confirm. Doing that correctly requires structured state, not a single script that prints tickets.",
    goal:
      "Build a Python program that models search, passenger capture, and reservation as an explicit workflow I can test and extend.",
    users: [
      "A traveller searching for a flight",
      "A clerk or operator entering passenger details",
      "Me, as the developer, verifying the booking path",
    ],
    solution:
      "A structured Python application that keeps flights, passengers, and bookings as data, then walks through search and reservation steps in order.",
    technology: [
      { name: "Python", role: "Language for the whole program" },
      { name: "Structured logic", role: "Search, validation, and booking flow" },
    ],
    architecture: [
      {
        id: "operator",
        label: "OPERATOR",
        role: "Person running the program",
        responsibility: "Search flights and enter passenger information",
        dataFlow: "Inputs commands and passenger fields",
        technology: "Terminal / program interface",
      },
      {
        id: "search",
        label: "SEARCH",
        role: "Query layer",
        responsibility: "Find flights that match the requested criteria",
        dataFlow: "Reads the flight collection and returns matches",
        technology: "Python",
      },
      {
        id: "booking",
        label: "BOOKING FLOW",
        role: "Workflow layer",
        responsibility: "Collect passenger data and create a reservation",
        dataFlow: "Validates input, then records a booking",
        technology: "Python functions / program state",
      },
      {
        id: "records",
        label: "RECORDS",
        role: "In-program data",
        responsibility: "Hold flights, passengers, and bookings while the program runs",
        dataFlow: "No external production database is claimed for this version",
        technology: "Python data structures",
      },
    ],
    implementation: [
      "Flight search flow",
      "Passenger information capture",
      "Reservation steps that depend on previous valid input",
    ],
    challenges: [
      {
        problem: "A reservation has several states. Mixing them in one block makes bugs hard to see.",
        solution: "Separated search, passenger input, and booking so each step has a clear success/failure path.",
      },
      {
        problem: "Invalid passenger data can create a booking that should never exist.",
        solution: "Validate required fields before a reservation is stored in program memory.",
      },
    ],
    learnings: [
      "Workflows are easier to debug when each step has explicit inputs and outputs.",
      "Data structures matter as soon as you have more than one passenger or flight.",
      "Software can be useful without a web UI if the logic is honest and testable.",
    ],
    future: [
      "Persistent storage so bookings survive restart",
      "Automated tests for search and validation",
      "A small interface on top of the same booking logic",
    ],
  },
  {
    id: "jarvis", featured: false, status: "Experimental",
    number: "03",
    type: "AI / PERSONAL ASSISTANT",
    title: "Jarvis",
    tags: ["Python", "AI"],
    desc: "An AI-powered personal assistant project designed to interact with the user and perform useful tasks through intelligent automation.",
    liveUrl: null,
    sourceUrl: null,
    problem:
      "Repeating small digital tasks by hand is slow. I wanted a personal assistant I control, so I could practice turning user requests into actions instead of only reading about AI.",
    goal:
      "Build a Python assistant that can take a request, decide what to do, and run a useful local task. This is a student project, not a production voice agent.",
    users: [
      "Me, as the primary user of the assistant",
      "Anyone reviewing how the command-to-action path works",
    ],
    solution:
      "A Python program that accepts a request, matches it to a known task, and runs the matching action. Capabilities are only those actually implemented in the project - not a general LLM.",
    technology: [
      { name: "Python", role: "Assistant runtime" },
      { name: "Rule / intent handling", role: "Map a request to a known action" },
    ],
    architecture: [
      {
        id: "user",
        label: "USER",
        role: "Person giving a request",
        responsibility: "Ask the assistant to do a task",
        dataFlow: "Sends a spoken or typed request into the program",
        technology: "Microphone or text input, depending on the local setup",
      },
      {
        id: "input",
        label: "INPUT",
        role: "Capture layer",
        responsibility: "Turn the request into text the program can inspect",
        dataFlow: "Passes a string into the intent step",
        technology: "Python",
      },
      {
        id: "intent",
        label: "INTENT",
        role: "Decision layer",
        responsibility: "Choose which known command to run",
        dataFlow: "Does not call an external production model from this portfolio",
        technology: "Python matching / control flow",
      },
      {
        id: "action",
        label: "ACTION",
        role: "Automation layer",
        responsibility: "Execute the selected local task and return feedback",
        dataFlow: "Runs on the local machine and reports success or failure",
        technology: "Python",
      },
    ],
    implementation: [
      "A personal-assistant interaction loop",
      "Task handling for commands the program actually knows",
      "Automation-oriented workflow rather than a chatbot demo",
    ],
    challenges: [
      {
        problem: "It is easy to describe an assistant as if it understands language generally.",
        solution: "Scoped the project to explicit commands and honest failure when a request is unknown.",
      },
      {
        problem: "Automation that talks to the operating system can fail in many ways.",
        solution: "Treat each action as something that can succeed, fail, or be unsupported - then tell the user which one happened.",
      },
    ],
    learnings: [
      "An assistant is an interface over actions, not a personality.",
      "Unknown requests need a clear response. Silence is a bug.",
      "I should only claim the AI behaviour that the code can actually run.",
    ],
    future: [
      "A documented command list with tests",
      "Better handling of unknown requests",
      "Optional speech input only if it is actually wired and testable",
    ],
  },
  {
    id: "water", featured: false, status: "Prototype",
    number: "04",
    type: "FULL STACK / WEB",
    title: "Water Delivery System",
    tags: ["React", "Node.js", "Express"],
    desc: "A web-based water delivery platform designed to manage customers, water orders and delivery workflows.",
    liveUrl: null,
    sourceUrl: null,
    problem:
      "Water delivery is an operational workflow: a customer places an order, someone has to see it, and the delivery has to move through states. A static brochure cannot represent that.",
    goal:
      "Build a web application where a customer-facing React UI talks to a Node/Express API about orders and delivery steps.",
    users: [
      "Customers placing a water order",
      "Staff who need to see incoming orders",
      "Delivery workflow operators updating status",
    ],
    solution:
      "A React front end for ordering and viewing flow, with a Node.js/Express API for order-related requests. This portfolio does not claim a production database or live customer traffic.",
    technology: [
      { name: "React", role: "Customer-facing interface" },
      { name: "Node.js", role: "Server runtime" },
      { name: "Express", role: "HTTP API" },
    ],
    architecture: [
      {
        id: "customer",
        label: "CUSTOMER",
        role: "Person placing an order",
        responsibility: "Choose a delivery and submit order details",
        dataFlow: "Sends order data from the browser",
        technology: "Web browser",
      },
      {
        id: "react",
        label: "REACT FRONTEND",
        role: "Presentation and client state",
        responsibility: "Render order UI and call the API",
        dataFlow: "HTTP requests to the Express server",
        technology: "React",
      },
      {
        id: "api",
        label: "REST API",
        role: "Contract between UI and server",
        responsibility: "Accept order payloads and return status",
        dataFlow: "JSON over HTTP",
        technology: "HTTP / JSON",
      },
      {
        id: "express",
        label: "NODE + EXPRESS",
        role: "Application server",
        responsibility: "Validate requests and run delivery workflow logic",
        dataFlow: "No production database is claimed in this portfolio write-up",
        technology: "Node.js, Express",
      },
    ],
    implementation: [
      "Customer-oriented ordering interface",
      "Delivery workflow represented in the application",
      "A React front end talking to an Express back end",
    ],
    challenges: [
      {
        problem: "Front end and back end can drift until the API contract is explicit.",
        solution: "Treat the Express routes as the source of truth for what an order contains.",
      },
      {
        problem: "It is tempting to say the app has a database because most tutorials do.",
        solution: "Only describe storage that actually exists. If persistence is local or unfinished, say so.",
      },
    ],
    learnings: [
      "Full stack means owning both the UI state and the server contract.",
      "Delivery software is a state machine. Status names should be visible and consistent.",
      "A working request/response path is more valuable than a decorative dashboard.",
    ],
    future: [
      "Documented API routes with example requests",
      "Persistent order storage if and when it is actually added",
      "Clear staff vs customer views",
    ],
  },
];

export function getProjectById(id) {
  return PROJECTS.find((project) => project.id === id) || null;
}