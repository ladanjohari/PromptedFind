// Cache the UI elements once so the rest of the file can stay simple.
const topbarSearchInput = document.getElementById("topbarSearchInput");
const panelQueryInput = document.getElementById("panelQueryInput");
const resultsList = document.getElementById("resultsList");
const resultsCount = document.getElementById("resultsCount");
const videoPlayer = document.getElementById("videoPlayer");
const openVideoLink = document.getElementById("openVideoLink");
const activeTimestamp = document.getElementById("activeTimestamp");
const resultTemplate = document.getElementById("resultTemplate");
const jumpStatus = document.getElementById("jumpStatus");
const panelNote = document.querySelector(".panel-note");
const panelSendButton = document.getElementById("panelSendButton");
const panelCloseButton = document.getElementById("panelCloseButton");
const openAskPanelButton = document.getElementById("openAskPanelButton");
const watchSidebar = document.getElementById("watchSidebar");
const timelineRuler = document.getElementById("timelineRuler");
const timelineRail = document.getElementById("timelineRail");
const timelineBody = document.getElementById("timelineBody");
const timelineTracks = document.getElementById("timelineTracks");
const timelineProgress = document.getElementById("timelineProgress");
const timelinePlayhead = document.getElementById("timelinePlayhead");
const timelineTooltip = document.getElementById("timelineTooltip");
let activeSegmentId = null;
let segmentPlaybackEnd = null;
let searchTimeoutId = null;
let currentPlaybackTime = 0;
let tooltipTimeoutId = null;

const conceptAliases = {
  web: ["web", "internet", "world wide web", "online"],
  science: ["science", "web science", "research", "field"],
  social: ["social", "society", "human", "behavior", "people"],
  technical: ["technical", "technology", "engineering", "code", "system"],
  disciplines: ["disciplines", "interdisciplinary", "economics", "law", "sociology"],
  methods: ["methods", "research", "analysis", "approach"],
  emergence: ["emergence", "emergent", "large-scale", "networks", "effects"],
  design: ["design", "better systems", "policy", "architecture"],
};

function getSegmentStyle(start, end, duration) {
  return {
    left: `${(start / duration) * 100}%`,
    width: `${((end - start) / duration) * 100}%`,
  };
}

function formatTimelineTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function renderTimelineRuler() {
  const duration = getTimelineDuration();
  const tickCount = 6;
  timelineRuler.innerHTML = "";

  for (let index = 0; index < tickCount; index += 1) {
    const tick = document.createElement("div");
    const time = (duration / (tickCount - 1)) * index;
    tick.className = "timeline-ruler-tick";
    tick.textContent = formatTimelineTime(time);
    timelineRuler.appendChild(tick);
  }
}

function assignTracks(segments) {
  const tracks = [];

  segments.forEach((seg) => {
    let placed = false;

    for (const track of tracks) {
      const overlaps = track.some((t) => seg.start < t.end && seg.end > t.start);

      if (!overlaps) {
        track.push(seg);
        placed = true;
        break;
      }
    }

    if (!placed) {
      tracks.push([seg]);
    }
  });

  return tracks;
}

function renderTimelineSegments(items) {
  timelineTracks.innerHTML = "";
  const tracks = assignTracks(items);
  const duration = getTimelineDuration();

  tracks.forEach((track) => {
    const trackRow = document.createElement("div");
    trackRow.className = "timeline-track";

    track.forEach((entry) => {
      const segment = document.createElement("button");
      const style = getSegmentStyle(entry.start, entry.end, duration);

      segment.className = "timeline-segment";
      segment.type = "button";
      segment.style.left = style.left;
      segment.style.width = style.width;
      segment.setAttribute("aria-label", `Play segment ${entry.label}`);
      segment.dataset.entryId = String(entry.id);

      const label = document.createElement("div");
      label.className = "timeline-segment-title";
      label.style.left = style.left;
      label.style.width = style.width;
      label.innerHTML = `
        <span class="timeline-segment-title-text">${entry.title}</span>
        <span class="timeline-segment-title-time">${entry.label}</span>
      `;
      label.dataset.entryId = String(entry.id);

      const activateEntry = () => {
        setActiveMoment(entry, null);
      };

      label.addEventListener("click", activateEntry);
      label.addEventListener("mouseenter", () => showTimelineTooltip(entry, segment));
      label.addEventListener("mousemove", () => positionTimelineTooltip(segment));
      label.addEventListener("mouseleave", hideTimelineTooltip);
      trackRow.appendChild(label);

      segment.addEventListener("click", activateEntry);
      segment.addEventListener("mouseenter", () => showTimelineTooltip(entry, segment));
      segment.addEventListener("mousemove", () => positionTimelineTooltip(segment));
      segment.addEventListener("mouseleave", hideTimelineTooltip);

      trackRow.appendChild(segment);
    });

    timelineTracks.appendChild(trackRow);
  });

  return tracks.length;
}

function buildWatchUrl(time) {
  return `./video.webm#t=${time}`;
}

function showTimelineTooltip(entry, segment) {
  window.clearTimeout(tooltipTimeoutId);
  tooltipTimeoutId = window.setTimeout(() => {
    timelineTooltip.innerHTML = `
      <span class="timeline-tooltip-title">${entry.title}</span>
      <span class="timeline-tooltip-time">${entry.label}</span>
    `;
    timelineTooltip.classList.remove("is-hidden");
    positionTimelineTooltip(segment);
  }, 1000);
}

function positionTimelineTooltip(segment) {
  const bodyRect = timelineBody.getBoundingClientRect();
  const segmentRect = segment.getBoundingClientRect();
  const tooltipWidth = timelineTooltip.offsetWidth;
  const left = segmentRect.left - bodyRect.left;
  const clampedLeft = Math.max(0, Math.min(left, bodyRect.width - tooltipWidth));
  const top = segmentRect.bottom - bodyRect.top + 10;

  timelineTooltip.style.left = `${clampedLeft}px`;
  timelineTooltip.style.top = `${top}px`;
}

function hideTimelineTooltip() {
  window.clearTimeout(tooltipTimeoutId);
  timelineTooltip.classList.add("is-hidden");
}

function setCurrentPlaybackTime(time) {
  currentPlaybackTime = Math.max(0, time);
}

function getTimelineDuration() {
  return videoPlayer.duration && Number.isFinite(videoPlayer.duration)
    ? videoPlayer.duration
    : totalVideoDurationSeconds;
}

function updateTimelinePlayback() {
  const duration = getTimelineDuration();
  const progressPercent = Math.max(0, Math.min((currentPlaybackTime / duration) * 100, 100));

  timelineProgress.style.width = `${progressPercent}%`;
  timelinePlayhead.style.left = `${progressPercent}%`;
}

function seekToTime(time) {
  const duration = getTimelineDuration();
  const nextTime = Math.max(0, Math.min(time, duration));
  setCurrentPlaybackTime(nextTime);
  videoPlayer.currentTime = nextTime;
  updateTimelinePlayback();
}

function updateActiveUI(entryId) {
  activeSegmentId = entryId;

  document.querySelectorAll(".result-card").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.entryId === String(entryId));
  });

  document.querySelectorAll(".timeline-segment").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.entryId === String(entryId));
  });
}

function findEntryByTime(time) {
  return transcriptEntries.find((entry) => time >= entry.start && time <= entry.end) || null;
}

function setActiveMoment(entry, card) {
  openVideoLink.href = buildWatchUrl(entry.start);
  activeTimestamp.textContent = `Selected segment: ${entry.label}`;
  jumpStatus.textContent = `Playing segment ${entry.label}...`;
  segmentPlaybackEnd = entry.end;
  updateActiveUI(entry.id);

  // Seek directly inside the local HTML5 video player.
  seekToTime(entry.start);
  const playPromise = videoPlayer.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      jumpStatus.textContent = `Ready to play segment ${entry.label}.`;
    });
  }
}

// Render transcript matches into the results panel.
function renderResults(items) {
  resultsCount.textContent = `${items.length} match${items.length === 1 ? "" : "es"}`;
  resultsList.innerHTML = "";

  if (items.length === 0) {
    resultsList.innerHTML =
      '<div class="empty-state">No matching moments yet. Try words like "web", "social", "research", or "design".</div>';
    return;
  }

  items.forEach((entry) => {
    const card = resultTemplate.content.firstElementChild.cloneNode(true);
    const time = card.querySelector(".result-time");
    const title = card.querySelector(".result-title");
    const text = card.querySelector(".result-text");
    card.dataset.entryId = String(entry.id);

    // Clicking a result jumps the YouTube embed to the start of that segment.
    card.addEventListener("click", () => {
      setActiveMoment(entry, card);
    });

    time.textContent = entry.label;
    title.textContent = entry.title;
    text.textContent = entry.summary;

    resultsList.appendChild(card);
  });
}

function renderIdleState() {
  resultsCount.textContent = "0 matches";
  resultsList.innerHTML =
    '<div class="empty-state">Ask about a concept from the video, like "web", "social", "methods", or "design".</div>';
  timelineTracks.innerHTML = "";
  updateActiveUI(null);
  hideTimelineTooltip();
  panelNote.textContent = "Mock data only for this step.";
  panelNote.classList.remove("is-thinking");
}

function expandQueryTerms(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const queryWords = normalizedQuery.split(/\s+/);
  const expanded = new Set(queryWords);

  queryWords.forEach((word) => {
    if (conceptAliases[word]) {
      conceptAliases[word].forEach((alias) => expanded.add(alias));
    }
  });

  return Array.from(expanded);
}

// Keep the search intentionally simple, but broaden it so one concept query
// can surface a few related semantic ranges for the prototype.
function filterTranscript(query) {
  const queryTerms = expandQueryTerms(query);

  if (queryTerms.length === 0) {
    return transcriptEntries;
  }

  return transcriptEntries
    .map((entry) => {
      const haystack = `${entry.title} ${entry.summary}`.toLowerCase();
      let score = 0;

      queryTerms.forEach((term) => {
        if (haystack.includes(term)) {
          score += term.includes(" ") ? 2 : 1;
        }
      });

      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.start - b.entry.start)
    .map((item) => item.entry);
}

function runSearch(query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    jumpStatus.textContent = "Ask a question to see matching moments.";
    renderIdleState();
    return;
  }

  jumpStatus.textContent = 'PromptFind is thinking...';
  panelNote.textContent = "Generating mock AI summaries...";
  panelNote.classList.add("is-thinking");

  window.clearTimeout(searchTimeoutId);
  searchTimeoutId = window.setTimeout(() => {
    const matches = filterTranscript(query);
    renderResults(matches);
    const trackCount = renderTimelineSegments(matches);
    jumpStatus.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"} ready.`;
    panelNote.textContent = `Mock data only for this step. ${trackCount} track${trackCount === 1 ? "" : "s"} rendered.`;
    panelNote.classList.remove("is-thinking");
  }, 320);
}

function resetAskPanel() {
  window.clearTimeout(searchTimeoutId);
  panelQueryInput.value = "";
  jumpStatus.textContent = "Ask a question to see matching moments.";
  renderIdleState();
}

function openAskPanel() {
  watchSidebar.classList.remove("is-hidden");
  panelQueryInput.focus();
}

function closeAskPanel() {
  resetAskPanel();
  watchSidebar.classList.add("is-hidden");
}

function handleSearchSubmit() {
  runSearch(panelQueryInput.value);
}

function handlePanelKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleSearchSubmit();
  }
}

function handleTimelineClick(event) {
  if (event.target.closest(".timeline-segment") || event.target.closest(".timeline-segment-title")) {
    return;
  }

  const rect = timelineBody.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percent = Math.max(0, Math.min(x / rect.width, 1));
  const newTime = percent * getTimelineDuration();

  segmentPlaybackEnd = null;
  seekToTime(newTime);
  jumpStatus.textContent = `Jumped to ${formatTimelineTime(newTime)}.`;

  const currentEntry = findEntryByTime(newTime);
  if (currentEntry) {
    openVideoLink.href = buildWatchUrl(currentEntry.start);
    activeTimestamp.textContent = `Selected segment: ${currentEntry.label}`;
    updateActiveUI(currentEntry.id);
  } else {
    activeTimestamp.textContent = `Selected time: ${formatTimelineTime(newTime)}`;
    updateActiveUI(null);
  }
}

// Keep the top bar as visual YouTube chrome, but route search behavior through the Ask panel.
topbarSearchInput.addEventListener("focus", () => {
  panelQueryInput.focus();
});

panelSendButton.addEventListener("click", handleSearchSubmit);
panelQueryInput.addEventListener("keydown", handlePanelKeydown);
panelCloseButton.addEventListener("click", closeAskPanel);
openAskPanelButton.addEventListener("click", openAskPanel);
timelineBody.addEventListener("click", handleTimelineClick);

videoPlayer.addEventListener("timeupdate", () => {
  setCurrentPlaybackTime(videoPlayer.currentTime);
  updateTimelinePlayback();
  const currentEntry = findEntryByTime(currentPlaybackTime);

  if (currentEntry && currentEntry.id !== activeSegmentId) {
    activeTimestamp.textContent = `Selected segment: ${currentEntry.label}`;
    jumpStatus.textContent = `Playing segment ${currentEntry.label}...`;
    openVideoLink.href = buildWatchUrl(currentEntry.start);
    updateActiveUI(currentEntry.id);
  }

  if (segmentPlaybackEnd !== null && currentPlaybackTime >= segmentPlaybackEnd) {
    videoPlayer.pause();
    segmentPlaybackEnd = null;
    if (currentEntry) {
      jumpStatus.textContent = `Finished segment ${currentEntry.label}.`;
    }
  }
});

videoPlayer.addEventListener("loadedmetadata", () => {
  renderTimelineRuler();
  if (panelQueryInput.value.trim()) {
    renderTimelineSegments(filterTranscript(panelQueryInput.value));
  }
  updateTimelinePlayback();
});

// Keep the player at the start of the video, but do not show Ask results until a query exists.
renderIdleState();
setCurrentPlaybackTime(transcriptEntries[0].start);
videoPlayer.currentTime = transcriptEntries[0].start;
openVideoLink.href = buildWatchUrl(transcriptEntries[0].start);
activeTimestamp.textContent = `Selected segment: ${transcriptEntries[0].label}`;
jumpStatus.textContent = "Ask a question to see matching moments.";
renderTimelineRuler();
updateTimelinePlayback();
