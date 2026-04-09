# PromptedFind

PromptedFind is a design-engineer prototype for prompt-based navigation inside media.

Instead of only searching for exact words, PromptedFind helps a user ask for a moment in natural language and jump directly to the relevant part of a video, audio file, document, or other content surface.

## Core Idea

PromptedFind turns interpreted results into navigation controls.

A user can ask things like:

- "the part where they explain the main concept"
- "the section about methodology"
- "where they compare technical and social systems"

And PromptedFind returns meaningful ranges that can be clicked to navigate the content.

## Current Prototype

This repository currently contains a web prototype with:

- local HTML5 video player
- right-side Ask panel
- mock AI-style summaries
- clickable result cards
- stacked semantic timeline
- segment-based navigation
- synchronized playhead

## Product Direction

PromptedFind is intended as a reusable pattern that can work across platforms such as:

- video players
- podcasts
- audio transcripts
- PDF/document viewers
- lecture recordings
- research tools
- course platforms

## System Model

PromptedFind has 3 reusable layers:

1. Core logic
- query input
- result ranking
- active selection
- range mapping
- sync with host media

2. UI layer
- Ask panel
- results list
- semantic timeline
- active range state
- hover and selection behavior

3. Host adapter
- video seek
- audio seek
- PDF scroll/jump
- document section navigation

## Current Status

This is a mock frontend prototype.

Current behavior is still mocked:
- summaries are hardcoded
- search is lightweight keyword/alias matching
- no backend
- no real AI inference yet

## Local Run

```bash
cd /Users/ladanjohari/projects/PromptedFind
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/index.html
```

## Why It Matters

PromptedFind shifts the interaction from:

- finding exact words

to:

- navigating meaningful ideas and ranges
