
(() => {
  "use strict";

  // ======================================
  // 01 — HELPERS
  // ======================================

  const $ = (selector) =>
    document.querySelector(selector);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ======================================
  // 02 — FULLSCREEN SCENE CONTROLLER
  // ======================================

  const sceneIds = [
    "opening",
    "wishScene",
    "ticketScene",
    "memories",
    "finalScene"
  ];

  const scenes = new Map(
    sceneIds.map(id => [id, document.getElementById(id)])
  );

  let activeScene = "opening";

  function showScene(id) {
    if (!scenes.has(id) || activeScene === id) {
      return;
    }

    const current = scenes.get(activeScene);
    const next = scenes.get(id);

    current.classList.remove("is-active");
    current.setAttribute("aria-hidden", "true");
    current.inert = true;

    next.classList.add("is-active");
    next.removeAttribute("aria-hidden");
    next.inert = false;

    activeScene = id;
  }

  // ======================================
  // 03 — OPENING
  // ======================================

  const countdown = $("#countdown");
  const countdownNumber = $("#countdownNumber");
  const openingContent = $("#openingContent");
  const startFilmButton = $("#startFilm");

  function revealOpening() {
    countdown.classList.add("is-hidden");
    openingContent.classList.add("is-visible");
    startFilmButton.disabled = false;
  }

  if (reduceMotion) {
    revealOpening();
  } else {
    let step = 0;
    const sequence = ["3", "2", "1"];

    const timer = setInterval(() => {
      step++;

      if (step >= sequence.length) {
        clearInterval(timer);
        revealOpening();
      } else {
        countdownNumber.textContent = sequence[step];
      }
    }, 850);
  }

  startFilmButton.addEventListener("click", () => {
    startBackgroundMusic();
    showScene("wishScene");
  });

  // ======================================
  // 04 — BACKGROUND MUSIC
  // ======================================

  const music = $("#backgroundMusic");
  const musicToggle = $("#musicToggle");

  music.volume = 0.45;

  function updateMusicButton() {
    const playing = !music.paused;

    musicToggle.textContent = playing ? "♫" : "♪";
    musicToggle.classList.toggle("is-playing", playing);

    musicToggle.setAttribute(
      "aria-pressed",
      String(playing)
    );

    musicToggle.setAttribute(
      "aria-label",
      playing ? "Müziği duraklat" : "Müziği çal"
    );
  }

  function startBackgroundMusic() {
    if (music.error) return;

    music.play()
      .then(() => {
        musicToggle.hidden = false;
        updateMusicButton();
      })
      .catch(() => {
        updateMusicButton();
      });
  }

  musicToggle.addEventListener("click", () => {
    if (music.paused) {
      startBackgroundMusic();
    } else {
      music.pause();
    }
  });

  music.addEventListener("play", updateMusicButton);
  music.addEventListener("pause", updateMusicButton);

  // Müzik dosyası yoksa kontrolü gösterme.
  music.addEventListener("error", () => {
    musicToggle.hidden = true;
  });

  // ======================================
  // 05 — MAKE A WISH
  // ======================================

  const wishScene = $("#wishScene");

  const blowButton = $("#blowCandles");
  const wishMessage = $("#wishMessage");
  const wishHelper = $("#wishHelper");
  const continueAfterWish = $("#continueAfterWish");

  const flames = Array.from(
    document.querySelectorAll(".flame")
  );

  let candlesOut = false;

  function createSmoke(flame) {
    if (reduceMotion) return;

    const smoke = document.createElement("span");
    smoke.className = "smoke";
    smoke.setAttribute("aria-hidden", "true");

    flame.parentElement.appendChild(smoke);

    smoke.addEventListener(
      "animationend",
      () => smoke.remove(),
      { once: true }
    );
  }

  function extinguishCandles() {
    if (candlesOut) return;

    candlesOut = true;
    blowButton.disabled = true;

    wishScene.classList.add("candles-out");

    flames.forEach((flame, index) => {
      setTimeout(() => {
        flame.classList.add("is-out");
        createSmoke(flame);
      }, reduceMotion ? 0 : index * 140);
    });

    setTimeout(() => {
      wishMessage.textContent =
        "Dileğin kabul olsunnn, Esrakuşumm! ♡";

      wishHelper.hidden = true;
      blowButton.hidden = true;
      continueAfterWish.hidden = false;

    }, reduceMotion ? 0 : 1050);
  }

  blowButton.addEventListener(
    "click",
    extinguishCandles
  );

  continueAfterWish.addEventListener("click", () => {
    showScene("ticketScene");
  });

  // ======================================
  // 06 — PRIVATE SCREENING
  // ======================================

  const ticket = $("#ticket");
  const openTicketButton = $("#openTicket");

  let ticketUsed = false;

  openTicketButton.addEventListener("click", () => {
    if (ticketUsed) return;

    ticketUsed = true;
    openTicketButton.disabled = true;

    ticket.classList.add("is-used");

    setTimeout(() => {
      showScene("memories");
    }, reduceMotion ? 0 : 650);
  });

  // ======================================
  // 07 — MEMORIES DATA
  // ======================================

  const memories = [
    {
      type: "photo",
      src: "media/esra1.jpg",
      label: "güzelimm ♡"
    },
    {
      type: "photo",
      src: "media/biz1.jpg",
      label: "canımıniçiiii ♡"
    },
    {
      type: "video",
      src: "media/video1.mp4",
      poster: "media/poster3.jpg",
      label: "bol gülmeliii ♡"
    },
    {
      type: "photo",
      src: "media/esra2.jpg",
      label: "minik kuşş ♡"
    },
    {
      type: "video",
      src: "media/video2.mp4",
      poster: "media/poster5.jpg",
      label: "bol eğlenmeliiii ♡"
    },
    {
      type: "photo",
      src: "media/biz2.jpg",
      label: "nice beraber seneleree ♡"
    },
    {
      type: "photo",
      src: "media/esra3.jpg",
      label: "sen hep böyle güll ♡"
    },
    {
      type: "video",
      src: "media/video3.mp4",
      poster: "media/poster8.jpg",
      label: "baysss 🫶🏻🌷💕🎀🌸"
    }
  ];

  // ======================================
  // 08 — GALLERY ELEMENTS
  // ======================================

  const dots = $("#dots");
  const card = $("#memoryCard");

  const photo = $("#galleryPhoto");
  const video = $("#galleryVideo");

  const kind = $("#kind");
  const note = $("#memoryNote");

  const ambient = $("#mediaAmbient");
  const frameType = $("#frameType");
  const counter = $("#count");

  const prevButton = $("#prev");
  const nextButton = $("#next");

  let currentIndex = 0;
  let galleryTransition = null;

  dots.innerHTML = memories
    .map((_, index) => {
      return `<b class="${index === 0 ? "active" : ""}"></b>`;
    })
    .join("");

  // ======================================
  // 09 — RENDER MEMORY
  // ======================================

  function renderMemory(index, immediate = false) {

    const nextIndex = Math.max(
      0,
      Math.min(memories.length - 1, index)
    );

    if (nextIndex === currentIndex && !immediate) {
      return;
    }

    if (galleryTransition !== null) {
      clearTimeout(galleryTransition);
      galleryTransition = null;
    }

    video.pause();

    if (!immediate && !reduceMotion) {
      card.classList.add("changing");
    }

    const swap = () => {

      currentIndex = nextIndex;
      const memory = memories[currentIndex];

      kind.textContent = memory.label;
      note.textContent = "";

      frameType.textContent =
        String(currentIndex + 1).padStart(2, "0");

      const backgroundSource =
        memory.type === "photo"
          ? memory.src
          : memory.poster;

      ambient.style.backgroundImage =
        `url("${backgroundSource}")`;

      if (memory.type === "photo") {

        video.pause();
        video.removeAttribute("src");
        video.removeAttribute("poster");

        video.style.display = "none";
        video.load();

        photo.style.display = "block";
        photo.src = memory.src;
        photo.alt = "Anı fotoğrafı";

      } else {

        photo.style.display = "none";

        video.style.display = "block";
        video.poster = memory.poster;
        video.src = memory.src;

        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;

        video.load();
      }

      counter.textContent =
        `${String(currentIndex + 1).padStart(2, "0")} / ` +
        `${String(memories.length).padStart(2, "0")}`;

      dots.querySelectorAll("b").forEach((dot, i) => {
        dot.classList.toggle(
          "active",
          i === currentIndex
        );
      });

      prevButton.disabled = currentIndex === 0;

      nextButton.setAttribute(
        "aria-label",
        currentIndex === memories.length - 1
          ? "Final mesajına geç"
          : "Sonraki anı"
      );

      galleryTransition = null;

      requestAnimationFrame(() => {
        card.classList.remove("changing");
      });
    };

    if (immediate || reduceMotion) {
      swap();
    } else {
      galleryTransition = setTimeout(swap, 210);
    }
  }

  // ======================================
  // 10 — GALLERY NAVIGATION
  // ======================================

  prevButton.addEventListener("click", () => {
    renderMemory(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex === memories.length - 1) {
      showFinal();
    } else {
      renderMemory(currentIndex + 1);
    }
  });

  // ======================================
  // 11 — FINAL SCENE
  // ======================================

  const finalScene = $("#finalScene");

  let finalStarted = false;
  let finalTimer = null;

  // Ödül ekranının gösterim süresi
  const AWARD_DURATION = 12000;

  function startFinal() {
    if (finalStarted) return;

    finalStarted = true;
    finalScene.classList.add("visible");

    finalTimer = setTimeout(() => {
      finalScene.classList.add("message-visible");
    }, reduceMotion ? 0 : AWARD_DURATION);
  }

  function showFinal() {
    video.pause();

    showScene("finalScene");
    startFinal();
  }

  video.addEventListener("ended", () => {
    if (
      currentIndex === memories.length - 1 &&
      activeScene === "memories"
    ) {
      showFinal();
    }
  });

  $("#backToMemories").addEventListener("click", () => {
    showScene("memories");
  });

  // ======================================
  // 12 — MOBILE SWIPE
  // SADECE ANILAR ARASI GEÇİŞ
  // ======================================

  let touchStart = null;

  card.addEventListener(
    "touchstart",
    (event) => {
      if (event.target.closest("video")) return;

      touchStart = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    },
    { passive: true }
  );

  card.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart) return;

      if (event.target.closest("video")) {
        touchStart = null;
        return;
      }

      const dx =
        event.changedTouches[0].clientX -
        touchStart.x;

      const dy =
        event.changedTouches[0].clientY -
        touchStart.y;

      if (
        Math.abs(dx) > 55 &&
        Math.abs(dx) > Math.abs(dy) * 1.4
      ) {

        if (
          dx < 0 &&
          currentIndex === memories.length - 1
        ) {
          showFinal();
        } else {
          renderMemory(
            currentIndex + (dx < 0 ? 1 : -1)
          );
        }
      }

      touchStart = null;
    },
    { passive: true }
  );

  // ======================================
  // 13 — VIEWPORT HEIGHT
  // ======================================

  function updateViewportHeight() {
    document.documentElement.style.setProperty(
      "--screen-height",
      `${window.innerHeight}px`
    );
  }

  updateViewportHeight();

  window.addEventListener(
    "resize",
    updateViewportHeight,
    { passive: true }
  );

  // ======================================
  // 14 — INITIALIZATION
  // ======================================

  renderMemory(0, true);

})();
