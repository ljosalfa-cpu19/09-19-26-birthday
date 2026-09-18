/* =========================================================================
   MIDNIGHT ROSE — digital-gifts.js
   ---------------------------------------------------------------------
   ✏️  EDIT ME: the "coupons" array below is the only place you need to
   touch to add, remove, or rewrite coupon cards. Give a coupon
   `type: "yesday"` to make it the special redeemable "Yes Day" coupon
   with the calendar + time picker + copy-text flow. Every other coupon
   just flips to show its "back" text — no further action needed.

   IMPORTANT: exactly one coupon should have type "yesday". That coupon
   is also the one that unlocks the site navigation on this page (see
   the "NAV LOCK" section below) once she confirms a date.
   ========================================================================= */

const coupons = [
  {
    id: "yesday",
    type: "yesday",
    icon: "✅",
    title: "Yes Day",
    back: "Whatever you want, all day — I say yes. Pick the date. ♡",
  },
  {
    id: "lazy",
    type: "note",
    icon: "😴",
    title: "Lazy Day",
    back: "A whole day of doing absolutely nothing together. No plans, no errands — just us.",
  },
  {
    id: "dinner",
    type: "note",
    icon: "🍽️",
    title: "Dinner, Your Choice",
    back: "Anywhere you want to eat, whenever you want. No complaints from me.",
  },
  {
    id: "movie",
    type: "note",
    icon: "🎬",
    title: "Movie Marathon",
    back: "You pick every movie. I'll handle the snacks and the blanket.",
  },
];

const YES_DAY_CHOSEN_KEY = "midnightRoseYesDayChosen";
const YES_DAY_TEXT_KEY = "midnightRoseYesDayText";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("coupon-grid");
  if (!grid) return;

  /* ---------------- Render coupon cards ---------------- */
  coupons.forEach((coupon) => {
    const card = document.createElement("div");
    card.className = "coupon";
    card.dataset.id = coupon.id;

    const alreadyChosen = coupon.type === "yesday" && sessionStorage.getItem(YES_DAY_CHOSEN_KEY) === "true";
    if (alreadyChosen) card.classList.add("redeemed");

    card.innerHTML = `
      <div class="coupon-inner">
        <div class="coupon-face coupon-front">
          <span class="coupon-icon">${coupon.icon}</span>
          <h3>${coupon.title}</h3>
          <span class="coupon-hint">Tap to open</span>
          ${alreadyChosen ? '<span class="coupon-redeemed-tag">✓ Date chosen</span>' : ""}
        </div>
        <div class="coupon-face coupon-back">
          <h3>${coupon.title}</h3>
          <p>${coupon.back}</p>
          ${coupon.type === "yesday" ? '<button class="btn redeem-open-btn">Choose My Yes Day&nbsp;♡</button>' : ""}
        </div>
      </div>
    `;

    const inner = card.querySelector(".coupon-inner");
    inner.addEventListener("click", (e) => {
      // don't flip back if the click was on the redeem button
      if (e.target.closest(".redeem-open-btn")) return;
      card.classList.toggle("flipped");
    });

    const redeemBtn = card.querySelector(".redeem-open-btn");
    redeemBtn?.addEventListener("click", () => openRedeemModal(card));

    grid.appendChild(card);
  });

  /* ---------------- NAV LOCK ----------------
     She can't leave this page via the nav/hamburger until the Yes Day
     coupon has been redeemed (a date confirmed). This purely uses CSS
     pointer-events (see body.gift-locked in style.css), so it works
     regardless of when main.js attaches its own click handlers. */
  const lockNote = document.getElementById("gift-lock-note");
  function refreshLockState() {
    const chosen = sessionStorage.getItem(YES_DAY_CHOSEN_KEY) === "true";
    document.body.classList.toggle("gift-locked", !chosen);
  }
  refreshLockState();

  /* ---------------- Redeem modal (calendar + time + confirm/copy) ---------------- */
  const backdrop = document.getElementById("redeem-backdrop");
  const calMonthLabel = document.getElementById("cal-month-label");
  const calGrid = document.getElementById("cal-grid");
  const calPrev = document.getElementById("cal-prev");
  const calNext = document.getElementById("cal-next");
  const timeInput = document.getElementById("redeem-time-input");
  const confirmBtn = document.getElementById("redeem-confirm-btn");
  const closeBtn = document.getElementById("redeem-close-btn");
  const pickerStep = document.getElementById("redeem-picker-step");
  const resultStep = document.getElementById("redeem-result-step");
  const resultText = document.getElementById("redeem-result-text");
  const copyBtn = document.getElementById("redeem-copy-btn");
  const copiedNote = document.getElementById("redeem-copied-note");
  const changeDateBtn = document.getElementById("redeem-change-date-btn");
  const doneBtn = document.getElementById("redeem-done-btn");

  let viewYear, viewMonth, selectedDate = null, activeCard = null;

  function openRedeemModal(card) {
    activeCard = card;
    const now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
    selectedDate = null;
    timeInput.value = "";
    pickerStep.classList.add("show");
    resultStep.classList.remove("show");
    renderCalendar();
    backdrop.classList.add("open");
  }

  function closeRedeemModal() {
    backdrop.classList.remove("open");
  }

  function renderCalendar() {
    const monthNames = ["January","February","March","April","May","June",
      "July","August","September","October","November","December"];
    calMonthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;
    calGrid.innerHTML = "";

    ["S","M","T","W","T","F","S"].forEach((d) => {
      const el = document.createElement("span");
      el.className = "cal-dow";
      el.textContent = d;
      calGrid.appendChild(el);
    });

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement("span");
      el.className = "cal-empty";
      calGrid.appendChild(el);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-day";
      btn.textContent = d;
      if (selectedDate && selectedDate.getFullYear() === viewYear &&
          selectedDate.getMonth() === viewMonth && selectedDate.getDate() === d) {
        btn.classList.add("selected");
      }
      btn.addEventListener("click", () => {
        selectedDate = new Date(viewYear, viewMonth, d);
        renderCalendar();
      });
      calGrid.appendChild(btn);
    }
  }

  calPrev.addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  calNext.addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  confirmBtn.addEventListener("click", () => {
    if (!selectedDate) {
      calGrid.classList.add("shake");
      setTimeout(() => calGrid.classList.remove("shake"), 500);
      return;
    }
    const weekday = selectedDate.toLocaleDateString(undefined, { weekday: "long" });
    const monthDay = selectedDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

    let timeLabel = "a time of your choosing";
    if (timeInput.value) {
      const [h, m] = timeInput.value.split(":").map(Number);
      const d = new Date();
      d.setHours(h, m);
      timeLabel = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    }

    const message = `🎉 I'm cashing in my Yes Day! Mark it down — ${weekday}, ${monthDay} at ${timeLabel}. Whatever I want, all day, you say yes. See you then! ♡`;

    resultText.value = message;
    pickerStep.classList.remove("show");
    resultStep.classList.add("show");
    copiedNote.classList.remove("show");

    sessionStorage.setItem(YES_DAY_CHOSEN_KEY, "true");
    sessionStorage.setItem(YES_DAY_TEXT_KEY, message);
    refreshLockState();

    if (activeCard) {
      activeCard.classList.add("redeemed");
      const front = activeCard.querySelector(".coupon-front");
      if (front && !front.querySelector(".coupon-redeemed-tag")) {
        const tag = document.createElement("span");
        tag.className = "coupon-redeemed-tag";
        tag.textContent = "✓ Date chosen";
        front.appendChild(tag);
      }
    }
  });

  changeDateBtn.addEventListener("click", () => {
    resultStep.classList.remove("show");
    pickerStep.classList.add("show");
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(resultText.value);
    } catch (err) {
      // fallback for browsers without Clipboard API access
      resultText.select();
      document.execCommand("copy");
    }
    copiedNote.classList.add("show");
    setTimeout(() => copiedNote.classList.remove("show"), 2200);
  });

  doneBtn.addEventListener("click", closeRedeemModal);
  closeBtn.addEventListener("click", closeRedeemModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeRedeemModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRedeemModal();
  });
});
