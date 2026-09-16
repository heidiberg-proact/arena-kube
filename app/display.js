console.log(
  "Arena Kube display.js lastet – tydelige utvisningsklokker"
);

const AUTO_CLEAR_MS = 7000;
const GOAL_AUTO_CLEAR_MS = 15000;

const SCOREBOARD_KEY =
  "arenaKubeScoreboard";

const BREAK_KEY =
  "arenaKubeBreakClock";

const PENALTY_CLOCKS_KEY =
  "arenaKubePenaltyClocks";

const TIMEOUT_KEY =
  "arenaKubeTimeout";

const channel =
  new BroadcastChannel(
    "arena-kube"
  );

const scenes =
  document.querySelectorAll(
    ".scene"
  );

let timeoutOverlay =
  null;

let timeoutOverlayLogo =
  null;

let timeoutOverlayTeamName =
  null;

let timeoutOverlayClock =
  null;


/* =========================================================
   KAMPFRONT / SCOREBOARD
========================================================= */

const frontHomeLogo =
  document.getElementById(
    "frontHomeLogo"
  );

const frontAwayLogo =
  document.getElementById(
    "frontAwayLogo"
  );

const frontHomeName =
  document.getElementById(
    "frontHomeName"
  );

const frontAwayName =
  document.getElementById(
    "frontAwayName"
  );

const frontMatchDate =
  document.getElementById(
    "frontMatchDate"
  );

const displayGameClock =
  document.getElementById(
    "displayGameClock"
  );

const displayHomeScore =
  document.getElementById(
    "displayHomeScore"
  );

const displayAwayScore =
  document.getElementById(
    "displayAwayScore"
  );

const displayPeriod =
  document.getElementById(
    "displayPeriod"
  );

const displayClockStatus =
  document.getElementById(
    "displayClockStatus"
  );


/* =========================================================
   PAUSEKLOKKE
========================================================= */

const breakClockOverlay =
  document.getElementById(
    "breakClockOverlay"
  );

const displayBreakClock =
  document.getElementById(
    "displayBreakClock"
  );


/* =========================================================
   HJEMMEMÅL
========================================================= */

const goalCelebrationLogo =
  document.getElementById(
    "goalCelebrationLogo"
  );

const goalHomeNumber =
  document.getElementById(
    "goalHomeNumber"
  );

const goalHomeName =
  document.getElementById(
    "goalHomeName"
  );

const goalAssist =
  document.getElementById(
    "goalAssist"
  );

const goalPlayerImage =
  document.getElementById(
    "goalPlayerImage"
  );

const goalPlayerVideo =
  document.getElementById(
    "goalPlayerVideo"
  );

const goalHomeGameClock = document.getElementById("goalHomeGameClock");
const goalHomeHomeScore = document.getElementById("goalHomeHomeScore");
const goalHomeAwayScore = document.getElementById("goalHomeAwayScore");
const goalHomePeriod = document.getElementById("goalHomePeriod");
const goalHomeClockStatus = document.getElementById("goalHomeClockStatus");
const goalHomeHomeName = document.getElementById("goalHomeHomeName");
const goalHomeAwayName = document.getElementById("goalHomeAwayName");
const goalHomeHomeLogo = document.getElementById("goalHomeHomeLogo");
const goalHomeAwayLogo = document.getElementById("goalHomeAwayLogo");
const goalHomePenaltyHome = document.getElementById("goalHomePenaltyHome");
const goalHomePenaltyAway = document.getElementById("goalHomePenaltyAway");


/* =========================================================
   BORTEMÅL
========================================================= */

const awayGoalLogo =
  document.getElementById(
    "awayGoalLogo"
  );

const awayGoalNumber =
  document.getElementById(
    "awayGoalNumber"
  );

const awayGoalScorerName =
  document.getElementById(
    "awayGoalScorerName"
  );

const awayGoalAssist =
  document.getElementById(
    "awayGoalAssist"
  );

const awayGoalTeam =
  document.getElementById(
    "awayGoalTeam"
  );


/* =========================================================
   UTVISNINGSSCENE
========================================================= */

const penaltyTeamLogo =
  document.getElementById(
    "penaltyTeamLogo"
  );

const penaltyPlayerNumber =
  document.getElementById(
    "penaltyPlayerNumber"
  );

const penaltyPlayerName =
  document.getElementById(
    "penaltyPlayerName"
  );

const penaltyTeamName =
  document.getElementById(
    "penaltyTeamName"
  );


/* =========================================================
   MELDING
========================================================= */

const messageText =
  document.getElementById(
    "messageText"
  );


/* =========================================================
   SPONSORER
========================================================= */

const sponsorLogoLayout =
  document.getElementById(
    "sponsorLogoLayout"
  );

const sponsorSlideLayout =
  document.getElementById(
    "sponsorSlideLayout"
  );

const sponsorImage =
  document.getElementById(
    "sponsorImage"
  );

const sponsorName =
  document.getElementById(
    "sponsorName"
  );

const sponsorCounter =
  document.getElementById(
    "sponsorCounter"
  );

const sponsorSlideImage =
  document.getElementById(
    "sponsorSlideImage"
  );

let sponsors = [];
let sponsorOrder = [];
let sponsorIndex = 0;
let sponsorTimer = null;


/* =========================================================
   BANENS BESTE
========================================================= */

const bestHomeTeamLogo =
  document.getElementById(
    "bestHomeTeamLogo"
  );

const bestHomeNumber =
  document.getElementById(
    "bestHomeNumber"
  );

const bestHomeName =
  document.getElementById(
    "bestHomeName"
  );

const bestHomeImage =
  document.getElementById(
    "bestHomeImage"
  );

const bestAwayLogo =
  document.getElementById(
    "bestAwayLogo"
  );

const bestAwayTeam =
  document.getElementById(
    "bestAwayTeam"
  );

const bestAwayNumber =
  document.getElementById(
    "bestAwayNumber"
  );


/* =========================================================
   LYD
========================================================= */

const bestPlayerAudio =
  document.getElementById(
    "bestPlayerAudio"
  );

const goalHomeAudio =
  document.getElementById(
    "goalHomeAudio"
  );

const penaltyAudio =
  document.getElementById(
    "penaltyAudio"
  );

const hornAudio =
  document.getElementById(
    "hornAudio"
  );

const entranceAudio =
  document.getElementById(
    "entranceAudio"
  );

const enableAudioButton =
  document.getElementById(
    "enableAudioButton"
  );

const defaultGoalHomeAudioSource =
  goalHomeAudio
    ? goalHomeAudio.src
    : "";

let audioEnabled = false;
let autoClearTimer = null;


/* =========================================================
   SCOREBOARD
========================================================= */

function defaultScoreboard() {
  return {
    elapsedMs: 0,
    running: false,
    startedAt: null,
    period: 1,
    periodLengthMinutes: 20,
    homeScore: 0,
    awayScore: 0
  };
}


function getScoreboard() {
  const stored =
    localStorage.getItem(
      SCOREBOARD_KEY
    );

  if (!stored) {
    return defaultScoreboard();
  }

  try {
    const data =
      JSON.parse(
        stored
      );

    return {
      elapsedMs:
        Math.max(
          0,
          Number(
            data.elapsedMs
          ) || 0
        ),

      running:
        Boolean(
          data.running
        ),

      startedAt:
        data.startedAt
          ? Number(
              data.startedAt
            )
          : null,

      period:
        [1, 2, 3].includes(
          Number(
            data.period
          )
        )
          ? Number(
              data.period
            )
          : 1,

      periodLengthMinutes:
        [15, 20].includes(
          Number(
            data.periodLengthMinutes
          )
        )
          ? Number(
              data.periodLengthMinutes
            )
          : 20,

      homeScore:
        Math.max(
          0,
          Number(
            data.homeScore
          ) || 0
        ),

      awayScore:
        Math.max(
          0,
          Number(
            data.awayScore
          ) || 0
        )
    };

  } catch (error) {
    console.error(
      "Kunne ikke lese scoreboard:",
      error
    );

    return defaultScoreboard();
  }
}


function getCurrentElapsed(
  state =
    getScoreboard()
) {
  if (
    !state.running ||
    !state.startedAt
  ) {
    return state.elapsedMs;
  }

  return Math.max(
    0,
    state.elapsedMs +
      (
        Date.now() -
        state.startedAt
      )
  );
}


function formatTime(
  milliseconds
) {
  const totalSeconds =
    Math.ceil(
      Math.max(
        0,
        milliseconds
      ) / 1000
    );

  const minutes =
    Math.floor(
      totalSeconds / 60
    );

  const seconds =
    totalSeconds % 60;

  return (
    String(
      minutes
    ).padStart(
      2,
      "0"
    ) +
    ":" +
    String(
      seconds
    ).padStart(
      2,
      "0"
    )
  );
}


function renderScoreboard() {
  const state =
    getScoreboard();

  if (
    displayGameClock
  ) {
    displayGameClock.textContent =
      formatTime(
        getCurrentElapsed(
          state
        )
      );
  }

  if (goalHomeGameClock) {
    goalHomeGameClock.textContent =
      formatTime(getCurrentElapsed(state));
  }

  if (
    displayHomeScore
  ) {
    displayHomeScore.textContent =
      state.homeScore;
  }

  if (goalHomeHomeScore) {
    goalHomeHomeScore.textContent = state.homeScore;
  }

  if (
    displayAwayScore
  ) {
    displayAwayScore.textContent =
      state.awayScore;
  }

  if (goalHomeAwayScore) {
    goalHomeAwayScore.textContent = state.awayScore;
  }

  if (
    displayPeriod
  ) {
    displayPeriod.textContent =
      `${state.period}. PERIODE`;
  }

  if (goalHomePeriod) {
    goalHomePeriod.textContent = `${state.period}. PERIODE`;
  }

  if (
    displayClockStatus
  ) {
    displayClockStatus.textContent =
      state.running
        ? "KLOKKEN GÅR"
        : "STOPPET";

    displayClockStatus.classList.toggle(
      "running",
      state.running
    );
  }

  if (goalHomeClockStatus) {
    goalHomeClockStatus.textContent =
      state.running ? "KLOKKEN GÅR" : "STOPPET";
  }
}


/* =========================================================
   DISPLAY-LAYOUT
   - FJERN KUBE ARENA
   - STØRRE HOVEDKLOKKE
   - HVITE KLOKKETALL
========================================================= */

function installDisplayLayoutEnhancements() {
  if (
    !document.getElementById(
      "arenaKubeDisplayLayoutStyles"
    )
  ) {
    const style =
      document.createElement(
        "style"
      );

    style.id =
      "arenaKubeDisplayLayoutStyles";

    style.textContent = `
      #displayGameClock {
        color: #ffffff !important;

        font-size: 7.6vw !important;
        line-height: .88 !important;
        font-weight: 1000 !important;

        letter-spacing: .01em !important;

        font-variant-numeric:
          tabular-nums !important;

        text-shadow:
          0 .18vw .45vw
          rgba(0, 0, 0, .9) !important;
      }

      @media (max-aspect-ratio: 4/3) {
        #displayGameClock {
          font-size: 9vw !important;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /*
    Fjerner bare elementer som faktisk
    inneholder nøyaktig KUBE ARENA /
    ARENA KUBE, slik at resten av
    scoreboardet ikke påvirkes.
  */
  document
    .querySelectorAll(
      "#idleScene *"
    )
    .forEach(
      (element) => {
        const text =
          (
            element.textContent ||
            ""
          )
            .trim()
            .replace(
              /\s+/g,
              " "
            )
            .toUpperCase();

        if (
          text ===
            "KUBE ARENA" ||
          text ===
            "ARENA KUBE"
        ) {
          element.style.display =
            "none";
        }
      }
    );
}


/* =========================================================
   PAUSEKLOKKE
========================================================= */

function getBreakState() {
  const stored =
    localStorage.getItem(
      BREAK_KEY
    );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(
      stored
    );

  } catch (error) {
    return null;
  }
}


function renderBreakClock() {
  const state =
    getBreakState();

  if (
    !state ||
    !state.running ||
    !state.endAt
  ) {
    if (
      breakClockOverlay
    ) {
      breakClockOverlay.hidden =
        true;
    }

    return;
  }

  const remaining =
    Math.max(
      0,
      Number(
        state.endAt
      ) -
      Date.now()
    );

  if (
    remaining <= 0
  ) {
    localStorage.removeItem(
      BREAK_KEY
    );

    if (
      breakClockOverlay
    ) {
      breakClockOverlay.hidden =
        true;
    }

    return;
  }

  if (
    breakClockOverlay
  ) {
    breakClockOverlay.hidden =
      false;
  }

  if (
    displayBreakClock
  ) {
    displayBreakClock.textContent =
      formatTime(
        remaining
      );
  }
}


/* =========================================================
   AKTIV KAMP
========================================================= */

function getStoredMatch() {
  const stored =
    localStorage.getItem(
      "arenaKubeActiveMatch"
    );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(
      stored
    );

  } catch (error) {
    console.error(
      "Kunne ikke lese aktiv kamp:",
      error
    );

    return null;
  }
}


function applyMatch(
  match
) {
  if (!match) {
    return;
  }

  if (
    frontHomeName
  ) {
    frontHomeName.textContent =
      match.homeTeam ||
      "ULL/KISA";
  }

  if (goalHomeHomeName) {
    goalHomeHomeName.textContent = match.homeTeam || "ULL/KISA";
  }

  if (
    frontAwayName
  ) {
    frontAwayName.textContent =
      match.awayTeam ||
      "BORTELAG";
  }

  if (goalHomeAwayName) {
    goalHomeAwayName.textContent = match.awayTeam || "BORTELAG";
  }

  if (
    frontMatchDate
  ) {
    frontMatchDate.textContent =
      match.date ||
      "";
  }

  if (
    match.homeLogo
  ) {
    if (
      frontHomeLogo
    ) {
      frontHomeLogo.src =
        match.homeLogo;
    }

    if (goalCelebrationLogo) {
      goalCelebrationLogo.src =
        match.homeLogo;
    }

    if (goalHomeHomeLogo) {
      goalHomeHomeLogo.src = match.homeLogo;
    }

    if (
      bestHomeTeamLogo
    ) {
      bestHomeTeamLogo.src =
        match.homeLogo;
    }
  }

  if (
    match.awayLogo
  ) {
    if (
      frontAwayLogo
    ) {
      frontAwayLogo.src =
        match.awayLogo;
    }

    if (goalHomeAwayLogo) {
      goalHomeAwayLogo.src = match.awayLogo;
    }

    if (
      bestAwayLogo
    ) {
      bestAwayLogo.src =
        match.awayLogo;
    }

    if (
      awayGoalLogo
    ) {
      awayGoalLogo.src =
        match.awayLogo;
    }
  }

  if (
    bestAwayTeam
  ) {
    bestAwayTeam.textContent =
      match.awayTeam ||
      "BORTELAG";
  }

  if (
    awayGoalTeam
  ) {
    awayGoalTeam.textContent =
      match.awayTeam ||
      "BORTELAG";
  }

  renderDisplayPenalties();
}


const storedMatch =
  getStoredMatch();

if (
  storedMatch
) {
  applyMatch(
    storedMatch
  );
}


/* =========================================================
   SPONSORER
========================================================= */

async function loadSponsors() {
  try {
    const response =
      await fetch(
        "../data/sponsors.json",
        {
          cache:
            "no-store"
        }
      );

    if (
      !response.ok
    ) {
      throw new Error(
        "Kunne ikke laste sponsors.json"
      );
    }

    const data =
      await response.json();

    if (
      !Array.isArray(
        data
      )
    ) {
      throw new Error(
        "sponsors.json må være en liste."
      );
    }

    sponsors = data;

  } catch (error) {
    console.error(
      "Kunne ikke laste sponsors.json:",
      error
    );

    sponsors = [];
  }
}


function stopSponsorCarousel() {
  if (
    sponsorTimer
  ) {
    clearTimeout(
      sponsorTimer
    );

    sponsorTimer = null;
  }

}


function shuffleSponsors(
  list
) {
  const shuffled =
    [...list];

  for (
    let index =
      shuffled.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          (index + 1)
      );

    [
      shuffled[index],
      shuffled[randomIndex]
    ] = [
      shuffled[randomIndex],
      shuffled[index]
    ];
  }

  return shuffled;
}


function showCurrentSponsor() {
  if (
    !sponsorLogoLayout ||
    !sponsorSlideLayout
  ) {
    return;
  }

  if (
    sponsors.length === 0
  ) {
    sponsorLogoLayout.style.display =
      "flex";

    sponsorSlideLayout.style.display =
      "none";

    if (
      sponsorImage
    ) {
      sponsorImage.style.display =
        "none";
    }

    if (
      sponsorName
    ) {
      sponsorName.textContent =
        "INGEN SPONSORER LASTET";
    }

    if (
      sponsorCounter
    ) {
      sponsorCounter.textContent =
        "";
    }

    return;
  }

  const activeSponsors =
    sponsorOrder.length
      ? sponsorOrder
      : sponsors;

  const sponsor =
    activeSponsors[
      sponsorIndex
    ];

  if (
    sponsor.type ===
    "slide"
  ) {
    sponsorLogoLayout.style.display =
      "none";

    sponsorSlideLayout.style.display =
      "flex";

    if (
      sponsorSlideImage
    ) {
      sponsorSlideImage.src =
        sponsor.image;
    }

  } else {
    sponsorLogoLayout.style.display =
      "flex";

    sponsorSlideLayout.style.display =
      "none";

    if (
      sponsorName
    ) {
      sponsorName.textContent =
        sponsor.name ||
        "Sponsor";
    }

    if (
      sponsorCounter
    ) {
      sponsorCounter.textContent =
        `${sponsorIndex + 1} / ${activeSponsors.length}`;
    }

    if (
      sponsorImage
    ) {
      if (
        sponsor.image
      ) {
        sponsorImage.src =
          sponsor.image;

        sponsorImage.style.display =
          "block";

      } else {
        sponsorImage.style.display =
          "none";
      }
    }
  }

  let duration =
    Number(
      sponsor.duration
    );

  if (
    !duration ||
    duration < 1
  ) {
    duration = 8;
  }

  sponsorTimer =
    setTimeout(
      () => {
        sponsorIndex +=
          1;

        if (
          sponsorIndex >=
            activeSponsors.length
        ) {
          const previousSponsor =
            activeSponsors[
              activeSponsors.length - 1
            ];

          sponsorOrder =
            shuffleSponsors(
              sponsors
            );

          if (
            sponsorOrder.length > 1 &&
            sponsorOrder[0] ===
              previousSponsor
          ) {
            [
              sponsorOrder[0],
              sponsorOrder[1]
            ] = [
              sponsorOrder[1],
              sponsorOrder[0]
            ];
          }

          sponsorIndex =
            0;
        }

        showCurrentSponsor();
      },
      duration * 1000
    );
}


function startSponsorCarousel() {
  stopSponsorCarousel();

  sponsorOrder =
    shuffleSponsors(
      sponsors
    );

  sponsorIndex = 0;

  showCurrentSponsor();
}


/* =========================================================
   MÅLMEDIA
========================================================= */

function stopGoalMedia() {
  if (
    !goalPlayerVideo
  ) {
    return;
  }

  goalPlayerVideo.onerror =
    null;

  goalPlayerVideo.pause();

  try {
    goalPlayerVideo.currentTime =
      0;
  } catch (error) {}

  goalPlayerVideo.removeAttribute(
    "src"
  );

  goalPlayerVideo.style.display =
    "none";
}


function finishHomeGoalPresentation() {
  clearTimeout(
    autoClearTimer
  );

  stopAllAudio();
  stopGoalMedia();

  showScene(
    "idleScene"
  );

  renderDisplayPenalties();

  channel.postMessage({
    type:
      "goalHomeFinished"
  });
}


function finishGoalCelebration() {
  clearTimeout(
    autoClearTimer
  );

  stopAllAudio();

  showScene(
    "idleScene"
  );

  renderDisplayPenalties();

  channel.postMessage({
    type:
      "goalCelebrationFinished"
  });
}


if (
  goalPlayerVideo
) {
  goalPlayerVideo.addEventListener(
    "ended",
    finishHomeGoalPresentation
  );
}


if (
  goalHomeAudio
) {
  goalHomeAudio.addEventListener(
    "ended",
    () => {
      if (
        document
          .getElementById(
            "goalCelebrationScene"
          )
          ?.classList.contains(
            "active"
          )
      ) {
        finishGoalCelebration();

        return;
      }
    }
  );
}


function showGoalImage(
  scorer
) {
  stopGoalMedia();

  if (
    !goalPlayerImage
  ) {
    return;
  }

  if (
    scorer.image
  ) {
    goalPlayerImage.src =
      scorer.image;

    goalPlayerImage.alt =
      scorer.name ||
      "Målscorer";

    goalPlayerImage.style.display =
      "block";

  } else {
    goalPlayerImage.style.display =
      "none";
  }
}


function showGoalMedia(
  scorer
) {
  if (
    goalPlayerImage
  ) {
    goalPlayerImage.style.display =
      "none";
  }

  stopGoalMedia();

  if (
    scorer.goalVideo &&
    goalPlayerVideo
  ) {
    goalPlayerVideo.src =
      scorer.goalVideo;

    goalPlayerVideo.style.display =
      "block";

    goalPlayerVideo.onerror =
      () => {
        showGoalImage(
          scorer
        );
      };

    goalPlayerVideo
      .play()
      .catch(
        () => {
          showGoalImage(
            scorer
          );
        }
      );

  } else {
    showGoalImage(
      scorer
    );
  }
}


/* =========================================================
   SCENER
========================================================= */

function showScene(
  id
) {
  if (
    id !==
    "goalHomeScene"
  ) {
    stopGoalMedia();
  }

  scenes.forEach(
    (scene) => {
      scene.classList.remove(
        "active"
      );
    }
  );

  const scene =
    document.getElementById(
      id
    );

  if (
    scene
  ) {
    scene.classList.add(
      "active"
    );
  }
}


function autoClear(
  delay =
    AUTO_CLEAR_MS
) {
  clearTimeout(
    autoClearTimer
  );

  autoClearTimer =
    setTimeout(
      () => {
        showScene(
          "idleScene"
        );

        renderDisplayPenalties();
      },
      delay
    );
}


/* =========================================================
   LYD
========================================================= */

function stopAudioTrack(
  audio
) {
  if (!audio) {
    return;
  }

  audio.pause();

  try {
    audio.currentTime =
      0;
  } catch (error) {}
}


function stopAllAudio() {
  stopAudioTrack(
    bestPlayerAudio
  );

  stopAudioTrack(
    goalHomeAudio
  );

  stopAudioTrack(
    penaltyAudio
  );

  stopAudioTrack(
    hornAudio
  );

  stopAudioTrack(
    entranceAudio
  );
}


/* =========================================================
   TIMEOUT – FULLSKJERM
========================================================= */

function getArenaTimeoutState() {
  const stored =
    localStorage.getItem(
      TIMEOUT_KEY
    );

  if (!stored) {
    return null;
  }

  try {
    const state =
      JSON.parse(
        stored
      );

    if (
      !state ||
      !state.active ||
      !["home", "away"].includes(
        state.team
      ) ||
      !Number(state.endAt)
    ) {
      return null;
    }

    return state;
  } catch (error) {
    console.error(
      "Kunne ikke lese timeout:",
      error
    );

    return null;
  }
}


function installArenaTimeoutOverlay() {
  if (
    document.getElementById(
      "arenaKubeTimeoutOverlay"
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "arenaKubeTimeoutStyles";

  style.textContent = `
    #arenaKubeTimeoutOverlay {
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 5vh 5vw;
      overflow: hidden;
      background:
        radial-gradient(circle at center, rgba(20, 69, 39, 0.98) 0%, rgba(3, 22, 11, 1) 72%);
      color: white;
      text-align: center;
    }

    #arenaKubeTimeoutOverlay[hidden] {
      display: none !important;
    }

    .arena-kube-timeout-display-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .arena-kube-timeout-display-title {
      color: #f4d000;
      font-size: clamp(64px, 10vw, 190px);
      line-height: 0.9;
      font-weight: 1000;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-shadow: 0 0 28px rgba(244, 208, 0, 0.35);
    }

    .arena-kube-timeout-display-logo {
      display: block;
      width: min(28vw, 360px);
      height: min(28vh, 300px);
      margin: 3vh 0 1.5vh;
      object-fit: contain;
    }

    .arena-kube-timeout-display-logo.no-logo {
      display: none;
    }

    .arena-kube-timeout-display-team {
      max-width: 90vw;
      overflow: hidden;
      font-size: clamp(36px, 5vw, 88px);
      line-height: 1;
      font-weight: 900;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .arena-kube-timeout-display-clock {
      margin-top: 1.5vh;
      color: white;
      font-size: clamp(110px, 22vw, 390px);
      line-height: 0.88;
      font-weight: 1000;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.05em;
      text-shadow: 0 0 34px rgba(255, 255, 255, 0.18);
    }
  `;

  document.head.appendChild(
    style
  );

  timeoutOverlay =
    document.createElement(
      "div"
    );

  timeoutOverlay.id =
    "arenaKubeTimeoutOverlay";

  timeoutOverlay.hidden =
    true;

  timeoutOverlay.innerHTML = `
    <div class="arena-kube-timeout-display-content">
      <div class="arena-kube-timeout-display-title">TIMEOUT</div>
      <img class="arena-kube-timeout-display-logo no-logo" alt="">
      <div class="arena-kube-timeout-display-team"></div>
      <div class="arena-kube-timeout-display-clock">00:30</div>
    </div>
  `;

  document.body.appendChild(
    timeoutOverlay
  );

  timeoutOverlayLogo =
    timeoutOverlay.querySelector(
      ".arena-kube-timeout-display-logo"
    );

  timeoutOverlayTeamName =
    timeoutOverlay.querySelector(
      ".arena-kube-timeout-display-team"
    );

  timeoutOverlayClock =
    timeoutOverlay.querySelector(
      ".arena-kube-timeout-display-clock"
    );
}


function finishArenaTimeout(
  notifyOperator = true
) {
  const hadTimeout =
    Boolean(
      localStorage.getItem(
        TIMEOUT_KEY
      )
    );

  localStorage.removeItem(
    TIMEOUT_KEY
  );

  if (
    timeoutOverlay
  ) {
    timeoutOverlay.hidden =
      true;
  }

  showScene(
    "idleScene"
  );

  renderDisplayPenalties();

  if (
    notifyOperator &&
    hadTimeout
  ) {
    channel.postMessage({
      type: "timeoutFinished"
    });
  }
}


function renderArenaTimeoutOverlay() {
  if (
    !timeoutOverlay
  ) {
    return;
  }

  const state =
    getArenaTimeoutState();

  if (!state) {
    timeoutOverlay.hidden =
      true;

    return;
  }

  const remaining =
    Math.max(
      0,
      Number(state.endAt) -
        Date.now()
    );

  if (
    remaining <= 0
  ) {
    finishArenaTimeout();
    return;
  }

  const match =
    getStoredMatch();

  const teamName =
    state.teamName ||
    (
      state.team === "home"
        ? match &&
          match.homeTeam
        : match &&
          match.awayTeam
    ) ||
    (
      state.team === "home"
        ? "HJEMMELAG"
        : "BORTELAG"
    );

  const teamLogo =
    state.teamLogo ||
    (
      state.team === "home"
        ? match &&
          match.homeLogo
        : match &&
          match.awayLogo
    ) ||
    "";

  timeoutOverlayTeamName.textContent =
    teamName;

  timeoutOverlayClock.textContent =
    formatTime(
      remaining
    );

  if (
    teamLogo
  ) {
    timeoutOverlayLogo.src =
      teamLogo;

    timeoutOverlayLogo.alt =
      `${teamName} logo`;

    timeoutOverlayLogo.classList.remove(
      "no-logo"
    );
  } else {
    timeoutOverlayLogo.removeAttribute(
      "src"
    );

    timeoutOverlayLogo.alt =
      "";

    timeoutOverlayLogo.classList.add(
      "no-logo"
    );
  }

  timeoutOverlay.hidden =
    false;
}


function playAudioTrack(
  audio
) {
  if (
    !audio ||
    !audioEnabled
  ) {
    return;
  }

  stopAudioTrack(
    audio
  );

  audio
    .play()
    .catch(
      (error) => {
        console.error(
          "Kunne ikke spille lyd:",
          error
        );
      }
    );
}


function playExclusiveAudio(
  audio
) {
  stopAllAudio();

  playAudioTrack(
    audio
  );
}


/* =========================================================
   INDIVIDUELL MÅLMUSIKK
========================================================= */

function setHomeGoalAudioSource(
  source
) {
  if (
    !goalHomeAudio ||
    !source
  ) {
    return;
  }

  const absoluteSource =
    new URL(
      source,
      window.location.href
    ).href;

  if (
    goalHomeAudio.src !==
    absoluteSource
  ) {
    goalHomeAudio.src =
      source;

    goalHomeAudio.load();
  }
}


function playHomeGoalAudio(
  scorer
) {
  stopAllAudio();

  if (
    !goalHomeAudio ||
    !audioEnabled
  ) {
    return;
  }

  const playerGoalMusic =
    scorer &&
    typeof scorer.goalMusic ===
      "string"
      ? scorer.goalMusic.trim()
      : "";

  const playFallback =
    () => {
      goalHomeAudio.onerror =
        null;

      stopAudioTrack(
        goalHomeAudio
      );

      if (
        defaultGoalHomeAudioSource
      ) {
        setHomeGoalAudioSource(
          defaultGoalHomeAudioSource
        );

        playAudioTrack(
          goalHomeAudio
        );
      }
    };

  if (
    !playerGoalMusic
  ) {
    playFallback();
    return;
  }

  let fallbackStarted =
    false;

  const fallbackOnce =
    () => {
      if (
        fallbackStarted
      ) {
        return;
      }

      fallbackStarted =
        true;

      playFallback();
    };

  goalHomeAudio.onerror =
    fallbackOnce;

  setHomeGoalAudioSource(
    playerGoalMusic
  );

  stopAudioTrack(
    goalHomeAudio
  );

  goalHomeAudio
    .play()
    .catch(
      fallbackOnce
    );
}


/* =========================================================
   AKTIVER / TEST LYD
========================================================= */

async function unlockAudio(
  audio
) {
  if (!audio) {
    throw new Error(
      "Lydressurs mangler."
    );
  }

  const oldVolume =
    audio.volume;

  audio.volume =
    0;

  try {
    await audio.play();

    audio.pause();

    audio.currentTime =
      0;

  } finally {
    audio.volume =
      oldVolume;
  }
}


function markAudioEnabled() {
  audioEnabled =
    true;

  if (
    enableAudioButton
  ) {
    enableAudioButton.textContent =
      "✓ LYD AKTIVERT";

    enableAudioButton.classList.add(
      "audio-active"
    );

    enableAudioButton.style.display =
      "none";
  }
}


async function activateAllAudio() {
  if (
    audioEnabled
  ) {
    return {
      ok: true,
      alreadyEnabled: true
    };
  }

  if (
    goalHomeAudio &&
    defaultGoalHomeAudioSource
  ) {
    setHomeGoalAudioSource(
      defaultGoalHomeAudioSource
    );
  }

  await unlockAudio(
    bestPlayerAudio
  );

  await unlockAudio(
    goalHomeAudio
  );

  await unlockAudio(
    penaltyAudio
  );

  await unlockAudio(
    hornAudio
  );

  await unlockAudio(
    entranceAudio
  );

  markAudioEnabled();

  return {
    ok: true,
    alreadyEnabled: false
  };
}


if (
  enableAudioButton
) {
  enableAudioButton.addEventListener(
    "click",
    async () => {
      try {
        await activateAllAudio();

      } catch (error) {
        console.error(
          "Kunne ikke aktivere lyd:",
          error
        );

        enableAudioButton.textContent =
          "LYD KUNNE IKKE AKTIVERES";
      }
    }
  );
}


/* =========================================================
   UTVISNINGSSCENE – STRAFFETID
========================================================= */

function installPenaltyPresentationEnhancement() {
  const card =
    document.querySelector(
      "#penaltyScene .penalty-card"
    );

  if (!card) {
    return;
  }

  if (
    !document.getElementById(
      "penaltyDurationDisplay"
    )
  ) {
    const duration =
      document.createElement(
        "div"
      );

    duration.id =
      "penaltyDurationDisplay";

    duration.textContent =
      "2 MINUTTER";

    card.appendChild(
      duration
    );
  }

  if (
    !document.getElementById(
      "arenaKubePenaltyPresentationStyles"
    )
  ) {
    const style =
      document.createElement(
        "style"
      );

    style.id =
      "arenaKubePenaltyPresentationStyles";

    style.textContent = `
      #penaltyDurationDisplay {
        margin-top: 1.2vh;
        padding: .65vh 1.5vw;
        display: inline-block;

        color: #111;
        background: #ffd600;

        border-radius: .4vw;

        font-size: 2vw;
        line-height: 1;
        font-weight: 900;

        text-transform: uppercase;
        letter-spacing: .08em;

        box-shadow:
          0 .3vw .8vw rgba(0,0,0,.35);
      }

      #penaltyScene .penalty-title {
        color: #ffd600;

        text-shadow:
          0 .2vw .4vw
          rgba(0,0,0,.8);
      }
    `;

    document.head.appendChild(
      style
    );
  }
}


function showPenaltyPresentation(
  team,
  player,
  durationMinutes,
  match =
    getStoredMatch()
) {
  if (
    !player ||
    !match
  ) {
    return;
  }

  stopSponsorCarousel();

  clearTimeout(
    autoClearTimer
  );

  stopAllAudio();

  stopGoalMedia();

  if (
    penaltyPlayerNumber
  ) {
    penaltyPlayerNumber.textContent =
      player.number ||
      "";
  }

  if (
    penaltyPlayerName
  ) {
    if (
      player.name
    ) {
      penaltyPlayerName.textContent =
        player.name;

      penaltyPlayerName.style.display =
        "block";

    } else {
      penaltyPlayerName.textContent =
        "";

      penaltyPlayerName.style.display =
        "none";
    }
  }

  if (
    team ===
    "home"
  ) {
    if (
      penaltyTeamName
    ) {
      penaltyTeamName.textContent =
        match.homeTeam ||
        "ULL/KISA";
    }

    if (
      penaltyTeamLogo
    ) {
      penaltyTeamLogo.src =
        match.homeLogo ||
        "../images/teams/ullkisa.png";
    }

  } else {
    if (
      penaltyTeamName
    ) {
      penaltyTeamName.textContent =
        match.awayTeam ||
        "BORTELAG";
    }

    if (
      penaltyTeamLogo
    ) {
      penaltyTeamLogo.src =
        match.awayLogo ||
        "../images/teams/away.png";
    }
  }

  const duration =
    document.getElementById(
      "penaltyDurationDisplay"
    );

  if (
    duration
  ) {
    duration.textContent =
      `${Number(
        durationMinutes
      ) || 2} MINUTTER`;
  }

  showScene(
    "penaltyScene"
  );

  playExclusiveAudio(
    penaltyAudio
  );

  autoClear();
}


/* =========================================================
   STORE UTVISNINGSKLOKKER VED RESULTAT
========================================================= */

function installDisplayPenaltyBoard() {
  if (
    document.getElementById(
      "displayPenaltyHomeBoard"
    ) ||
    document.getElementById(
      "displayPenaltyAwayBoard"
    )
  ) {
    return;
  }

  const homeScoreArea =
    displayHomeScore
      ? displayHomeScore.parentElement
      : null;

  const awayScoreArea =
    displayAwayScore
      ? displayAwayScore.parentElement
      : null;

  if (
    !homeScoreArea ||
    !awayScoreArea
  ) {
    console.warn(
      "Fant ikke hjemme/borte-resultat for utvisningsvisning."
    );

    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "arenaKubeDisplayPenaltyStyles";

  style.textContent = `
    .display-team-penalties {
      width: 100%;
      max-width: 21vw;
      margin-top: .7vw;

      display: flex;
      flex-direction: column;
      gap: .45vw;

      box-sizing: border-box;
    }

    .display-team-penalties.home {
      margin-right: auto;
      align-items: flex-start;
    }

    .display-team-penalties.away {
      margin-left: auto;
      align-items: flex-end;
    }

    .display-team-penalties[hidden] {
      display: none !important;
    }

    .display-penalty-item {
      display: grid;

      grid-template-columns:
        minmax(0, 1fr)
        auto;

      align-items: center;

      gap: 1vw;

      width: 100%;

      box-sizing: border-box;

      padding:
        .65vw
        .8vw;

      border:
        .13vw solid
        #ffd600;

      border-radius:
        .4vw;

      background:
        rgba(3, 15, 7, .96);

      box-shadow:
        0 .25vw .8vw
        rgba(0, 0, 0, .55);
    }

    .display-penalty-info {
      min-width: 0;

      overflow: hidden;
    }

    .display-penalty-player-number {
      color: #fff;

      font-size: 1.35vw;
      line-height: 1;

      font-weight: 1000;

      white-space: nowrap;

      text-shadow:
        0 .12vw .25vw
        rgba(0,0,0,.8);
    }

    .display-penalty-player-name {
      margin-top: .25vw;

      overflow: hidden;

      color: #fff;

      font-size: .9vw;
      line-height: 1.05;

      font-weight: 850;

      text-overflow: ellipsis;
      white-space: nowrap;

      text-transform: uppercase;
    }

    .display-penalty-duration {
      margin-top: .32vw;

      color: #d5ddd7;

      font-size: .65vw;
      line-height: 1;

      font-weight: 800;

      text-transform: uppercase;

      letter-spacing: .04em;
    }

    .display-penalty-time {
      color: #ffd600;

      font-size: 2.25vw;
      line-height: .9;

      font-weight: 1000;

      font-variant-numeric:
        tabular-nums;

      white-space: nowrap;

      text-shadow:
        0 .15vw .35vw
        rgba(0,0,0,.9);
    }

    @media (max-aspect-ratio: 4/3) {
      .display-team-penalties {
        max-width: 26vw;
      }

      .display-penalty-player-number {
        font-size: 1.65vw;
      }

      .display-penalty-player-name {
        font-size: 1.05vw;
      }

      .display-penalty-duration {
        font-size: .8vw;
      }

      .display-penalty-time {
        font-size: 2.7vw;
      }
    }
  `;

  document.head.appendChild(
    style
  );

  const homeBoard =
    document.createElement(
      "div"
    );

  homeBoard.id =
    "displayPenaltyHomeBoard";

  homeBoard.className =
    "display-team-penalties home";

  homeBoard.hidden =
    true;

  const awayBoard =
    document.createElement(
      "div"
    );

  awayBoard.id =
    "displayPenaltyAwayBoard";

  awayBoard.className =
    "display-team-penalties away";

  awayBoard.hidden =
    true;

  homeScoreArea.appendChild(
    homeBoard
  );

  awayScoreArea.appendChild(
    awayBoard
  );
}


function getPenaltyClockState() {
  const stored =
    localStorage.getItem(
      PENALTY_CLOCKS_KEY
    );

  if (!stored) {
    return {
      home: [],
      away: []
    };
  }

  try {
    const data =
      JSON.parse(
        stored
      );

    return {
      home:
        Array.isArray(
          data.home
        )
          ? data.home
          : [],

      away:
        Array.isArray(
          data.away
        )
          ? data.away
          : []
    };

  } catch (error) {
    return {
      home: [],
      away: []
    };
  }
}


function getDisplayPenaltyRemaining(
  slot,
  scoreboardState
) {
  if (
    !slot ||
    !slot.active
  ) {
    return 0;
  }

  let remaining =
    Math.max(
      0,
      Number(
        slot.remainingMs
      ) || 0
    );

  if (
    scoreboardState.running &&
    slot.lastUpdatedAt
  ) {
    remaining -=
      Math.max(
        0,
        Date.now() -
        Number(
          slot.lastUpdatedAt
        )
      );
  }

  return Math.max(
    0,
    remaining
  );
}


function createDisplayPenaltyItem(
  slot,
  remaining
) {
  const item =
    document.createElement(
      "div"
    );

  item.className =
    "display-penalty-item";

  const info =
    document.createElement(
      "div"
    );

  info.className =
    "display-penalty-info";


  const playerNumber =
    document.createElement(
      "div"
    );

  playerNumber.className =
    "display-penalty-player-number";

  playerNumber.textContent =
    slot.playerNumber
      ? `#${slot.playerNumber}`
      : "UTV.";


  const playerName =
    document.createElement(
      "div"
    );

  playerName.className =
    "display-penalty-player-name";

  if (
    slot.playerName
  ) {
    playerName.textContent =
      slot.playerName;

    playerName.style.display =
      "block";

  } else {
    playerName.textContent =
      "";

    playerName.style.display =
      "none";
  }


  const duration =
    document.createElement(
      "div"
    );

  duration.className =
    "display-penalty-duration";

  duration.textContent =
    `${Number(
      slot.durationMinutes
    ) || 2} MIN UTVISNING`;


  const time =
    document.createElement(
      "div"
    );

  time.className =
    "display-penalty-time";

  time.textContent =
    formatTime(
      remaining
    );


  info.appendChild(
    playerNumber
  );

  info.appendChild(
    playerName
  );

  info.appendChild(
    duration
  );

  item.appendChild(
    info
  );

  item.appendChild(
    time
  );

  return item;
}


function renderPenaltyTeam(
  target,
  slots,
  scoreboardState
) {
  if (!target) {
    return;
  }

  target.innerHTML =
    "";

  slots.forEach(
    (slot) => {
      if (
        !slot ||
        !slot.active
      ) {
        return;
      }

      const remaining =
        getDisplayPenaltyRemaining(
          slot,
          scoreboardState
        );

      if (
        remaining <= 0
      ) {
        return;
      }

      target.appendChild(
        createDisplayPenaltyItem(
          slot,
          remaining
        )
      );
    }
  );

  target.hidden =
    target.children.length ===
    0;
}


function renderDisplayPenalties() {
  const homeBoard =
    document.getElementById(
      "displayPenaltyHomeBoard"
    );

  const awayBoard =
    document.getElementById(
      "displayPenaltyAwayBoard"
    );

  if (
    !homeBoard ||
    !awayBoard
  ) {
    return;
  }

  const state =
    getPenaltyClockState();

  const scoreboardState =
    getScoreboard();

  renderPenaltyTeam(
    homeBoard,
    state.home,
    scoreboardState
  );

  renderPenaltyTeam(
    awayBoard,
    state.away,
    scoreboardState
  );

  renderPenaltyTeam(
    goalHomePenaltyHome,
    state.home,
    scoreboardState
  );

  renderPenaltyTeam(
    goalHomePenaltyAway,
    state.away,
    scoreboardState
  );
}


/* =========================================================
   FINN NYSTARTET UTVISNING
========================================================= */

function findNewPenalty(
  previousState,
  nextState
) {
  for (
    const team of
      ["home", "away"]
  ) {
    const oldSlots =
      Array.isArray(
        previousState[
          team
        ]
      )
        ? previousState[
            team
          ]
        : [];

    const newSlots =
      Array.isArray(
        nextState[
          team
        ]
      )
        ? nextState[
            team
          ]
        : [];

    for (
      let index = 0;
      index <
      newSlots.length;
      index++
    ) {
      const before =
        oldSlots[
          index
        ];

      const after =
        newSlots[
          index
        ];

      if (
        !after ||
        !after.active
      ) {
        continue;
      }

      /*
        UTVISNINGSSCENE OG LYD SKAL KUN
        KOMME NÅR SLOTEN GÅR FRA
        INAKTIV TIL AKTIV.

        HOVEDKLOKKE START/STOPP SKAL IKKE
        UTLØSE PENALTY-LYD.
      */
      const wasInactive =
        !before ||
        !before.active;

      if (
        wasInactive
      ) {
        return {
          team,
          slot: after
        };
      }
    }
  }

  return null;
}


/* =========================================================
   MELDINGER FRA OPERATOR
========================================================= */

channel.addEventListener(
  "message",
  async (event) => {
    const data =
      event.data;

    if (
      !data ||
      !data.type
    ) {
      return;
    }

    switch (
      data.type
    ) {

      case "preflightPing":

        channel.postMessage({
          type:
            "preflightPong",

          receivedAt:
            Date.now()
        });

        break;


      case "preflightAudioTest": {

        const alreadyEnabled =
          audioEnabled;

        try {
          await activateAllAudio();

          channel.postMessage({
            type:
              "preflightAudioResult",

            requestId:
              data.requestId,

            ok:
              true,

            alreadyEnabled,

            message:
              alreadyEnabled
                ? "Lyd allerede aktiv"
                : "Lyd aktivert"
          });

        } catch (error) {
          console.warn(
            "Preflight kunne ikke aktivere display-lyd:",
            error
          );

          channel.postMessage({
            type:
              "preflightAudioResult",

            requestId:
              data.requestId,

            ok:
              false,

            alreadyEnabled:
              false,

            message:
              "Aktiver lyd manuelt på display"
          });
        }

        break;
      }


      case "scoreboardUpdate":

        renderScoreboard();

        renderDisplayPenalties();

        break;


      case "penaltyClockUpdate": {

        const previousState =
          getPenaltyClockState();

        const nextState =
          data.penalties || {
            home: [],
            away: []
          };

        const newPenalty =
          findNewPenalty(
            previousState,
            nextState
          );

        localStorage.setItem(
          PENALTY_CLOCKS_KEY,
          JSON.stringify(
            nextState
          )
        );

        renderDisplayPenalties();

        if (
          newPenalty
        ) {
          showPenaltyPresentation(
            newPenalty.team,
            {
              number:
                newPenalty.slot
                  .playerNumber,

              name:
                newPenalty.slot
                  .playerName
            },
            newPenalty.slot
              .durationMinutes,
            getStoredMatch()
          );
        }

        break;
      }


      case "breakStarted":

        if (
          data.endAt
        ) {
          localStorage.setItem(
            BREAK_KEY,
            JSON.stringify({
              running:
                true,

              endAt:
                Number(
                  data.endAt
                )
            })
          );
        }

        renderBreakClock();

        break;


      case "breakStopped":

        localStorage.removeItem(
          BREAK_KEY
        );

        renderBreakClock();

        break;


      case "timeoutStateUpdate":

        if (
          data.timeout
        ) {
          localStorage.setItem(
            TIMEOUT_KEY,
            JSON.stringify(
              data.timeout
            )
          );
        }

        renderArenaTimeoutOverlay();

        break;


      case "timeoutStopped":

        finishArenaTimeout(
          false
        );

        break;


      case "periodEnded":

        playExclusiveAudio(
          hornAudio
        );

        renderDisplayPenalties();

        break;


      case "matchUpdate":

        stopSponsorCarousel();

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();

        stopGoalMedia();

        applyMatch(
          data.match
        );

        localStorage.setItem(
          "arenaKubeActiveMatch",
          JSON.stringify(
            data.match
          )
        );

        showScene(
          "idleScene"
        );

        renderDisplayPenalties();

        break;


      case "goalHomeStart":

        stopSponsorCarousel();

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();
        stopGoalMedia();

        if (
          data.match
        ) {
          applyMatch(
            data.match
          );
        }

        showScene(
          "goalCelebrationScene"
        );

        playHomeGoalAudio(
          null
        );

        break;


      case "goalCelebrationStart":

        stopSponsorCarousel();

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();
        stopGoalMedia();

        if (
          data.match
        ) {
          applyMatch(
            data.match
          );
        }

        showScene(
          "goalCelebrationScene"
        );

        playHomeGoalAudio(
          null
        );

        break;


      case "goalCelebrationStop":

        finishGoalCelebration();

        break;


      case "goalHomeStop":

        finishHomeGoalPresentation();

        break;


      case "goalHome":

        stopSponsorCarousel();

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();

        if (
          !data.scorer
        ) {
          break;
        }

        if (
          goalHomeNumber
        ) {
          goalHomeNumber.textContent =
            data.scorer.number;
        }

        if (
          goalHomeName
        ) {
          goalHomeName.textContent =
            data.scorer.name ||
            "";
        }

        if (
          goalAssist
        ) {
          if (
            data.assist
          ) {
            goalAssist.textContent =
              `ASSIST: #${data.assist.number} ${data.assist.name}`;

            goalAssist.style.display =
              "block";

          } else {
            goalAssist.textContent =
              "";

            goalAssist.style.display =
              "none";
          }
        }

        showScene(
          "goalHomeScene"
        );

        showGoalMedia(
          data.scorer
        );

        autoClear(
          GOAL_AUTO_CLEAR_MS
        );

        break;


      case "goalAway":

        stopSponsorCarousel();

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();

        stopGoalMedia();

        if (
          data.match
        ) {
          applyMatch(
            data.match
          );
        }

        if (
          !data.scorer
        ) {
          break;
        }

        if (
          awayGoalNumber
        ) {
          awayGoalNumber.textContent =
            data.scorer.number;
        }

        if (
          awayGoalScorerName
        ) {
          if (
            data.scorer.name
          ) {
            awayGoalScorerName.textContent =
              data.scorer.name;

            awayGoalScorerName.style.display =
              "block";

          } else {
            awayGoalScorerName.textContent =
              "";

            awayGoalScorerName.style.display =
              "none";
          }
        }

        if (
          awayGoalAssist
        ) {
          if (
            data.assist
          ) {
            const parts =
              [];

            if (
              data.assist.number
            ) {
              parts.push(
                "#" +
                data.assist.number
              );
            }

            if (
              data.assist.name
            ) {
              parts.push(
                data.assist.name
              );
            }

            if (
              parts.length > 0
            ) {
              awayGoalAssist.textContent =
                "ASSIST: " +
                parts.join(
                  " "
                );

              awayGoalAssist.style.display =
                "block";

            } else {
              awayGoalAssist.style.display =
                "none";
            }

          } else {
            awayGoalAssist.style.display =
              "none";
          }
        }

        showScene(
          "goalAwayScene"
        );

        autoClear(
          GOAL_AUTO_CLEAR_MS
        );

        break;


      case "penalty":

        if (
          !data.player ||
          !data.match
        ) {
          break;
        }

        showPenaltyPresentation(
          data.team,
          data.player,
          data.durationMinutes ||
            2,
          data.match
        );

        break;


      case "bestPlayerHome":

        stopSponsorCarousel();

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();

        stopGoalMedia();

        if (
          !data.player
        ) {
          break;
        }

        if (
          bestHomeNumber
        ) {
          bestHomeNumber.textContent =
            data.player.number;
        }

        if (
          bestHomeName
        ) {
          bestHomeName.textContent =
            data.player.name ||
            "Spiller";
        }

        if (
          bestHomeImage
        ) {
          if (
            data.player.image
          ) {
            bestHomeImage.src =
              data.player.image;

            bestHomeImage.style.display =
              "block";

          } else {
            bestHomeImage.style.display =
              "none";
          }
        }

        showScene(
          "bestHomeScene"
        );

        playExclusiveAudio(
          bestPlayerAudio
        );

        break;


      case "bestPlayerAway":

        stopSponsorCarousel();

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();

        stopGoalMedia();

        if (
          data.match
        ) {
          applyMatch(
            data.match
          );
        }

        if (
          bestAwayNumber
        ) {
          bestAwayNumber.textContent =
            data.number;
        }

        showScene(
          "bestAwayScene"
        );

        break;


      case "stopAudio":

        stopAllAudio();

        break;


      case "game":

        stopSponsorCarousel();

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();

        stopGoalMedia();

        if (
          data.match
        ) {
          applyMatch(
            data.match
          );
        }

        showScene(
          "idleScene"
        );

        renderDisplayPenalties();

        break;


      case "sponsors":

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();

        stopGoalMedia();

        showScene(
          "sponsorScene"
        );

        startSponsorCarousel();

        break;


      case "message":

        stopSponsorCarousel();

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();

        stopGoalMedia();

        if (
          messageText
        ) {
          messageText.textContent =
            data.text;
        }

        showScene(
          "messageScene"
        );

        autoClear();

        break;


      case "clear":

        stopSponsorCarousel();

        clearTimeout(
          autoClearTimer
        );

        stopAllAudio();

        stopGoalMedia();

        showScene(
          "idleScene"
        );

        renderDisplayPenalties();

        break;


      default:

        /*
          Innmarsj håndteres av
          eksisterende inline-script
          i display.html.
        */

        break;
    }
  }
);


window.addEventListener(
  "storage",
  (event) => {
    if (
      event.key ===
      TIMEOUT_KEY
    ) {
      renderArenaTimeoutOverlay();
    }
  }
);


/* =========================================================
   LØPENDE OPPDATERING
========================================================= */

setInterval(
  () => {
    renderScoreboard();

    renderBreakClock();

    renderDisplayPenalties();

    renderArenaTimeoutOverlay();
  },
  250
);


/* =========================================================
   OPPSTART
========================================================= */

installDisplayLayoutEnhancements();

installPenaltyPresentationEnhancement();

installDisplayPenaltyBoard();

installArenaTimeoutOverlay();

loadSponsors();

renderScoreboard();

renderBreakClock();

renderDisplayPenalties();

renderArenaTimeoutOverlay();

console.log(
  "Arena Kube display – større hvit kampklokke og tydelige utvisningsklokker aktivert."
);
