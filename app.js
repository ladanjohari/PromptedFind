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
const timelineRail = document.getElementById("timelineRail");
const timelineProgress = document.getElementById("timelineProgress");
const timelineSegments = document.getElementById("timelineSegments");
const timelinePlayhead = document.getElementById("timelinePlayhead");
let activeSegmentId = null;
let segmentPlaybackEnd = null;
let searchTimeoutId = null;

function getSegmentStyle(start, end, duration) {
  return {
    left: `${(start / duration) * 100}%`,
    width: `${((end - start) / duration) * 100}%`,
  };
}

function renderTimelineSegments(items) {
  timelineSegments.innerHTML = "";

  items.forEach((entry) => {
    const segment = document.createElement("button");
    const style = getSegmentStyle(entry.start, entry.end, totalVideoDurationSeconds);

    segment.className = "timeline-segment";
    segment.type = "button";
    segment.style.left = style.left;
    segment.style.width = style.width;
    segment.setAttribute("aria-label", `Play segment ${entry.label}`);
    segment.dataset.entryId = String(entry.id);

    segment.addEventListener("click", () => {
      setActiveMoment(entry, null);
    });

    timelineSegments.appendChild(segment);
  });
}

function buildWatchUrl(time) {
  return `./video.mp4#t=${time}`;
}

function getTimelineDuration() {
  return videoPlayer.duration && Number.isFinite(videoPlayer.duration)
    ? videoPlayer.duration
    : totalVideoDurationSeconds;
}

function updateTimelinePlayback() {
  const duration = getTimelineDuration();
  const progressPercent = Math.max(0, Math.min((videoPlayer.currentTime / duration) * 100, 100));

  timelineProgress.style.width = `${progressPercent}%`;
  timelinePlayhead.style.left = `${progressPercent}%`;
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
  videoPlayer.currentTime = entry.start;
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
      '<div class="empty-state">No matching moments yet. Try words like "breadcrumbs", "symbols", or "filter".</div>';
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
    '<div class="empty-state">Ask about a concept from the video, like "symbols", "breadcrumbs", or "filter".</div>';
  timelineSegments.innerHTML = "";
  updateActiveUI(null);
  panelNote.textContent = "Mock data only for this step.";
  panelNote.classList.remove("is-thinking");
}

// Keep the first-pass search lightweight but a bit more forgiving.
// It matches if every typed word appears somewhere in the transcript entry.
function filterTranscript(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return transcriptEntries;
  }

  const queryWords = normalizedQuery.split(/\s+/);

  return transcriptEntries.filter((entry) => {
    const haystack = `${entry.title} ${entry.summary}`.toLowerCase();
    return queryWords.every((word) => haystack.includes(word));
  });
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
    renderTimelineSegments(matches);
    jumpStatus.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"} ready.`;
    panelNote.textContent = "Mock data only for this step.";
    panelNote.classList.remove("is-thinking");
  }, 320);
}

function resetAskPanel() {
  window.clearTimeout(searchTimeoutId);
  panelQueryInput.value = "";
  jumpStatus.textContent = "Ask a question to see matching moments.";
  renderIdleState();
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

// Keep the top bar as visual YouTube chrome, but route search behavior through the Ask panel.
topbarSearchInput.addEventListener("focus", () => {
  panelQueryInput.focus();
});

panelSendButton.addEventListener("click", handleSearchSubmit);
panelQueryInput.addEventListener("keydown", handlePanelKeydown);
panelCloseButton.addEventListener("click", resetAskPanel);

videoPlayer.addEventListener("timeupdate", () => {
  updateTimelinePlayback();
  const currentEntry = findEntryByTime(videoPlayer.currentTime);

  if (currentEntry && currentEntry.id !== activeSegmentId) {
    activeTimestamp.textContent = `Selected segment: ${currentEntry.label}`;
    jumpStatus.textContent = `Playing segment ${currentEntry.label}...`;
    openVideoLink.href = buildWatchUrl(currentEntry.start);
    updateActiveUI(currentEntry.id);
  }

  if (segmentPlaybackEnd !== null && videoPlayer.currentTime >= segmentPlaybackEnd) {
    videoPlayer.pause();
    segmentPlaybackEnd = null;
    if (currentEntry) {
      jumpStatus.textContent = `Finished segment ${currentEntry.label}.`;
    }
  }
});

videoPlayer.addEventListener("loadedmetadata", () => {
  updateTimelinePlayback();
});

// Keep the player at the start of the video, but do not show Ask results until a query exists.
renderIdleState();
videoPlayer.currentTime = transcriptEntries[0].start;
openVideoLink.href = buildWatchUrl(transcriptEntries[0].start);
activeTimestamp.textContent = `Selected segment: ${transcriptEntries[0].label}`;
jumpStatus.textContent = "Ask a question to see matching moments.";
updateTimelinePlayback();
