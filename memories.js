/* =========================================================================
   MIDNIGHT ROSE — memories.js
   ---------------------------------------------------------------------
   ✏️  EDIT ME: three arrays below are the only things you need to touch
   to personalize the Memories page — "reasons", "timeline", and
   "specialMemories".
   ========================================================================= */

const reasons = [
  "Because you make me smile without even trying.",
  "Because you make ordinary days feel special.",
  "Because you are you.",
  "Because you listen, really listen.",
  "Because your comfort is my favorite part in life",
  "Because you make me want to be better.",
  "Because you remember the little things.",
  "Because being with you feels like home.",
  "Because you are patient with me.",
  "Because you love fiercely and quietly at once.",
  "Because you make hard days softer.",
  "Because you still give me butterflies.",
  "Because you are effortlessly kind.",
  "Because You are mine.",
  "Because you believe in me, even when I don't.",
];

const timeline = [
  {
    date: "04.13.26",
    title: "The Day We Met",
    description: "Add our story here... the first moment I knew there was something different about you.",
    photo: "",
  },
  {
    date: "05.11.2026",
    title: "The Day We Confessed",
    description: "Add our story here... the day the words finally found their way out.",
    photo: "",
  },
  {
    date: "07.11.26",
    title: "The Day I Courted You",
    description: "Add our story here... the day I decided to be brave, on purpose, for you.",
    photo: "",
  },
];

const specialMemories = [
  {
    date: "Add a date",
    title: "A Day I'll Always Remember",
    story: "Add your story here...",
    photo: "photo32.png",
  },
  {
    date: "Add a date",
    title: "Somewhere We Went Together",
    story: "Add your story here...",
    photo: "image.png",
  },
  {
    date: "Add a date",
    title: "A Quiet Moment I Loved",
    story: "Add your story here...",
    photo: "photo15.png",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- Reasons ---------------- */
  const reasonsGrid = document.getElementById("reasons-grid");
  const moreBtn = document.getElementById("reasons-more");
  const foreverLine = document.getElementById("reasons-forever");
  let revealedCount = 0;

  function renderReasonBatch(count) {
    const slice = reasons.slice(revealedCount, revealedCount + count);
    slice.forEach((text, i) => {
      const card = document.createElement("div");
      card.className = "reason-card";
      card.innerHTML = `
        <span class="reason-num">${String(revealedCount + i + 1).padStart(2, "0")}</span>
        <span class="reason-text">${text}</span>
      `;
      reasonsGrid.appendChild(card);
      requestAnimationFrame(() => {
        setTimeout(() => card.classList.add("revealed"), i * 90);
      });
    });
    revealedCount += slice.length;
    if (revealedCount >= reasons.length) {
      moreBtn.style.display = "none";
      foreverLine.classList.add("show");
    }
  }

  if (reasonsGrid) {
    renderReasonBatch(4);
    moreBtn?.addEventListener("click", () => renderReasonBatch(4));
  }

  /* ---------------- Timeline ---------------- */
  const timelineEl = document.getElementById("timeline");
  if (timelineEl) {
    timeline.forEach((item) => {
      const el = document.createElement("div");
      el.className = "timeline-item";
      el.innerHTML = `
        <div class="timeline-date">${item.date}</div>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-desc">${item.description}</p>
        ${item.photo ? `<div class="timeline-photo"><img src="${item.photo}" alt="${item.title}" loading="lazy"></div>` : ""}
      `;
      timelineEl.appendChild(el);
    });
  }

  /* ---------------- Special Memories ---------------- */
  const specialGrid = document.getElementById("special-grid");
  if (specialGrid) {
    specialMemories.forEach((mem) => {
      const card = document.createElement("div");
      card.className = "special-card";
      card.innerHTML = `
        <img src="${mem.photo}" alt="${mem.title}" loading="lazy">
        <div>
          <div class="sc-date">${mem.date}</div>
          <h3>${mem.title}</h3>
          <p>${mem.story}</p>
        </div>
      `;
      specialGrid.appendChild(card);
    });
  }
});
