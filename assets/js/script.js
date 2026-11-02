/* ==========================================
   LIVRO DA MARIANY — navegação mobile e virada 3D
   Cada toque avança exatamente uma página.
   ========================================== */
const book = document.querySelector("#book");
const originalSheets = [...book.querySelectorAll(".sheet")];

// Recolhe as faces na ordem em que estão no HTML:
// capa, prólogo, capítulo I, interlúdio, encontro...
// Depois monta uma folha física por página, com a página seguinte no verso.
const pageContents = originalSheets.flatMap((sheet) =>
  [...sheet.querySelectorAll(".face")].map((face) => ({
    html: face.innerHTML,
    cover: face.classList.contains("cover"),
    originalClass: face.classList.contains("cover") ? "cover" : "paper"
  }))
);


book.innerHTML = "";
const sheets = [];

pageContents.forEach((page, index) => {
  const sheet = document.createElement("article");
  sheet.className = "sheet";
  sheet.dataset.index = String(index);

  const face = document.createElement("div");
  face.className = `face front ${page.originalClass}`;

  const content = document.createElement("div");
  content.className = "page-scroll";
  content.innerHTML = page.html;

  face.appendChild(content);

  if ([2, 4, 6, 7, 8].includes(index)) {
    face.classList.add("paper--top");
  }

  if ([5, 9, 10].includes(index)) {
    face.classList.add("no--scroll");
  }

  sheet.appendChild(face);
  book.appendChild(sheet);
  sheets.push(sheet);
});

const previousButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const statusText = document.querySelector("#pageStatus");
const progressBar = document.querySelector("#progressBar");
const chapterButtons = [...document.querySelectorAll(".chapter-nav button")];

let pageIndex = 0;

function updateBookUI() {
  sheets.forEach((sheet, index) => {
    sheet.classList.toggle("active-page", index === pageIndex);
    sheet.setAttribute("aria-hidden", String(index !== pageIndex));
  });

  progressBar.style.width =
    `${(pageIndex / Math.max(sheets.length - 1, 1)) * 100}%`;

  statusText.textContent = pageIndex === 0
    ? "Toque na seta para abrir o livro. Cada toque avança uma página."
    : `Página ${pageIndex + 1} de ${sheets.length}`;

  chapterButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      Number(button.dataset.page) === chapterForPage(pageIndex)
    );
  });
}

function chapterForPage(index) {
  if (index <= 0) return 0;
  if (index <= 2) return 1;
  if (index <= 4) return 2;
  if (index <= 6) return 3;
  if (index <= 7) return 4;
  return 5;
}

function nextPage() {
  if (pageIndex < sheets.length - 1) {
    pageIndex++;
    updateBookUI();
  }
}

function previousPage() {
  if (pageIndex > 0) {
    pageIndex--;
    updateBookUI();
  }
}

nextButton.addEventListener("click", nextPage);
previousButton.addEventListener("click", previousPage);

chapterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const chapterPages = [0, 2, 4, 6, 8, 10];
    const target = Number(button.dataset.page);

    pageIndex = Math.min(
      chapterPages[target] ?? target,
      sheets.length - 1
    );

    updateBookUI();
  });
});

book.addEventListener("click", (event) => {
  if (event.target.closest("#openBook")) {
    nextPage();
  }

  if (event.target.closest("#revealSurprise")) {
    const face = event.target.closest(".face");
    const surprise = face?.querySelector("#surprise");

    if (!surprise) return;

    surprise.classList.toggle("show");

    const button = event.target.closest("#revealSurprise");
    button.textContent = surprise.classList.contains("show")
      ? "Fechar surpresa ♡"
      : "Abrir minha surpresa ♡";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea, select")) return;

  if (event.key === "ArrowRight") nextPage();
  if (event.key === "ArrowLeft") previousPage();
});

updateBookUI();


/* ==========================================
   ANIMAÇÃO DE FLORES E CORAÇÕES CAINDO
   ========================================== */

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!reduceMotion) {
  window.setInterval(() => {
    const petal = document.createElement("span");

    petal.className = "petal";
    petal.textContent = Math.random() > 0.55 ? "✿" : "♡";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.fontSize = `${12 + Math.random() * 15}px`;
    petal.style.color = Math.random() > 0.5 ? "#f2b7c8" : "#f5d99a";
    petal.style.animationDuration = `${7 + Math.random() * 7}s`;

    document.body.appendChild(petal);

    window.setTimeout(() => {
      petal.remove();
    }, 15000);
  }, 1400);
}



/* ==========================================
   INTRO DE ANIVERSÁRIO — MARIANY
   ========================================== */

/* ===== ABRIR O PRESENTE DE ANIVERSÁRIO ===== */

const birthdayIntro = document.querySelector("#birthday-intro");
const enterBookButton = document.querySelector("#enter-book");

if (birthdayIntro && enterBookButton) {
  enterBookButton.addEventListener("click", () => {
    if (enterBookButton.disabled) return;

    enterBookButton.disabled = true;
    birthdayIntro.classList.add("is-closing");

    window.setTimeout(() => {
      birthdayIntro.remove();
    }, 1250);
  });
}


/* ==========================================
   PLAYERS PERSONALIZADOS — LIVRO DA MARIANY
   ========================================== */

(() => {
  const players = document.querySelectorAll(".music-player");

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  players.forEach((player) => {
    const audio = player.querySelector(".music-audio");
    const playButton = player.querySelector(".music-play");
    const playIcon = player.querySelector(".music-play-icon");
    const progress = player.querySelector(".music-progress");
    const currentTime = player.querySelector(".music-current");
    const duration = player.querySelector(".music-duration");

    if (
      !audio ||
      !playButton ||
      !playIcon ||
      !progress ||
      !currentTime ||
      !duration
    ) {
      return;
    }

    function updatePlayButton() {
      const playing = !audio.paused && !audio.ended;

      player.classList.toggle("is-playing", playing);
      playIcon.textContent = playing ? "Ⅱ" : "▶";
      playButton.setAttribute(
        "aria-label",
        playing ? "Pausar música" : "Reproduzir música"
      );
    }

    function updateProgress() {
      currentTime.textContent = formatTime(audio.currentTime);

      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = String(
          (audio.currentTime / audio.duration) * 100
        );
      } else {
        progress.value = "0";
      }
    }

    function updateDuration() {
      duration.textContent = formatTime(audio.duration);
      updateProgress();
    }

    playButton.addEventListener("click", async () => {
      if (!audio.paused) {
        audio.pause();
        return;
      }

      // Pausa todas as outras músicas deste livro.
      players.forEach((otherPlayer) => {
        const otherAudio = otherPlayer.querySelector(".music-audio");

        if (otherAudio && otherAudio !== audio) {
          otherAudio.pause();
        }
      });

      try {
        await audio.play();
      } catch (error) {
        console.error("Não foi possível reproduzir o áudio:", error);
      }
    });

    audio.addEventListener("play", () => {
      // Também cobre reprodução iniciada por outros controles.
      players.forEach((otherPlayer) => {
        const otherAudio = otherPlayer.querySelector(".music-audio");

        if (otherAudio && otherAudio !== audio) {
          otherAudio.pause();
        }
      });

      updatePlayButton();
    });

    audio.addEventListener("pause", updatePlayButton);
    audio.addEventListener("ended", () => {
      updatePlayButton();
      updateProgress();
    });

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);

    progress.addEventListener("input", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
          (Number(progress.value) / 100) * audio.duration;
      }
    });

    updatePlayButton();
    updateDuration();
  });
})();
