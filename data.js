// Mock AI-style summaries for semantic video ranges.
// These are hand-written summaries, not real model output.
const transcriptEntries = [
  {
    id: 1,
    start: 0,
    end: 16,
    label: "0:00-0:07",
    title: "Navigation starts with search tradeoffs",
    summary:
      "The opening frames the problem: large Xcode projects force you to choose between quick symbol search and slower file-by-file navigation. The video sets up why this workflow feels fragmented.",
  },
  {
    id: 2,
    start: 17,
    end: 27,
    label: "0:17-0:27",
    title: "Breadcrumbs help, but stay narrow",
    summary:
      "This section explains that breadcrumbs are useful for local navigation, but they do not expose the full symbol landscape inside a target. The limitation is less about access and more about visibility.",
  },
  {
    id: 3,
    start: 28,
    end: 38,
    label: "0:28-0:38",
    title: "The symbol browser reframes navigation",
    summary:
      "The new symbol browser is introduced as a different navigation model. Instead of starting from files, it starts from meaningful code structures like classes, structs, and protocols.",
  },
  {
    id: 4,
    start: 39,
    end: 53,
    label: "0:39-0:53",
    title: "Organization shifts from files to symbols",
    summary:
      "Here the product value becomes clearer: the browser organizes code around the syntax and structure of the codebase rather than the file tree. The pitch is control, not just speed.",
  },
  {
    id: 5,
    start: 54,
    end: 73,
    label: "0:54-1:13",
    title: "Direct access plus filtering reduces friction",
    summary:
      "This range focuses on the practical interaction benefits: jumping directly into the syntax tree and filtering by name or symbol type. The experience is positioned as faster, cleaner, and more intentional.",
  },
  {
    id: 6,
    start: 74,
    end: 84,
    label: "1:14-1:24",
    title: "Closing claim: faster, smarter browsing",
    summary:
      "The ending compresses the product story into a simple benefit statement. It reinforces that the symbol browser is meant to improve how developers browse code, not just how they search it.",
  },
];

// The YouTube video ID is stored separately so the iframe URL is easy to update later.
const youtubeVideoId = "b9VX6qipe84";
const totalVideoDurationSeconds = 84;
