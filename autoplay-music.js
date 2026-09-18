/*
  autoplay-music.js
  ------------------
  Drop this file in your same folder as your HTML files and include it on every page,
  AFTER main.js:

    <script src="main.js"></script>
    <script src="autoplay-music.js"></script>

  It makes the #bg-music audio element start playing automatically
  as soon as the page loads. If the browser blocks autoplay with sound
  (most do, until the user has interacted with the page at least once),
  it silently falls back to starting the music on the very first
  click / tap / keypress anywhere on the page — so the user never has
  to press the ♪ button themselves.

  Don't forget to set a real file in the audio tag on every page:
    <audio id="bg-music" loop src="your-song.mp3" preload="auto"></audio>
*/

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("bg-music");
    const toggleBtn = document.getElementById("music-toggle");
    if (!audio) return;

    // Nothing to play if src was never set
    if (!audio.getAttribute("src")) {
      console.warn("bg-music has no src set — add your mp3 path to autoplay music.");
      return;
    }

    audio.volume = 0.6; // adjust to taste (0.0–1.0)

    function markPlaying(isPlaying) {
      if (toggleBtn) {
        toggleBtn.dataset.playing = isPlaying ? "true" : "false";
        toggleBtn.textContent = isPlaying ? "♪" : "♪̸";
      }
    }

    function tryPlay() {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => markPlaying(true))
          .catch(() => {
            // Autoplay was blocked — wait for first user interaction
            armFallback();
          });
      }
    }

    let fallbackArmed = false;
    function armFallback() {
      if (fallbackArmed) return;
      fallbackArmed = true;

      const startOnInteraction = () => {
        audio
          .play()
          .then(() => {
            markPlaying(true);
            removeFallback();
          })
          .catch(() => {
            /* still blocked, listeners stay attached and will retry */
          });
      };

      const removeFallback = () => {
        document.removeEventListener("click", startOnInteraction);
        document.removeEventListener("touchstart", startOnInteraction);
        document.removeEventListener("keydown", startOnInteraction);
      };

      document.addEventListener("click", startOnInteraction, { once: true });
      document.addEventListener("touchstart", startOnInteraction, { once: true });
      document.addEventListener("keydown", startOnInteraction, { once: true });
    }

    // Attempt autoplay right away on page load
    tryPlay();

    // Keep the existing music-toggle button working as a manual override,
    // in case main.js doesn't already bind this itself.
    if (toggleBtn && !toggleBtn.dataset.mrBound) {
      toggleBtn.dataset.mrBound = "true";
      toggleBtn.addEventListener("click", function () {
        if (audio.paused) {
          audio.play().then(() => markPlaying(true)).catch(() => {});
        } else {
          audio.pause();
          markPlaying(false);
        }
      });
    }
  });
})();
