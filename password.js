/* =========================================================================
   MIDNIGHT ROSE — password.js
   Handles validation for each lock page.
   Each lock page sets window.MR_LOCK_CONFIG before including this file.
   --------------------------------------------------------------------------
   window.MR_LOCK_CONFIG = {
     answer: "04-13-26",
     next: "lock2.html",
     wrongMessages: ["Hmm... that's not the memory I'm looking for. Try again, my love. ♡"],
     isFinal: false,          // true only on lock3
     resetTo: "lock1.html"    // where a wrong final answer sends the user back to
   };
   ========================================================================= */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const config = window.MR_LOCK_CONFIG;
    if (!config) return;

    const form = document.getElementById("lock-form");
    const input = document.getElementById("lock-input");
    const message = document.getElementById("lock-message");
    const illustration = document.querySelector(".lock-illustration");
    const veil = document.getElementById("transition-veil");

    if (!form || !input) return;

    function normalize(str) {
      return str.trim().replace(/\s+/g, "");
    }

    function showWrong() {
      const msgs = config.wrongMessages || ["That's not quite it. Try again, my love. ♡"];
      message.textContent = msgs[Math.floor(Math.random() * msgs.length)];
      message.classList.remove("shake");
      // force reflow to restart animation
      void message.offsetWidth;
      message.classList.add("shake");
      input.value = "";
      input.focus();
      input.setAttribute("aria-invalid", "true");
    }

    function succeed() {
      input.setAttribute("aria-invalid", "false");
      message.textContent = "";
      illustration?.classList.add("unlocking");
      window.MidnightRose?.burstHearts(20);

      // if this is the final lock, remember that all three memories were unlocked
      if (config.isFinal) {
        sessionStorage.setItem("midnightRoseUnlocked", "true");
      }

      setTimeout(() => {
        if (veil) veil.classList.add("active");
        setTimeout(() => {
          window.location.href = config.next;
        }, 500);
      }, 900);
    }

    function fail() {
      if (config.isFinal) {
        // Reset the ENTIRE password experience back to the first lock page.
        sessionStorage.removeItem("midnightRoseLock1");
        sessionStorage.removeItem("midnightRoseLock2");
        message.textContent = "That's not quite it... let's begin again from the very start. ♡";
        message.classList.add("shake");
        input.value = "";
        setTimeout(() => {
          if (veil) veil.classList.add("active");
          setTimeout(() => {
            window.location.href = config.resetTo;
          }, 500);
        }, 1400);
      } else {
        showWrong();
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = normalize(input.value);
      const answer = normalize(config.answer);
      if (value.toLowerCase() === answer.toLowerCase()) {
        if (config.rememberKey) sessionStorage.setItem(config.rememberKey, "true");
        succeed();
      } else {
        fail();
      }
    });
  });
})();
