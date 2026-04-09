# PromptedFind

PromptedFind is a design-engineer prototype for prompt-based navigation inside media.

Instead of forcing users to remember exact transcript wording, PromptedFind lets them ask for a moment in natural language, then turns the answer into something actionable: a set of meaningful ranges they can click to navigate the content.

## Demo Concept

The current prototype explores PromptedFind inside a video-watch experience:

- a local HTML5 video player
- a right-side Ask panel
- mock AI-style summaries tied to time ranges
- clickable result cards
- a semantic timeline with stacked ranges
- synchronized playback, selection, and seeking

The interaction model is simple:

1. Ask for a moment in natural language
2. Get interpreted ranges instead of raw transcript lines
3. Click a result or timeline range
4. Jump directly to that part of the media

## Why It Matters

Most media interfaces are built around playback controls or exact search.

But people usually remember:

- an idea
- an explanation
- a moment
- a theme

PromptedFind shifts the interaction from:

- finding exact words

to:

- navigating meaning

## Product Direction

PromptedFind is intended as a reusable interaction pattern that can extend beyond video into:

- podcasts
- lecture recordings
- audio transcripts
- PDFs and document viewers
- research tools
- course platforms
- long-form knowledge interfaces

The host surface changes, but the pattern stays the same:

- ask
- interpret
- return meaningful ranges
- jump

## System Model

PromptedFind can be thought of as 3 reusable layers:

1. Core logic
- query input
- result ranking
- active selection
- range mapping
- sync with the host surface

2. UI layer
- Ask panel
- result cards
- semantic timeline or structure map
- active and hover states

3. Host adapter
- video seek
- audio seek
- PDF scroll or page jump
- document section navigation

## Current Prototype Status

This repository is still a mock frontend prototype.

Current limitations:

- summaries are hardcoded
- search is lightweight keyword and alias matching
- no backend
- no real AI inference yet
- no reusable package extraction yet

## Repo Files

- [index.html](/Users/ladanjohari/projects/PromptedFind/index.html): main watch-page structure
- [styles.css](/Users/ladanjohari/projects/PromptedFind/styles.css): UI styling
- [app.js](/Users/ladanjohari/projects/PromptedFind/app.js): interaction logic
- [data.js](/Users/ladanjohari/projects/PromptedFind/data.js): mock semantic range data
- [PRODUCT.md](/Users/ladanjohari/projects/PromptedFind/PRODUCT.md): product definition
- [PROMPT_TEMPLATE.md](/Users/ladanjohari/projects/PromptedFind/PROMPT_TEMPLATE.md): reusable prompt for extending PromptedFind to other platforms

## Local Run

```bash
cd /Users/ladanjohari/projects/PromptedFind
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/index.html
```

## Next Steps

- replace mock summaries with real retrieval output
- extract the core interaction model into reusable modules
- add adapters for audio and document surfaces
- refine the semantic timeline as a reusable design-system pattern
