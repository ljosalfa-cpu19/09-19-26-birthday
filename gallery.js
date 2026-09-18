
const photos = Array.from({ length: 100 }, (_, i) => {
  const n = i + 1;
  const categories = ["memories", "us", "special"];
  return {
    src: `photo${n}.png`,
    caption: `A beautiful moment, no. ${n} ♡`,
    category: categories[n % 3],
  };
});

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gallery-grid");
  const filterBar = document.getElementById("gallery-filters");
  if (!grid) return;

  let activeFilter = "all";
  let visiblePhotos = photos;

  function render() {
    grid.innerHTML = "";
    visiblePhotos = activeFilter === "all"
      ? photos
      : photos.filter((p) => p.category === activeFilter);

    visiblePhotos.forEach((photo, i) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      fig.setAttribute("role", "button");
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("aria-label", `Open photo ${i + 1} of ${visiblePhotos.length}: ${photo.caption}`);
      fig.style.setProperty("--tilt", (i % 2 === 0 ? -1 : 1) * (1 + Math.random() * 2.4) + "deg");

      fig.innerHTML = `
        <span class="tape" aria-hidden="true"></span>
        <img src="${photo.src}" alt="${photo.caption}" loading="lazy" width="400" height="500">
        <figcaption>${photo.caption}</figcaption>
      `;

      fig.addEventListener("click", () => openLightbox(i));

      fig.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(i);
        }
      });

      grid.appendChild(fig);
    });
  }

  filterBar?.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBar.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      render();
    });
  });

  render();

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const btnPrev = document.getElementById("lightbox-prev");
  const btnNext = document.getElementById("lightbox-next");
  const btnClose = document.getElementById("lightbox-close");

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("open");
    btnClose.focus();
  }

  function updateLightbox() {
    const photo = visiblePhotos[currentIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.caption;
    lightboxCaption.textContent = photo.caption;
    lightboxCounter.textContent = `Photo ${currentIndex + 1} / ${visiblePhotos.length}`;
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
  }

  function next() {
    currentIndex = (currentIndex + 1) % visiblePhotos.length;
    updateLightbox();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
    updateLightbox();
  }

  btnNext?.addEventListener("click", next);
  btnPrev?.addEventListener("click", prev);
  btnClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // basic swipe support
  let touchStartX = 0;

  lightbox?.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox?.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;

    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });
});

