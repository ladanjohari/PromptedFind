// Mock AI-style summaries for the "What is Web Science?" video.
// These are hand-written summaries, not real model output.
const transcriptEntries = [
  {
    id: 1,
    start: 0,
    end: 34,
    label: "0:00-0:34",
    title: "Introducing Web Science",
    summary:
      "The opening introduces Web Science as a field for studying the web itself, not just the technologies inside it. The framing suggests that the web must be understood as both a technical and social system.",
  },
  {
    id: 2,
    start: 18,
    end: 58,
    label: "0:18-0:58",
    title: "The web as a socio-technical system",
    summary:
      "This segment explains that the web cannot be understood through engineering alone. Human behavior, institutions, incentives, and social structures are presented as part of the same system.",
  },
  {
    id: 3,
    start: 42,
    end: 88,
    label: "0:42-1:28",
    title: "Web Science connects many disciplines",
    summary:
      "Here the speakers position Web Science as an interdisciplinary field. Computer science, sociology, law, economics, and network thinking all appear as relevant lenses for understanding the web.",
  },
  {
    id: 4,
    start: 74,
    end: 126,
    label: "1:14-2:06",
    title: "Why the web needs new research methods",
    summary:
      "This range shifts into methodology. The idea is that the web evolves so quickly, and through so many interacting forces, that traditional single-discipline methods are not enough on their own.",
  },
  {
    id: 5,
    start: 112,
    end: 168,
    label: "1:52-2:48",
    title: "People shape the web as much as code",
    summary:
      "The discussion emphasizes that the web is produced by users, communities, norms, and institutions as much as by software architecture. That makes social behavior part of the system design story.",
  },
  {
    id: 6,
    start: 154,
    end: 214,
    label: "2:34-3:34",
    title: "Understanding emergence and large-scale effects",
    summary:
      "This segment focuses on how small local interactions can produce large-scale web phenomena. Web Science is presented as a way to study those emergent outcomes systematically.",
  },
  {
    id: 7,
    start: 198,
    end: 250,
    label: "3:18-4:10",
    title: "The field combines analysis with design",
    summary:
      "The video suggests that Web Science is not only descriptive. It is also about designing better systems by understanding how technology, behavior, and policy interact.",
  },
  {
    id: 8,
    start: 228,
    end: 274,
    label: "3:48-4:34",
    title: "Web Science as a long-term lens",
    summary:
      "This range frames Web Science as a durable perspective for studying the web over time. The core message is that the web should be examined as a living system with technical and human dimensions.",
  },
  {
    id: 9,
    start: 260,
    end: 288,
    label: "4:20-4:48",
    title: "Closing takeaway",
    summary:
      "The ending leaves the viewer with a concise takeaway: Web Science exists to explain how the web works as a complex human and technical ecosystem, and why that matters.",
  },
];

const totalVideoDurationSeconds = 288;
