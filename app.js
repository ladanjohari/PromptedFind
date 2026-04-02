// Cache the UI elements once so the rest of the file can stay simple.
const topbarSearchInput = document.getElementById("topbarSearchInput");
const panelQueryInput = document.getElementById("panelQueryInput");
const resultsList = document.getElementById("resultsList");
const resultsCount = document.getElementById("resultsCount");
const videoFrame = document.getElementById("videoFrame");
const openVideoLink = document.getElementById("openVideoLink");
const activeTimestamp = document.getElementById("activeTimestamp");
const resultTemplate = document.getElementById("resultTemplate");
const jumpStatus = document.getElementById("jumpStatus");
const timelineRail = document.getElementById("timelineRail");

function getSegmentStyle(start, end, duration) {
  return {
    left: `${(start / duration) * 100}%`,
    width: `${((end - start) / duration) * 100}%`,
  };
}

function renderTimelineSegments(items) {
  timelineRail.innerHTML = "";

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

    timelineRail.appendChild(segment);
  });
}

function buildEmbedUrl(time) {
  return `https://www.youtube.com/embed/${youtubeVideoId}?start=${time}&rel=0`;
}

function buildWatchUrl(time) {
  return `https://www.youtube.com/watch?v=${youtubeVideoId}&t=${time}s`;
}

function setActiveMoment(entry, card) {
  videoFrame.src = buildEmbedUrl(entry.start);
  openVideoLink.href = buildWatchUrl(entry.start);
  activeTimestamp.textContent = `Selected segment: ${entry.label}`;
  jumpStatus.textContent = `Playing segment ${entry.label}...`;

  document.querySelectorAll(".result-card").forEach((item) => {
    item.classList.remove("is-active");
  });
  document.querySelectorAll(".timeline-segment").forEach((item) => {
    item.classList.remove("is-active");
  });

  const activeCard = card || document.querySelector(`.result-card[data-entry-id="${entry.id}"]`);
  if (activeCard) {
    activeCard.classList.add("is-active");
  }

  const activeSegment = document.querySelector(`.timeline-segment[data-entry-id="${entry.id}"]`);
  if (activeSegment) {
    activeSegment.classList.add("is-active");
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
    const text = card.querySelector(".result-text");
    card.dataset.entryId = String(entry.id);

    // Clicking a result jumps the YouTube embed to the start of that segment.
    card.addEventListener("click", () => {
      setActiveMoment(entry, card);
    });

    time.textContent = entry.label;
    text.textContent = entry.text;

    resultsList.appendChild(card);
  });
}

function renderIdleState() {
  resultsCount.textContent = "0 matches";
  resultsList.innerHTML =
    '<div class="empty-state">Ask about a concept from the video, like "symbols", "breadcrumbs", or "filter".</div>';
  timelineRail.innerHTML = "";
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
    const text = entry.text.toLowerCase();
    return queryWords.every((word) => text.includes(word));
  });
}

function handleQueryChange(event) {
  const query = event.target.value;
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    jumpStatus.textContent = "Ask a question to see matching moments.";
    renderIdleState();
    return;
  }

  const matches = filterTranscript(query);
  renderResults(matches);
  renderTimelineSegments(matches);
}

// Keep the top bar as visual YouTube chrome, but route search behavior through the Ask panel.
topbarSearchInput.addEventListener("focus", () => {
  panelQueryInput.focus();
});

panelQueryInput.addEventListener("input", handleQueryChange);

// Keep the player at the start of the video, but do not show Ask results until a query exists.
renderIdleState();
setActiveMoment(transcriptEntries[0], null);
