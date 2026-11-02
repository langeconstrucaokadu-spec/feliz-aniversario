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
  sheet.style.zIndex = String(pageContents.length - index + 10);


const front = document.createElement("div");
front.className = `face front ${page.originalClass}`;

const frontContent = document.createElement("div");
frontContent.className = "page-scroll";
frontContent.innerHTML = page.html;
front.appendChild(frontContent);

if (
  index === 2 ||
  index === 4 ||
  index === 6 ||
  index === 7 ||
  index === 8
) {
  front.classList.add("paper--top");
}

if (index === 5 || index === 9 || index === 10) {
  front.classList.add("no--scroll");
}

const back = document.createElement("div");
back.className = "face back";

if (pageContents[index + 1]) {
  back.classList.add(pageContents[index + 1].originalClass);

  const backContent = document.createElement("div");
  backContent.className = "page-scroll";
  backContent.innerHTML = pageContents[index + 1].html;
  back.appendChild(backContent);
} else {
  back.classList.add("paper");

  const backContent = document.createElement("div");
  backContent.className = "page-scroll";
  backContent.innerHTML = `
    <p class="page-kicker">Continua…</p>
    <h2>O próximo capítulo</h2>
    <p>A nossa história ainda está sendo escrita. ♡</p>
  `;
  back.appendChild(backContent);
}

  sheet.append(front, back);
  book.appendChild(sheet);
  sheets.push(sheet);
});

const previousButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const statusText = document.querySelector("#pageStatus");
const progressBar = document.querySelector("#progressBar");
const chapterButtons = [...document.querySelectorAll(".chapter-nav button")];
const revealButton = document.querySelector("#revealSurprise");
let pageIndex = 0;

function updateBookUI() {
  sheets.forEach((sheet, index) => {
    const flipped = index < pageIndex;
    sheet.classList.toggle("flipped", flipped);
    // Folhas ainda não viradas ficam à frente; as já viradas recuam.
    sheet.style.zIndex = String(flipped ? index + 1 : sheets.length - index + 10);
  });

  progressBar.style.width = `${(pageIndex / (sheets.length - 1)) * 100}%`;
  statusText.textContent = pageIndex === 0
    ? "Toque na seta para abrir o livro. Cada toque vira uma página."
    : `Página ${pageIndex + 1} de ${sheets.length} · toque nas setas para continuar`;

  chapterButtons.forEach((button) => {
    const target = Number(button.dataset.page);
    button.classList.toggle("active", target === chapterForPage(pageIndex));
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
    pageIndex += 1;
    updateBookUI();
  }
}
function previousPage() {
  if (pageIndex > 0) {
    pageIndex -= 1;
    updateBookUI();
  }
}

nextButton.addEventListener("click", nextPage);
previousButton.addEventListener("click", previousPage);

chapterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = Number(button.dataset.page);
    const chapterPages = [0, 2, 4, 6, 8, 10];
    pageIndex = Math.min(chapterPages[target] ?? target, sheets.length - 1);
    updateBookUI();
  });
});

// O botão da capa é reconstruído durante a montagem; delegação mantém o clique funcional.
book.addEventListener("click", (event) => {
  if (event.target.closest("#openBook")) nextPage();
  if (event.target.closest("#revealSurprise")) {
    const currentSurprise = event.target.closest(".face").querySelector("#surprise");
    if (!currentSurprise) return;
    currentSurprise.classList.toggle("show");
    const button = event.target.closest("#revealSurprise");
    button.textContent = currentSurprise.classList.contains("show")
      ? "Fechar surpresa ♡"
      : "Abrir minha surpresa ♡";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea, select")) return;
  if (event.key === "ArrowRight") nextPage();
  if (event.key === "ArrowLeft") previousPage();
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    window.setTimeout(() => petal.remove(), 15000);
  }, 1400);
}

updateBookUI();


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
