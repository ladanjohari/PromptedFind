# PromptedFind Product Definition

## One-Line Definition

PromptedFind is a prompt-based navigation layer for media and documents.

## Problem

Most players and viewers are optimized for playback or exact search.

Users often remember meaning, not exact wording.

Examples:
- "the part where they explain the core idea"
- "the section about methodology"
- "where they compare technical and social systems"

Traditional interfaces do not make those moments easy to find.

## Product Principle

PromptedFind converts understanding into navigation.

It should:
- interpret a query
- return meaningful ranges
- let the user jump directly to them
- keep the user oriented in time or document structure

## Cross-Platform Targets

PromptedFind should work across:
- video
- audio
- PDFs
- long-form documents
- lectures
- transcripts
- knowledge interfaces

## Reusable UI Pattern

Common pieces:
- Ask panel
- result cards
- active selection
- semantic range markers
- timeline or structural map
- host-specific jump behavior

## Reusable Data Shape

```ts
type PromptedFindRange = {
  id: string
  start?: number
  end?: number
  page?: number
  sectionId?: string
  title: string
  summary: string
  score?: number
}
```

## Adaptation Rule

The host product changes.
The PromptedFind interaction model stays the same.
