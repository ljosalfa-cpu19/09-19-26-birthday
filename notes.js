/* =========================================================================
   MIDNIGHT ROSE — notes.js
   ---------------------------------------------------------------------
   ✏️  EDIT ME: this "notes" array is the ONLY place you need to touch to
   change what she reads on the Notes page.

   Each note now has TWO parts:
     - "preview": the short line she sees on the card (card size/style
       stays exactly the same as before)
     - "full": the longer message that's only revealed when she taps the
       card open. Write as much as you want here — separate paragraphs
       with "%%" and they'll each render as their own paragraph in the
       popup.

   Add, remove, or rewrite as many entries as you like (about 10–30
   works best).
   ========================================================================= */

const notes = [
  {
    title: "A Little Reminder",
    preview: "You make ordinary days feel special.",
    full: "With you, ordinary days become much more interesting.%%Even though they say that one day magiging boring daw ang always on call. but to me?? nahh, it becomes more interesting.%%Always know that I love you so much Alyy!!. ♡",
  },
  {
    title: "I love you",
    preview: "In ups and downs",
    full: "No matter what situation may come i will aways be there for you my love.%%In time's when you are down, I will Love you.%%In time's of your Ups, I will Still love you and of course, Support you :> . ♡",
  },
  {
    title: "For You",
    preview: "You are my Favorite part of my life.",
    full: "You are one of my favorite parts of life.%%You always make me smile and you always make me feel Love.",
  },
  {
    title: "A Small Promise",
    preview: "I hope I can keep making you smile.",
    full: "I hope I can keep making you smile.%%To me Making you smile make my life more happier, It make me feel so much butterflies and makes me Fulfill things.",
  },
    {
    title: "If I Would",
    preview: "If I would save moments forever, I'd save ours.",
    full: "If I could save moments forever, I'd save ours.%%Memories with you is what matter most.%%And if I could only keep one, I think I already know which. ♡",
  },
  {
    title: "On Quiet Days",
    preview: "Even the quiet days are better with you in them.",
    full: "Even the quiet days are better with you in them.%%I used to think the good days had to be loud or eventful to count. but you proved me wrong.%%the time we were silent, it was like a bloom of light that we cacn still feel each other's presence even though we're busy",
  
  },
    {
    title: "The Truth",
    preview: "You are easy to love.",
    full: "You are easy to love.%%I say that because I mean it %%They just don't know how to love you preperly and to care for.",
    },
  {
    title: "You are a choice",
    preview: "You are not an option.",
    full: "You were neven an option, you were a choice, a choice that I decided I would risk it all just to marry you%%A choice that I did not Regret.",
  },
  {
    title: "Thank You",
    preview: "To every moments that you were there with me.",
    full: "In my ups and downs.%%You never left me nor tried to judge me%%Instead you understand me and love me",
  },
  {
    title: "A Little Secret",
    preview: "You are my favorite thought on a busy day.",
    full: "Even though I am busy, Thinking about you makes me have butterflies%%LOVE YAAA",
  },
  {
    title: "In times of a troubled Heart",
    preview: "Read This",
    full: "John 14:27 - Peace I leave with you, My peace I give to you; not as the world gives do I give to you. Let not your heart be troubled, neither let it be afraid. %%May God bring you peace in times of trouble and may he calm your heart he know you and he knows your heart, he knows you are broken and you are scarred form the things that happened in the past.%%Let it go and pray to it, only then God will move to your life and bring you peace"

  },
  {
    title: "For your plans in the future",
    preview: "Read This.",
    full: "Jeremiah 29:11: For I know the plans I have for you,' declares the Lord, 'plans to prosper you and not to harm you, plans to give you hope and a future.%%God has a plan for your life, and his plan is much greater.",
  },
    {
    title: "One More Thing",
    preview: "When you are angry.",
    full: "James 1:19-20:  19 My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry, %%Because human anger does not produce the righteousness that God desires.,"

  },
];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("notes-grid");
  const backdrop = document.getElementById("note-modal-backdrop");
  const modalTitle = document.getElementById("note-modal-title");
  const modalText = document.getElementById("note-modal-text");
  const modalClose = document.getElementById("note-modal-close");

  if (!grid) return;

  notes.forEach((note, i) => {
    const card = document.createElement("button");
    card.className = "note-card";
    card.style.setProperty("--tilt", (i % 2 === 0 ? -1 : 1) * (1 + Math.random() * 2) + "deg");
    card.setAttribute("aria-haspopup", "dialog");
    card.innerHTML = `
      <span class="tape" aria-hidden="true"></span>
      <h3>${note.title}</h3>
      <p>${note.preview}</p>
    `;
    card.addEventListener("click", () => openNote(note));
    grid.appendChild(card);
  });

  function openNote(note) {
    modalTitle.textContent = note.title;
    // "full" can contain multiple paragraphs separated by "%%"
    const paragraphs = note.full.split("%%");
    modalText.innerHTML = paragraphs.map((p) => `<p>${p}</p>`).join("");
    backdrop.classList.add("open");
    window.MidnightRose?.burstHearts(10);
    modalClose.focus();
  }

  function closeNote() {
    backdrop.classList.remove("open");
  }

  modalClose?.addEventListener("click", closeNote);
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) closeNote();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNote();
  });
});
