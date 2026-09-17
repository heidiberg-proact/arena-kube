console.log(
  "Arena Kube operator.js lastet – v2.4 synkroniserte klokker"
);

const channel =
  new BroadcastChannel(
    "arena-kube"
  );

const SCOREBOARD_KEY =
  "arenaKubeScoreboard";

const ACTIVE_MATCH_KEY =
  "arenaKubeActiveMatch";

const BREAK_KEY =
  "arenaKubeBreakClock";

const PENALTY_CLOCKS_KEY =
  "arenaKubePenaltyClocks";

const TIMEOUT_KEY =
  "arenaKubeTimeout";

const TIMEOUT_DURATION_MS =
  30 * 1000;

const BREAK_DURATION_MS =
  10 * 60 * 1000;

const ENTRANCE_VIDEO_URL =
  "../media/video/innmarsj.mp4";

const ENTRANCE_AUDIO_URL =
  "../media/video/innmarsj.mp3";

const PENALTY_SLOT_COUNT =
  3;

const PENALTY_DEFAULT_MINUTES =
  2;


/* =========================================================
   DATA
========================================================= */

let players = [];
let awayPlayers = [];
let matches = [];

let homeGoalRunning =
  false;

let goalCelebrationRunning =
  false;

let selectedHomeGoalPlayer =
  null;

let activeMatch =
  null;

let currentAwayPlayersUrl =
  "";

let awayPlayersLoaded =
  false;

let awayPlayersExplicit =
  false;

let displayPingResolver =
  null;

let displayPingTimer =
  null;

let displayAudioResolver =
  null;

let displayAudioTimer =
  null;

let displayAudioRequestId =
  null;

let lastPenaltyPersistAt =
  0;


/* =========================================================
   SCOREBOARD
========================================================= */

const defaultScoreboard = {
  elapsedMs: 0,
  running: false,
  startedAt: null,
  period: 1,
  periodLengthMinutes: 20,
  homeScore: 0,
  awayScore: 0
};

let scoreboard =
  loadScoreboard();


/* =========================================================
   DOM – KAMP
========================================================= */

const matchSelect =
  document.getElementById(
    "matchSelect"
  );

const activateMatchButton =
  document.getElementById(
    "activateMatch"
  );

const activeMatchStatus =
  document.getElementById(
    "activeMatchStatus"
  );

const activeMatchDate =
  document.getElementById(
    "activeMatchDate"
  );

const homeLogo =
  document.getElementById(
    "operatorHomeLogo"
  ) ||
  document.getElementById(
    "homeLogo"
  );

const awayLogo =
  document.getElementById(
    "operatorAwayLogo"
  ) ||
  document.getElementById(
    "awayLogo"
  );


/* =========================================================
   DOM – HJEMMEMÅL
========================================================= */

const showHomeGoalButton =
  document.getElementById(
    "showHomeGoal"
  );

const showGoalCelebrationButton =
  document.getElementById(
    "showGoalCelebration"
  );

const homeGoalPlayersContainer =
  document.getElementById(
    "homeGoalPlayers"
  );

const homeGoalAssistSelect =
  document.getElementById(
    "homeGoalAssistSelect"
  );

const homeGoalSelectionStatus =
  document.getElementById(
    "homeGoalSelectionStatus"
  );


/* =========================================================
   DOM – BORTEMÅL
========================================================= */

const awayGoalNumberInput =
  document.getElementById(
    "awayGoalNumber"
  );

const awayGoalNameInput =
  document.getElementById(
    "awayGoalName"
  );

const awayAssistNumberInput =
  document.getElementById(
    "awayAssistNumber"
  );

const awayAssistNameInput =
  document.getElementById(
    "awayAssistName"
  );

const showAwayGoalButton =
  document.getElementById(
    "showAwayGoal"
  );

let awayGoalPlayerSelect =
  null;

let awayGoalAssistSelect =
  null;

let awayRosterStatus =
  null;

let awayGoalSelectControls =
  null;


/* =========================================================
   DOM – UTVISNING
========================================================= */

const penaltyHomeControls =
  document.getElementById(
    "penaltyHomeControls"
  );

const penaltyAwayControls =
  document.getElementById(
    "penaltyAwayControls"
  );

const penaltyHomePlayerSelect =
  document.getElementById(
    "penaltyHomePlayer"
  );

const penaltyAwayNumberInput =
  document.getElementById(
    "penaltyAwayNumber"
  );

const penaltyAwayNameInput =
  document.getElementById(
    "penaltyAwayName"
  );

const showPenaltyButton =
  document.getElementById(
    "showPenalty"
  );


/* =========================================================
   DOM – BANENS BESTE
========================================================= */

const bestHomePlayersContainer =
  document.getElementById(
    "bestHomePlayers"
  );

let bestHomePlayerSelect =
  document.getElementById(
    "bestHomePlayer"
  );

let showBestHomeButton =
  document.getElementById(
    "showBestHome"
  );

const bestAwayNumberInput =
  document.getElementById(
    "awayBestNumber"
  ) ||
  document.getElementById(
    "bestAwayNumber"
  );

const showBestAwayButton =
  document.getElementById(
    "showBestAway"
  );

let bestAwayPlayerSelect =
  null;


/* =========================================================
   DOM – HOVEDKONTROLLER
========================================================= */

const showGameButton =
  document.getElementById(
    "showGame"
  );

const showSponsorsButton =
  document.getElementById(
    "showSponsors"
  );

const showMessageButton =
  document.getElementById(
    "showMessage"
  );

const messageInput =
  document.getElementById(
    "messageInput"
  );

const stopAudioButton =
  document.getElementById(
    "stopAudio"
  );

const clearDisplayButton =
  document.getElementById(
    "clearDisplay"
  );


/* =========================================================
   DOM – SCOREBOARD
========================================================= */

const operatorGameClock =
  document.getElementById(
    "operatorGameClock"
  );

const operatorPeriodText =
  document.getElementById(
    "operatorPeriodText"
  );

const operatorHomeScore =
  document.getElementById(
    "operatorHomeScore"
  );

const operatorAwayScore =
  document.getElementById(
    "operatorAwayScore"
  );

const operatorScoreHomeName =
  document.getElementById(
    "operatorScoreHomeName"
  );

const operatorScoreAwayName =
  document.getElementById(
    "operatorScoreAwayName"
  );

const clockRunStatus =
  document.getElementById(
    "clockRunStatus"
  );

const toggleClockButton =
  document.getElementById(
    "toggleClock"
  );

const resetClockButton =
  document.getElementById(
    "resetClock"
  );

const clockMinus10Button =
  document.getElementById(
    "minus10Seconds"
  );

const clockMinus1Button =
  document.getElementById(
    "minus1Second"
  );

const clockPlus1Button =
  document.getElementById(
    "plus1Second"
  );

const clockPlus10Button =
  document.getElementById(
    "plus10Seconds"
  );

const homeScoreMinusButton =
  document.getElementById(
    "homeScoreMinus"
  );

const homeScorePlusButton =
  document.getElementById(
    "homeScorePlus"
  );

const awayScoreMinusButton =
  document.getElementById(
    "awayScoreMinus"
  );

const awayScorePlusButton =
  document.getElementById(
    "awayScorePlus"
  );

const periodButtons =
  document.querySelectorAll(
    ".period-button"
  );

const periodLengthButtons =
  document.querySelectorAll(
    ".period-length-button"
  );

const operatorClockCenter =
  document.querySelector(
    ".operator-clock-center"
  );

let timeoutSelectedTeam =
  null;

let operatorTimeoutPanel =
  null;

let operatorTimeoutClock =
  null;

let operatorTimeoutStatus =
  null;


/* =========================================================
   DOM – PAUSEKLOKKE
========================================================= */

const operatorBreakControl =
  document.getElementById(
    "operatorBreakControl"
  );

const operatorBreakClock =
  document.getElementById(
    "operatorBreakClock"
  );

const stopBreakClockButton =
  document.getElementById(
    "stopBreakClock"
  );


/* =========================================================
   DOM – PREFLIGHT
========================================================= */

const preflightButton =
  document.getElementById(
    "runPreflight"
  );

const preflightOverall =
  document.getElementById(
    "preflightOverall"
  );

const connectionStatus =
  document.getElementById(
    "connectionStatus"
  );

const PREFLIGHT_CHECK_IDS = [
  "checkMatch",
  "checkPlayers",
  "checkSponsors",
  "checkHomeLogo",
  "checkAwayLogo",
  "checkBestAudio",
  "checkHomeGoalAudio",
  "checkPenaltyAudio",
  "checkEntranceVideo",
  "checkAwayPlayers",
  "checkDisplay"
];


/* =========================================================
   VISUELLE TILLEGG
========================================================= */

function installOperatorEnhancementStyles() {
  if (
    document.getElementById(
      "arenaKubeOperatorEnhancements"
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "arenaKubeOperatorEnhancements";

  style.textContent = `
    .operator-live-workspace {
      display: grid !important;
      grid-template-columns:
        minmax(480px, 56%)
        minmax(420px, 44%) !important;
      gap: 10px !important;
      align-items: start !important;
    }

    .operator-live-workspace
    .scoreboard-control-panel {
      width: 100% !important;
      max-width: none !important;
      padding: 10px 12px 12px !important;
      margin: 0 !important;
    }

    .operator-live-workspace
    .scoreboard-control-header {
      margin-bottom: 7px !important;
    }

    .operator-live-workspace
    .scoreboard-control-header h2 {
      font-size: 17px !important;
    }

    .operator-live-workspace
    .clock-run-status {
      padding: 5px 8px !important;
      font-size: 10px !important;
    }

    .operator-live-workspace
    .operator-scoreboard {
      gap: 7px !important;
    }

    .operator-live-workspace
    .operator-score-row {
      gap: 24px !important;
    }

    .operator-live-workspace
    .operator-score-team-name {
      min-height: 17px !important;
      font-size: 13px !important;
    }

    .operator-live-workspace
    .operator-score-number {
      margin-top: 1px !important;
      font-size: 40px !important;
    }

    .operator-live-workspace
    .score-buttons {
      width: 104px !important;
      gap: 5px !important;
      margin-top: 4px !important;
    }

    .operator-live-workspace
    .score-small-button {
      min-height: 30px !important;
      font-size: 19px !important;
    }

    .operator-live-workspace
    .operator-clock-center {
      width: 340px !important;
      max-width: 100% !important;
      min-height: 238px !important;
      margin: 0 auto !important;
      padding: 11px 12px !important;
    }

    .operator-live-workspace
    .operator-game-clock {
      margin: 1px 0 3px !important;
      font-size: 86px !important;
      line-height: .95 !important;
    }

    .operator-live-workspace
    .operator-period-text {
      margin-top: 3px !important;
      font-size: 15px !important;
    }

    .operator-live-workspace
    .compact-goal-control {
      display: flex;
      justify-content: center;
      margin-top: 7px;
    }

    .operator-live-workspace
    .compact-goal-button {
      width: 150px !important;
      min-height: 58px !important;
      margin: 0 !important;
      border: 2px solid #fff !important;
      border-radius: 7px !important;
      background: #c62828 !important;
      color: #fff !important;
      font-size: 16px !important;
      font-weight: 900 !important;
    }

    .operator-live-workspace
    .compact-goal-button.running {
      border-color: #fff07a !important;
      background: #f4d000 !important;
      color: #000 !important;
    }

    .operator-live-workspace
    .period-length-control {
      margin-top: 7px !important;
      opacity: .82;
    }

    .operator-live-workspace
    .period-length-button {
      min-height: 28px !important;
    }

    .operator-live-workspace
    .clock-main-buttons {
      margin-top: 9px !important;
    }

    .operator-live-workspace
    .clock-button {
      min-height: 40px !important;
    }

    .operator-live-workspace
    #toggleClock {
      font-size: 15px !important;
    }

    .operator-live-workspace
    .clock-adjust-buttons {
      margin-top: 6px !important;
      opacity: .82;
    }

    .operator-live-workspace
    .clock-adjust-buttons button {
      min-height: 28px !important;
    }

    .operator-live-workspace
    .period-buttons {
      margin-top: 6px !important;
      opacity: .82;
    }

    .operator-live-workspace
    .period-button {
      min-height: 28px !important;
    }

    .arena-kube-right-stack {
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-width: 0;
      width: 100%;
    }

    .operator-page .live-preview-panel {
      width: min(250px, 100%) !important;
      max-width: 250px !important;
      align-self: center !important;
      margin: 0 auto !important;
      padding: 6px !important;
      border-width: 2px !important;
      border-radius: 7px !important;
      box-sizing: border-box;
    }

    .operator-page .live-preview-header {
      gap: 6px !important;
      margin-bottom: 6px !important;
    }

    .operator-page .live-preview-title {
      font-size: 12px !important;
    }

    .operator-page .live-preview-status {
      padding: 3px 5px !important;
      font-size: 8px !important;
    }

    .operator-page .live-preview-frame-wrap {
      border-width: 1px !important;
    }

    .operator-page .live-preview-help {
      display: none !important;
      line-height: 1.25 !important;
    }

    .arena-kube-compact-select-row {
      display: grid;
      grid-template-columns:
        minmax(0, 1fr)
        minmax(0, 1fr);
      gap: 8px;
      margin-top: 7px;
    }

    .arena-kube-compact-select-row.single {
      grid-template-columns:
        minmax(0, 1fr)
        auto;
    }

    .arena-kube-compact-select-row select {
      width: 100%;
      min-height: 42px;
      padding: 7px 9px;
      border: 2px solid #aaa;
      border-radius: 6px;
      background: white;
      color: #111;
      font-size: 14px;
      font-weight: 700;
    }

    .arena-kube-roster-status {
      margin: 5px 0 3px;
      color: #b8c0ba;
      font-size: 11px;
      font-weight: 700;
    }

    .arena-kube-roster-status.ok {
      color: #a6ffbd;
    }

    .arena-kube-roster-status.fallback {
      color: #ffe891;
    }

    .away-goal-controls input[readonly] {
      cursor: default;
      background: #eef2ef;
    }

    .away-goal-controls .roster-name-found {
      border-color: #32b85d !important;
      background: #eaffef !important;
      color: #0b4d20 !important;
      font-weight: 900 !important;
    }

    .away-goal-controls .roster-name-missing {
      border-color: #d44141 !important;
      background: #fff0f0 !important;
    }

    .arena-kube-manual-fallback[hidden] {
      display: none !important;
    }

    .arena-kube-best-controls {
      display: grid;
      grid-template-columns:
        minmax(0, 1fr)
        auto;
      gap: 8px;
      align-items: stretch;
    }

    .arena-kube-best-controls select {
      min-height: 42px;
      padding: 7px 9px;
      border: 2px solid #aaa;
      border-radius: 6px;
      background: white;
      color: #111;
      font-size: 14px;
      font-weight: 700;
    }

    .arena-kube-best-controls button {
      min-height: 42px !important;
      margin: 0 !important;
      padding: 7px 12px !important;
    }

    #operatorPenaltyClocks {
      width: 100%;
      box-sizing: border-box;
      padding: 5px;
      margin: 0;
      background: #071d11;
      border: 2px solid #f4d000;
      border-radius: 8px;
      color: white;
    }

    #operatorPenaltyClocks
    .penalty-clock-title {
      margin-bottom: 4px;
      color: #f4d000;
      font-size: 12px;
      font-weight: 900;
      text-align: center;
    }

    #operatorPenaltyGrid {
      display: grid;
      grid-template-columns:
        minmax(0, 1fr)
        minmax(0, 1fr);
      gap: 5px;
      max-height: none;
      overflow: visible;
      padding-right: 2px;
    }

    #operatorPenaltyGrid > div {
      min-width: 0;
      padding: 4px;
      background: #10291a;
      border: 1px solid #456451;
      border-radius: 7px;
    }

    [data-penalty-team-heading] {
      margin-bottom: 3px;
      overflow: hidden;
      color: #f4d000;
      font-size: 11px;
      font-weight: 900;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    [data-penalty-slots] {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    [data-penalty-slot] {
      min-width: 0;
      min-height: 0 !important;
      display: grid;
      grid-template-columns: 42px 84px minmax(72px, 1fr);
      grid-template-areas:
        "number duration buttons"
        "label label label";
      gap: 2px 4px;
      align-items: center;
      padding: 3px !important;
      background: #071d11;
      border: 1px solid #3c5d47;
      border-radius: 6px;
      text-align: center;
    }

    [data-penalty-slot].active {
      border-color: #ffcf00;
      box-shadow: inset 0 0 0 1px #ffcf00;
    }

    [data-penalty-slot] select,
    [data-penalty-slot] input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      margin: 0 !important;
      padding: 4px 5px !important;
      border: 1px solid #9ba69e;
      border-radius: 4px;
      background: white;
      color: #111;
      font-size: 11px;
      font-weight: 700;
    }

    [data-penalty-player-manual] {
      grid-area: number;
      text-align: center;
    }

    [data-penalty-duration] {
      grid-area: duration;
    }

    [data-penalty-player-label] {
      grid-area: label;
      min-height: 11px;
      margin: 0;
      overflow: hidden;
      color: white;
      font-size: 9px;
      font-weight: 800;
      line-height: 1.2;
      text-overflow: ellipsis;
    }

    .penalty-clock-button-row {
      grid-area: buttons;
      display: grid;
      grid-template-columns: minmax(58px, 1fr) 58px;
      gap: 3px;
    }

    [data-penalty-slot] button {
      width: 100%;
      min-width: 0;
      min-height: 26px;
      padding: 4px 3px !important;
      border: 0;
      border-radius: 4px;
      cursor: pointer;
      font-size: 10px;
      font-weight: 900;
    }

    [data-penalty-start] {
      background: #f4d000;
      color: #111;
      font-variant-numeric: tabular-nums;
    }

    [data-penalty-start]:disabled {
      opacity: 1;
      cursor: default;
    }

    [data-penalty-clear] {
      background: #8e2424;
      color: white;
      font-size: 8px !important;
    }

    .arena-kube-timeout-control {
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      padding: 5px 6px;
      border: 1px solid #456451;
      border-radius: 8px;
      background: #071d11;
      color: white;
    }

    .arena-kube-timeout-title {
      margin-bottom: 4px;
      color: #aeb8b1;
      font-size: 10px;
      font-weight: 900;
      text-align: center;
    }

    .arena-kube-timeout-teams,
    .arena-kube-timeout-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .arena-kube-timeout-control button {
      min-height: 27px;
      padding: 4px;
      border: 0;
      border-radius: 5px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 900;
    }

    .arena-kube-timeout-team {
      background: #e7e7e7;
      color: #111;
    }

    .arena-kube-timeout-team.selected {
      background: #f4d000;
      box-shadow: inset 0 0 0 2px white;
    }

    .arena-kube-timeout-actions {
      margin-top: 4px;
    }

    .arena-kube-timeout-start {
      background: #16833b;
      color: white;
    }

    .arena-kube-timeout-stop {
      background: #9b2525;
      color: white;
    }

    .arena-kube-timeout-readout {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-top: 3px;
      font-size: 10px;
      font-weight: 900;
    }

    .arena-kube-timeout-clock {
      color: #f4d000;
      font-size: 14px;
      font-variant-numeric: tabular-nums;
    }

    @media (max-width: 1050px) {
      .operator-live-workspace {
        grid-template-columns: 1fr !important;
      }

      .operator-live-workspace
      .scoreboard-control-panel {
        max-width: 620px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .arena-kube-right-stack {
        max-width: 620px;
        margin: 0 auto;
      }
    }

    @media (max-width: 700px) {
      .arena-kube-compact-select-row,
      .arena-kube-compact-select-row.single,
      .arena-kube-best-controls,
      #operatorPenaltyGrid {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(
    style
  );
}


/* =========================================================
   DYNAMISK PREFLIGHT – BORTELAGSSPILLERE
========================================================= */

function installAwayPlayersPreflightItem() {
  if (
    document.getElementById(
      "checkAwayPlayers"
    )
  ) {
    return;
  }

  const list =
    document.querySelector(
      ".preflight-list"
    );

  const displayItem =
    document.getElementById(
      "checkDisplay"
    );

  if (!list) {
    return;
  }

  const item =
    document.createElement(
      "div"
    );

  item.id =
    "checkAwayPlayers";

  item.className =
    "preflight-item neutral";

  item.innerHTML = `
    <span class="preflight-icon">●</span>
    <span>Bortespillere</span>
    <strong>Ikke testet</strong>
  `;

  if (
    displayItem &&
    displayItem.parentNode === list
  ) {
    list.insertBefore(
      item,
      displayItem
    );
  } else {
    list.appendChild(
      item
    );
  }
}


/* =========================================================
   DYNAMISK UI – BANENS BESTE HJEMME
========================================================= */

function installBestHomeSelect() {
  if (
    bestHomePlayerSelect &&
    showBestHomeButton
  ) {
    return;
  }

  if (
    !bestHomePlayersContainer
  ) {
    return;
  }

  const section =
    bestHomePlayersContainer.closest(
      ".panel"
    );

  if (!section) {
    return;
  }

  bestHomePlayersContainer.style.display =
    "none";

  const controls =
    document.createElement(
      "div"
    );

  controls.className =
    "arena-kube-best-controls";

  const select =
    document.createElement(
      "select"
    );

  select.id =
    "bestHomePlayer";

  select.innerHTML =
    '<option value="">Velg spiller …</option>';

  const button =
    document.createElement(
      "button"
    );

  button.id =
    "showBestHome";

  button.type =
    "button";

  button.className =
    "control-button yellow";

  button.textContent =
    "VIS BANENS BESTE – HJEMME";

  controls.appendChild(
    select
  );

  controls.appendChild(
    button
  );

  bestHomePlayersContainer
    .insertAdjacentElement(
      "afterend",
      controls
    );

  bestHomePlayerSelect =
    select;

  showBestHomeButton =
    button;

  bindBestHomeButton();
}


/* =========================================================
   DYNAMISK UI – BORTEMÅL
========================================================= */

function installAwayGoalSelects() {
  const section =
    document.getElementById(
      "awayGoalPanel"
    );

  if (!section) {
    return;
  }

  const manualRows =
    Array.from(
      section.querySelectorAll(
        ".away-goal-controls"
      )
    );

  awayRosterStatus =
    document.createElement(
      "div"
    );

  awayRosterStatus.className =
    "arena-kube-roster-status fallback";

  awayRosterStatus.textContent =
    "Bortelagsspillere: manuell registrering";

  const firstManualRow =
    manualRows[0];

  if (firstManualRow) {
    firstManualRow.insertAdjacentElement(
      "beforebegin",
      awayRosterStatus
    );

  } else {
    section.appendChild(
      awayRosterStatus
    );

  }

  setAwayRosterMode(
    false
  );
}


/* =========================================================
   DYNAMISK UI – BANENS BESTE BORTE
========================================================= */

function installBestAwaySelect() {
  if (
    !bestAwayNumberInput ||
    !showBestAwayButton
  ) {
    return;
  }

  const controls =
    bestAwayNumberInput.parentElement;

  if (!controls) {
    return;
  }

  bestAwayPlayerSelect =
    document.createElement(
      "select"
    );

  bestAwayPlayerSelect.id =
    "bestAwayPlayer";

  bestAwayPlayerSelect.innerHTML =
    '<option value="">Velg bortespiller …</option>';

  bestAwayPlayerSelect.style.flex =
    "1";

  bestAwayPlayerSelect.style.minHeight =
    "42px";

  bestAwayPlayerSelect.style.padding =
    "7px 9px";

  bestAwayPlayerSelect.style.fontSize =
    "14px";

  bestAwayPlayerSelect.hidden =
    true;

  controls.insertBefore(
    bestAwayPlayerSelect,
    bestAwayNumberInput
  );
}


/* =========================================================
   SCOREBOARD – LAST / LAGRE
========================================================= */

function loadScoreboard() {
  const stored =
    localStorage.getItem(
      SCOREBOARD_KEY
    );

  if (!stored) {
    return {
      ...defaultScoreboard
    };
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

    return {
      ...defaultScoreboard
    };
  }
}


function saveScoreboard() {
  localStorage.setItem(
    SCOREBOARD_KEY,
    JSON.stringify(
      scoreboard
    )
  );

  channel.postMessage({
    type:
      "scoreboardUpdate",

    scoreboard: {
      ...scoreboard
    }
  });

  renderScoreboard();
}


function getPeriodLimitMs() {
  return (
    scoreboard.periodLengthMinutes *
    60 *
    1000
  );
}


function getCurrentElapsed(
  now = Date.now()
) {
  if (
    !scoreboard.running ||
    !scoreboard.startedAt
  ) {
    return scoreboard.elapsedMs;
  }

  return (
    scoreboard.elapsedMs +
    (
      now -
      scoreboard.startedAt
    )
  );
}


function getClampedElapsed(
  now = Date.now()
) {
  return Math.min(
    getCurrentElapsed(
      now
    ),
    getPeriodLimitMs()
  );
}


function formatClock(
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
    console.error(
      "Kunne ikke lese pauseklokke:",
      error
    );

    return null;
  }
}


function startBreakClock() {
  const state = {
    running: true,

    endAt:
      Date.now() +
      BREAK_DURATION_MS
  };

  localStorage.setItem(
    BREAK_KEY,
    JSON.stringify(
      state
    )
  );

  channel.postMessage({
    type:
      "breakStarted",

    endAt:
      state.endAt
  });

  renderBreakClock();
}


function stopBreakClock() {
  localStorage.removeItem(
    BREAK_KEY
  );

  channel.postMessage({
    type:
      "breakStopped"
  });

  renderBreakClock();
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
      operatorBreakControl
    ) {
      operatorBreakControl.hidden =
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
    stopBreakClock();
    return;
  }

  if (
    operatorBreakControl
  ) {
    operatorBreakControl.hidden =
      false;
  }

  if (
    operatorBreakClock
  ) {
    operatorBreakClock.textContent =
      formatClock(
        remaining
      );
  }
}


if (
  stopBreakClockButton
) {
  stopBreakClockButton.addEventListener(
    "click",
    stopBreakClock
  );
}


/* =========================================================
   TIMEOUT – 30 SEKUNDER
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
      !["home", "away"].includes(
        state.team
      )
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


function getTimeoutTeamDetails(
  team
) {
  const match =
    activeMatch ||
    getStoredActiveMatch();

  if (
    team === "away"
  ) {
    return {
      team:
        "away",

      name:
        match &&
        match.awayTeam
          ? match.awayTeam
          : "BORTELAG",

      logo:
        match &&
        match.awayLogo
          ? match.awayLogo
          : ""
    };
  }

  return {
    team:
      "home",

    name:
      match &&
      match.homeTeam
        ? match.homeTeam
        : "HJEMMELAG",

    logo:
      match &&
      match.homeLogo
        ? match.homeLogo
        : ""
  };
}


function saveArenaTimeoutState(
  state
) {
  localStorage.setItem(
    TIMEOUT_KEY,
    JSON.stringify(
      state
    )
  );

  channel.postMessage({
    type:
      "timeoutStateUpdate",

    timeout:
      state
  });
}


function selectTimeoutTeam(
  team
) {
  if (
    !["home", "away"].includes(
      team
    )
  ) {
    return;
  }

  timeoutSelectedTeam =
    team;

  renderArenaTimeoutControl();
}


function startArenaTimeout() {
  if (
    scoreboard.running
  ) {
    alert(
      "Stopp hovedkampklokken før timeout startes."
    );

    return;
  }

  if (
    !timeoutSelectedTeam
  ) {
    alert(
      "Velg HJEMME eller BORTE først."
    );

    return;
  }

  const teamDetails =
    getTimeoutTeamDetails(
      timeoutSelectedTeam
    );

  const now =
    Date.now();

  const state = {
    active:
      true,

    team:
      teamDetails.team,

    teamName:
      teamDetails.name,

    teamLogo:
      teamDetails.logo,

    durationMs:
      TIMEOUT_DURATION_MS,

    startedAt:
      now,

    endAt:
      now +
      TIMEOUT_DURATION_MS
  };

  saveArenaTimeoutState(
    state
  );

  renderArenaTimeoutControl();
}


function stopArenaTimeout() {
  localStorage.removeItem(
    TIMEOUT_KEY
  );

  channel.postMessage({
    type:
      "timeoutStopped"
  });

  renderArenaTimeoutControl();
}


function renderArenaTimeoutControl() {
  if (
    !operatorTimeoutPanel
  ) {
    return;
  }

  const state =
    getArenaTimeoutState();

  let remaining =
    0;

  if (
    state &&
    state.active &&
    Number(
      state.endAt
    )
  ) {
    if (
      !timeoutSelectedTeam
    ) {
      timeoutSelectedTeam =
        state.team;
    }

    remaining =
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
      stopArenaTimeout();
      return;
    }
  }

  operatorTimeoutPanel
    .querySelectorAll(
      "[data-timeout-team]"
    )
    .forEach(
      (button) => {
        const team =
          button.dataset.timeoutTeam;

        button.classList.toggle(
          "selected",
          team ===
            timeoutSelectedTeam
        );

        const details =
          getTimeoutTeamDetails(
            team
          );

        button.textContent =
          team === "home"
            ? `HJEMME – ${details.name}`
            : `BORTE – ${details.name}`;
      }
    );

  if (
    operatorTimeoutClock
  ) {
    operatorTimeoutClock.textContent =
      remaining > 0
        ? formatClock(
            remaining
          )
        : "00:30";
  }

  if (
    operatorTimeoutStatus
  ) {
    operatorTimeoutStatus.textContent =
      remaining > 0
        ? `TIMEOUT: ${state.teamName}`
        : timeoutSelectedTeam
          ? "LAG VALGT – KLAR TIL START"
          : "VELG LAG";
  }
}


/*
  V2.4:
  Timeout ligger ikke lenger inne i selve kampklokkeboksen.
  Den plasseres i høyrekolonnen, mellom preview og
  utvisningsklokkene.
*/

function installArenaTimeoutControl() {
  if (
    document.getElementById(
      "arenaKubeTimeoutControl"
    )
  ) {
    return;
  }

  const workspace =
    document.querySelector(
      ".operator-live-workspace"
    );

  if (!workspace) {
    return;
  }

  let rightStack =
    workspace.querySelector(
      ".arena-kube-right-stack"
    );

  if (!rightStack) {
    rightStack =
      document.createElement(
        "div"
      );

    rightStack.className =
      "arena-kube-right-stack";

    const preview =
      workspace.querySelector(
        ".live-preview-panel"
      );

    workspace.appendChild(
      rightStack
    );

    if (preview) {
      rightStack.appendChild(
        preview
      );
    }
  }

  operatorTimeoutPanel =
    document.createElement(
      "section"
    );

  operatorTimeoutPanel.id =
    "arenaKubeTimeoutControl";

  operatorTimeoutPanel.className =
    "arena-kube-timeout-control";

  operatorTimeoutPanel.innerHTML = `
    <div class="arena-kube-timeout-title">
      TIMEOUT – 30 SEKUNDER
    </div>

    <div class="arena-kube-timeout-teams">
      <button
        type="button"
        class="arena-kube-timeout-team"
        data-timeout-team="home"
      >
        HJEMME
      </button>

      <button
        type="button"
        class="arena-kube-timeout-team"
        data-timeout-team="away"
      >
        BORTE
      </button>
    </div>

    <div class="arena-kube-timeout-actions">
      <button
        type="button"
        class="arena-kube-timeout-start"
        data-timeout-start
      >
        START TIMEOUT
      </button>

      <button
        type="button"
        class="arena-kube-timeout-stop"
        data-timeout-stop
      >
        STOPP / NULLSTILL
      </button>
    </div>

    <div class="arena-kube-timeout-readout">
      <span data-timeout-status>
        VELG LAG
      </span>

      <span
        class="arena-kube-timeout-clock"
        data-timeout-clock
      >
        00:30
      </span>
    </div>
  `;

  rightStack.appendChild(
    operatorTimeoutPanel
  );

  operatorTimeoutClock =
    operatorTimeoutPanel.querySelector(
      "[data-timeout-clock]"
    );

  operatorTimeoutStatus =
    operatorTimeoutPanel.querySelector(
      "[data-timeout-status]"
    );

  operatorTimeoutPanel
    .querySelectorAll(
      "[data-timeout-team]"
    )
    .forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            selectTimeoutTeam(
              button.dataset.timeoutTeam
            );
          }
        );
      }
    );

  operatorTimeoutPanel
    .querySelector(
      "[data-timeout-start]"
    )
    .addEventListener(
      "click",
      startArenaTimeout
    );

  operatorTimeoutPanel
    .querySelector(
      "[data-timeout-stop]"
    )
    .addEventListener(
      "click",
      stopArenaTimeout
    );

  renderArenaTimeoutControl();
}


/* =========================================================
   UTVISNINGSKLOKKER – DATA
========================================================= */

function createEmptyPenaltySlot() {
  return {
    active:
      false,

    playerNumber:
      "",

    playerName:
      "",

    durationMinutes:
      PENALTY_DEFAULT_MINUTES,

    durationMs:
      PENALTY_DEFAULT_MINUTES *
      60 *
      1000,

    remainingMs:
      PENALTY_DEFAULT_MINUTES *
      60 *
      1000,

    lastUpdatedAt:
      Date.now()
  };
}


function createDefaultPenaltyState() {
  return {
    home:
      Array.from(
        {
          length:
            PENALTY_SLOT_COUNT
        },
        () =>
          createEmptyPenaltySlot()
      ),

    away:
      Array.from(
        {
          length:
            PENALTY_SLOT_COUNT
        },
        () =>
          createEmptyPenaltySlot()
      )
  };
}


function normalizePenaltySlot(
  slot
) {
  const durationMinutes =
    [2, 4, 10].includes(
      Number(
        slot &&
        slot.durationMinutes
      )
    )
      ? Number(
          slot.durationMinutes
        )
      : PENALTY_DEFAULT_MINUTES;

  const durationMs =
    durationMinutes *
    60 *
    1000;

  const storedRemaining =
    Number(
      slot &&
      slot.remainingMs
    );

  return {
    active:
      Boolean(
        slot &&
        slot.active
      ),

    playerNumber:
      slot &&
      slot.playerNumber !==
        undefined
        ? String(
            slot.playerNumber
          )
        : "",

    playerName:
      slot &&
      slot.playerName
        ? String(
            slot.playerName
          )
        : "",

    durationMinutes,

    durationMs,

    remainingMs:
      Number.isFinite(
        storedRemaining
      )
        ? Math.max(
            0,
            Math.min(
              storedRemaining,
              durationMs
            )
          )
        : durationMs,

    lastUpdatedAt:
      Number(
        slot &&
        slot.lastUpdatedAt
      ) ||
      Date.now()
  };
}


function loadPenaltyClockState() {
  const stored =
    localStorage.getItem(
      PENALTY_CLOCKS_KEY
    );

  if (!stored) {
    return createDefaultPenaltyState();
  }

  try {
    const data =
      JSON.parse(
        stored
      );

    return {
      home:
        Array.from(
          {
            length:
              PENALTY_SLOT_COUNT
          },
          (
            _,
            index
          ) =>
            normalizePenaltySlot(
              data.home &&
              data.home[index]
            )
        ),

      away:
        Array.from(
          {
            length:
              PENALTY_SLOT_COUNT
          },
          (
            _,
            index
          ) =>
            normalizePenaltySlot(
              data.away &&
              data.away[index]
            )
        )
    };

  } catch (error) {
    console.warn(
      "Kunne ikke lese utvisningsklokker:",
      error
    );

    return createDefaultPenaltyState();
  }
}


let penaltyClockState =
  loadPenaltyClockState();


function hasActivePenaltyClocks() {
  return [
    ...penaltyClockState.home,
    ...penaltyClockState.away
  ].some(
    (slot) =>
      slot.active
  );
}


function persistPenaltyClockState(
  broadcast = true
) {
  localStorage.setItem(
    PENALTY_CLOCKS_KEY,
    JSON.stringify(
      penaltyClockState
    )
  );

  lastPenaltyPersistAt =
    Date.now();

  if (broadcast) {
    channel.postMessage({
      type:
        "penaltyClockUpdate",

      penalties:
        penaltyClockState
    });
  }
}


function resetPenaltyTickReference(
  now = Date.now()
) {
  [
    "home",
    "away"
  ].forEach(
    (team) => {
      penaltyClockState[
        team
      ].forEach(
        (slot) => {
          if (
            slot.active
          ) {
            slot.lastUpdatedAt =
              now;
          }
        }
      );
    }
  );

  if (
    hasActivePenaltyClocks()
  ) {
    persistPenaltyClockState();
  }
}


/*
  V2.4:
  Alle aktive utvisninger bruker samme "nå" som hovedklokka.
*/

function updatePenaltyClockState(
  forcePersist = false,
  now = Date.now()
) {
  let changed =
    false;

  [
    "home",
    "away"
  ].forEach(
    (team) => {
      penaltyClockState[
        team
      ].forEach(
        (
          slot,
          index
        ) => {
          if (
            !slot.active
          ) {
            return;
          }

          if (
            scoreboard.running
          ) {
            const delta =
              Math.max(
                0,
                now -
                Number(
                  slot.lastUpdatedAt ||
                  now
                )
              );

            if (
              delta > 0
            ) {
              slot.remainingMs =
                Math.max(
                  0,
                  slot.remainingMs -
                  delta
                );

              changed =
                true;
            }
          }

          slot.lastUpdatedAt =
            now;

          if (
            slot.remainingMs <= 0
          ) {
            penaltyClockState[
              team
            ][index] =
              createEmptyPenaltySlot();

            changed =
              true;
          }
        }
      );
    }
  );

  const shouldPersist =
    forcePersist ||
    (
      changed &&
      now -
      lastPenaltyPersistAt >=
        250
    );

  if (
    shouldPersist
  ) {
    persistPenaltyClockState();
  }

  return changed;
}


/*
  V2.4 – MANUELL SYNKRONISERING

  Hovedklokka teller opp.
  Utvisningsklokka teller ned.

  Derfor:
    hovedklokke +10 sek  => utvisning -10 sek
    hovedklokke -10 sek  => utvisning +10 sek

  Vi bruker den FAKTISKE endringen i hovedklokka.
  Dersom hovedklokka f.eks. står på 00:04 og "-10" trykkes,
  er den reelle endringen bare -4 sekunder.
*/

function adjustActivePenaltyClocks(
  gameClockDeltaMs,
  now = Date.now()
) {
  if (
    !gameClockDeltaMs
  ) {
    resetPenaltyTickReference(
      now
    );

    return;
  }

  let changed =
    false;

  [
    "home",
    "away"
  ].forEach(
    (team) => {
      penaltyClockState[
        team
      ].forEach(
        (
          slot,
          index
        ) => {
          if (
            !slot.active
          ) {
            return;
          }

          const durationMs =
            Math.max(
              0,
              Number(
                slot.durationMs
              ) || 0
            );

          const currentRemaining =
            Math.max(
              0,
              Number(
                slot.remainingMs
              ) || 0
            );

          const adjustedRemaining =
            Math.max(
              0,
              Math.min(
                durationMs,
                currentRemaining -
                gameClockDeltaMs
              )
            );

          slot.remainingMs =
            adjustedRemaining;

          slot.lastUpdatedAt =
            now;

          changed =
            true;

          if (
            adjustedRemaining <= 0
          ) {
            penaltyClockState[
              team
            ][index] =
              createEmptyPenaltySlot();
          }
        }
      );
    }
  );

  if (
    changed
  ) {
    persistPenaltyClockState();
  }
}


/* =========================================================
   SCOREBOARD – VISNING
========================================================= */

function renderScoreboard() {
  if (
    operatorGameClock
  ) {
    operatorGameClock.textContent =
      formatClock(
        getClampedElapsed()
      );
  }

  if (
    operatorHomeScore
  ) {
    operatorHomeScore.textContent =
      scoreboard.homeScore;
  }

  if (
    operatorAwayScore
  ) {
    operatorAwayScore.textContent =
      scoreboard.awayScore;
  }

  if (
    operatorPeriodText
  ) {
    operatorPeriodText.textContent =
      `${scoreboard.period}. PERIODE`;
  }

  if (
    clockRunStatus
  ) {
    clockRunStatus.textContent =
      scoreboard.running
        ? "KLOKKEN GÅR"
        : "STOPPET";

    clockRunStatus.classList.toggle(
      "running",
      scoreboard.running
    );

    clockRunStatus.classList.toggle(
      "stopped",
      !scoreboard.running
    );
  }

  if (
    toggleClockButton
  ) {
    toggleClockButton.textContent =
      scoreboard.running
        ? "STOPP"
        : "START";

    toggleClockButton.classList.toggle(
      "start",
      !scoreboard.running
    );

    toggleClockButton.classList.toggle(
      "stop",
      scoreboard.running
    );
  }

  periodButtons.forEach(
    (button) => {
      const period =
        Number(
          button.dataset.period
        );

      button.classList.toggle(
        "active",
        period ===
          scoreboard.period
      );

      button.disabled =
        scoreboard.running;
    }
  );

  periodLengthButtons.forEach(
    (button) => {
      const minutes =
        Number(
          button.dataset.minutes
        );

      button.classList.toggle(
        "active",
        minutes ===
          scoreboard.periodLengthMinutes
      );

      button.disabled =
        scoreboard.running;
    }
  );

  if (
    activeMatch
  ) {
    if (
      operatorScoreHomeName
    ) {
      operatorScoreHomeName.textContent =
        activeMatch.homeTeam ||
        "ULL/KISA";
    }

    if (
      operatorScoreAwayName
    ) {
      operatorScoreAwayName.textContent =
        activeMatch.awayTeam ||
        "BORTELAG";
    }

  } else {
    if (
      operatorScoreHomeName
    ) {
      operatorScoreHomeName.textContent =
        "ULL/KISA";
    }

    if (
      operatorScoreAwayName
    ) {
      operatorScoreAwayName.textContent =
        "BORTELAG";
    }
  }
}


/* =========================================================
   SCOREBOARD – START / STOPP
========================================================= */

function startClock() {
  if (
    scoreboard.running
  ) {
    return;
  }

  if (
    scoreboard.elapsedMs >=
    getPeriodLimitMs()
  ) {
    alert(
      "Perioden er ferdig. Nullstill kampklokka før du starter igjen."
    );

    return;
  }

  const now =
    Date.now();

  resetPenaltyTickReference(
    now
  );

  scoreboard.startedAt =
    now;

  scoreboard.running =
    true;

  saveScoreboard();
}


function stopClock() {
  if (
    !scoreboard.running
  ) {
    return;
  }

  const now =
    Date.now();

  updatePenaltyClockState(
    true,
    now
  );

  scoreboard.elapsedMs =
    getClampedElapsed(
      now
    );

  scoreboard.running =
    false;

  scoreboard.startedAt =
    null;

  resetPenaltyTickReference(
    now
  );

  saveScoreboard();
}


function toggleClock() {
  if (
    scoreboard.running
  ) {
    stopClock();

  } else {
    startClock();
  }
}


function resetGameClock() {
  const confirmed =
    confirm(
      "Nullstille kampklokka til 00:00?"
    );

  if (!confirmed) {
    return;
  }

  const now =
    Date.now();

  if (
    scoreboard.running
  ) {
    updatePenaltyClockState(
      true,
      now
    );
  }

  scoreboard.elapsedMs =
    0;

  scoreboard.running =
    false;

  scoreboard.startedAt =
    null;

  resetPenaltyTickReference(
    now
  );

  saveScoreboard();
}


/* =========================================================
   AUTOMATISK PERIODESLUTT
========================================================= */

function checkPeriodEnd() {
  if (
    !scoreboard.running
  ) {
    return;
  }

  const now =
    Date.now();

  const limit =
    getPeriodLimitMs();

  const elapsed =
    getCurrentElapsed(
      now
    );

  if (
    elapsed < limit
  ) {
    return;
  }

  updatePenaltyClockState(
    true,
    now
  );

  scoreboard.elapsedMs =
    limit;

  scoreboard.running =
    false;

  scoreboard.startedAt =
    null;

  resetPenaltyTickReference(
    now
  );

  saveScoreboard();

  channel.postMessage({
    type:
      "periodEnded",

    period:
      scoreboard.period,

    periodLengthMinutes:
      scoreboard.periodLengthMinutes
  });

  startBreakClock();

  console.log(
    `Arena Kube: ${scoreboard.period}. periode ferdig – hornsignal og pauseklokke startet.`
  );
}


/* =========================================================
   JUSTER KAMPKLOKKE – V2.4 SYNKRONISERT
========================================================= */

function adjustClock(
  deltaMs
) {
  const now =
    Date.now();

  /*
    Først føres alle aktive utvisninger frem til nøyaktig
    samme tidspunkt som vi bruker for hovedklokka.
  */

  if (
    scoreboard.running
  ) {
    updatePenaltyClockState(
      true,
      now
    );
  }

  const current =
    getClampedElapsed(
      now
    );

  const limit =
    getPeriodLimitMs();

  let adjusted =
    current +
    deltaMs;

  adjusted =
    Math.max(
      0,
      Math.min(
        adjusted,
        limit
      )
    );

  /*
    Bruk faktisk tidsendring, ikke bare ønsket knappverdi.
  */

  const actualDeltaMs =
    adjusted -
    current;

  adjustActivePenaltyClocks(
    actualDeltaMs,
    now
  );

  scoreboard.elapsedMs =
    adjusted;

  if (
    scoreboard.running &&
    adjusted < limit
  ) {
    scoreboard.startedAt =
      now;
  }

  if (
    adjusted >= limit
  ) {
    scoreboard.running =
      false;

    scoreboard.startedAt =
      null;

    resetPenaltyTickReference(
      now
    );
  }

  saveScoreboard();

  renderPenaltyClocks();
}


/* =========================================================
   PERIODELENGDE
========================================================= */

function setPeriodLength(
  minutes
) {
  if (
    scoreboard.running
  ) {
    return;
  }

  if (
    ![15, 20].includes(
      minutes
    )
  ) {
    return;
  }

  if (
    scoreboard.elapsedMs > 0 &&
    scoreboard.periodLengthMinutes !==
      minutes
  ) {
    const confirmed =
      confirm(
        "Klokka er allerede brukt. Nullstille klokka og endre periodelengde?"
      );

    if (!confirmed) {
      return;
    }

    scoreboard.elapsedMs =
      0;

    scoreboard.startedAt =
      null;
  }

  scoreboard.periodLengthMinutes =
    minutes;

  saveScoreboard();
}


/* =========================================================
   SCORE
========================================================= */

function changeScore(
  team,
  delta
) {
  if (
    team === "home"
  ) {
    scoreboard.homeScore =
      Math.max(
        0,
        scoreboard.homeScore +
        delta
      );

  } else {
    scoreboard.awayScore =
      Math.max(
        0,
        scoreboard.awayScore +
        delta
      );
  }

  saveScoreboard();
}


/* =========================================================
   SCOREBOARD – KNAPPER
========================================================= */

if (
  toggleClockButton
) {
  toggleClockButton.addEventListener(
    "click",
    toggleClock
  );
}

if (
  resetClockButton
) {
  resetClockButton.addEventListener(
    "click",
    resetGameClock
  );
}

if (
  clockMinus10Button
) {
  clockMinus10Button.addEventListener(
    "click",
    () =>
      adjustClock(
        -10000
      )
  );
}

if (
  clockMinus1Button
) {
  clockMinus1Button.addEventListener(
    "click",
    () =>
      adjustClock(
        -1000
      )
  );
}

if (
  clockPlus1Button
) {
  clockPlus1Button.addEventListener(
    "click",
    () =>
      adjustClock(
        1000
      )
  );
}

if (
  clockPlus10Button
) {
  clockPlus10Button.addEventListener(
    "click",
    () =>
      adjustClock(
        10000
      )
  );
}

if (
  homeScoreMinusButton
) {
  homeScoreMinusButton.addEventListener(
    "click",
    () =>
      changeScore(
        "home",
        -1
      )
  );
}

if (
  homeScorePlusButton
) {
  homeScorePlusButton.addEventListener(
    "click",
    () =>
      changeScore(
        "home",
        1
      )
  );
}

if (
  awayScoreMinusButton
) {
  awayScoreMinusButton.addEventListener(
    "click",
    () =>
      changeScore(
        "away",
        -1
      )
  );
}

if (
  awayScorePlusButton
) {
  awayScorePlusButton.addEventListener(
    "click",
    () =>
      changeScore(
        "away",
        1
      )
  );
}


periodButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        if (
          scoreboard.running
        ) {
          return;
        }

        const period =
          Number(
            button.dataset.period
          );

        if (
          ![1, 2, 3].includes(
            period
          )
        ) {
          return;
        }

        scoreboard.period =
          period;

        resetPenaltyTickReference();

        saveScoreboard();
      }
    );
  }
);


periodLengthButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        setPeriodLength(
          Number(
            button.dataset.minutes
          )
        );
      }
    );
  }
);


/* =========================================================
   BORTELAGS FILNAVN
========================================================= */

function slugifyTeamName(
  name
) {
  return String(
    name || ""
  )
    .toLowerCase()
    .replace(
      /æ/g,
      "ae"
    )
    .replace(
      /ø/g,
      "o"
    )
    .replace(
      /å/g,
      "a"
    )
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}


function getAwayPlayersUrl(
  match
) {
  if (!match) {
    return "";
  }

  const explicit =
    typeof match.awayPlayers ===
      "string"
      ? match.awayPlayers.trim()
      : "";

  if (explicit) {
    awayPlayersExplicit =
      true;

    return explicit;
  }

  awayPlayersExplicit =
    false;

  const slug =
    slugifyTeamName(
      match.awayTeam
    );

  if (!slug) {
    return "";
  }

  return (
    "../data/away-teams/" +
    slug +
    ".json"
  );
}


/* =========================================================
   BORTELAGSSPILLERE
========================================================= */

function sortPlayersByNumber(
  list
) {
  return [
    ...list
  ].sort(
    (
      a,
      b
    ) => {
      const numberA =
        Number(
          a.number
        );

      const numberB =
        Number(
          b.number
        );

      if (
        Number.isFinite(
          numberA
        ) &&
        Number.isFinite(
          numberB
        ) &&
        numberA !==
          numberB
      ) {
        return (
          numberA -
          numberB
        );
      }

      return String(
        a.name ||
        ""
      ).localeCompare(
        String(
          b.name ||
          ""
        ),
        "no"
      );
    }
  );
}


function validPlayerList(
  data
) {
  if (
    !Array.isArray(
      data
    )
  ) {
    return false;
  }

  return data.every(
    (player) =>
      player &&
      player.number !==
        undefined &&
      String(
        player.number
      ).trim() !==
        ""
  );
}


function populatePlayerSelect(
  select,
  list,
  firstText
) {
  if (!select) {
    return;
  }

  const oldValue =
    select.value;

  select.innerHTML =
    "";

  const empty =
    document.createElement(
      "option"
    );

  empty.value =
    "";

  empty.textContent =
    firstText;

  select.appendChild(
    empty
  );

  sortPlayersByNumber(
    list
  ).forEach(
    (player) => {
      const option =
        document.createElement(
          "option"
        );

      const index =
        list.indexOf(
          player
        );

      option.value =
        String(
          index
        );

      option.textContent =
        `#${player.number} ${player.name || ""}`.trim();

      select.appendChild(
        option
      );
    }
  );

  const stillExists =
    Array.from(
      select.options
    ).some(
      (option) =>
        option.value ===
        oldValue
    );

  if (
    stillExists
  ) {
    select.value =
      oldValue;
  }
}


function setAwayRosterMode(
  rosterAvailable
) {
  if (
    awayGoalSelectControls
  ) {
    awayGoalSelectControls.hidden =
      !rosterAvailable;
  }

  [
    awayGoalNameInput,
    awayAssistNameInput
  ].forEach(
    (input) => {
      if (!input) {
        return;
      }

      input.readOnly =
        rosterAvailable;

      input.classList.toggle(
        "roster-name-found",
        rosterAvailable &&
        Boolean(input.value)
      );

      if (!rosterAvailable) {
        input.classList.remove(
          "roster-name-missing"
        );

        input.placeholder =
          "Skriv navn manuelt";
      }
    }
  );

  if (
    bestAwayPlayerSelect
  ) {
    bestAwayPlayerSelect.hidden =
      !rosterAvailable;
  }

  if (
    bestAwayNumberInput
  ) {
    bestAwayNumberInput.hidden =
      rosterAvailable;
  }

  if (
    awayRosterStatus
  ) {
    if (
      rosterAvailable
    ) {
      awayRosterStatus.classList.remove(
        "fallback"
      );

      awayRosterStatus.classList.add(
        "ok"
      );

      awayRosterStatus.textContent =
        `${awayPlayers.length} bortespillere lastet – skriv draktnummer`;

    } else {
      awayRosterStatus.classList.remove(
        "ok"
      );

      awayRosterStatus.classList.add(
        "fallback"
      );

      awayRosterStatus.textContent =
        "Bortelagsspillere ikke funnet – bruker manuell registrering";
    }
  }
}


function findAwayPlayerByNumber(
  number
) {
  const wanted =
    String(number || "").trim();

  if (!wanted) {
    return null;
  }

  return (
    awayPlayers.find(
      (player) =>
        String(
          player.number
        ).trim() ===
        wanted
    ) ||
    null
  );
}


function syncAwayGoalNameFromNumber(
  numberInput,
  nameInput
) {
  if (
    !numberInput ||
    !nameInput ||
    !awayPlayersLoaded
  ) {
    return;
  }

  const number =
    numberInput.value.trim();

  const player =
    findAwayPlayerByNumber(
      number
    );

  nameInput.value =
    player
      ? player.name || ""
      : "";

  nameInput.classList.toggle(
    "roster-name-found",
    Boolean(player)
  );

  nameInput.classList.toggle(
    "roster-name-missing",
    Boolean(number) &&
    !player
  );

  nameInput.placeholder =
    number && !player
      ? "Nummer ikke funnet"
      : "Navn fylles inn automatisk";
}


function syncAwayGoalNames() {
  syncAwayGoalNameFromNumber(
    awayGoalNumberInput,
    awayGoalNameInput
  );

  syncAwayGoalNameFromNumber(
    awayAssistNumberInput,
    awayAssistNameInput
  );
}


function renderAwayPlayers() {
  populatePlayerSelect(
    awayGoalPlayerSelect,
    awayPlayers,
    "Velg målscorer …"
  );

  populatePlayerSelect(
    awayGoalAssistSelect,
    awayPlayers,
    "Ingen assist"
  );

  populatePlayerSelect(
    bestAwayPlayerSelect,
    awayPlayers,
    "Velg bortespiller …"
  );

  setAwayRosterMode(
    awayPlayers.length >
      0
  );

  syncAwayGoalNames();

  refreshPenaltyClockSelectors();
}


async function loadAwayPlayersForMatch(
  match
) {
  awayPlayers =
    [];

  awayPlayersLoaded =
    false;

  currentAwayPlayersUrl =
    getAwayPlayersUrl(
      match
    );

  renderAwayPlayers();

  if (
    !currentAwayPlayersUrl
  ) {
    return false;
  }

  try {
    const response =
      await fetch(
        currentAwayPlayersUrl,
        {
          cache:
            "no-store"
        }
      );

    if (
      !response.ok
    ) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const data =
      await response.json();

    if (
      !validPlayerList(
        data
      )
    ) {
      throw new Error(
        "Bortelagsfilen må være en liste med number/name."
      );
    }

    awayPlayers =
      data;

    awayPlayersLoaded =
      awayPlayers.length >
      0;

    renderAwayPlayers();

    console.log(
      "Arena Kube:",
      awayPlayers.length,
      "bortespillere lastet fra",
      currentAwayPlayersUrl
    );

    return (
      awayPlayersLoaded
    );

  } catch (error) {
    console.warn(
      "Kunne ikke laste bortelagsspillere:",
      currentAwayPlayersUrl,
      error
    );

    awayPlayers =
      [];

    awayPlayersLoaded =
      false;

    renderAwayPlayers();

    return false;
  }
}


function getAwayPlayerFromSelect(
  select
) {
  if (
    !select ||
    select.value ===
      ""
  ) {
    return null;
  }

  const index =
    Number(
      select.value
    );

  if (
    Number.isNaN(
      index
    )
  ) {
    return null;
  }

  return (
    awayPlayers[
      index
    ] ||
    null
  );
}


/* =========================================================
   KAMPER
========================================================= */

function getStoredActiveMatch() {
  const stored =
    localStorage.getItem(
      ACTIVE_MATCH_KEY
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


async function loadMatches() {
  try {
    const response =
      await fetch(
        "../data/matches.json",
        {
          cache:
            "no-store"
        }
      );

    if (
      !response.ok
    ) {
      throw new Error(
        `HTTP ${response.status}`
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
        "matches.json må inneholde en liste."
      );
    }

    matches =
      data;

    if (
      matchSelect
    ) {
      matchSelect.innerHTML =
        '<option value="">Velg kamp</option>';

      matches.forEach(
        (
          match,
          index
        ) => {
          const option =
            document.createElement(
              "option"
            );

          option.value =
            index;

          option.textContent =
            `${match.homeTeam} – ${match.awayTeam}`;

          matchSelect.appendChild(
            option
          );
        }
      );
    }

    activeMatch =
      getStoredActiveMatch();

    renderActiveMatch();

    if (
      activeMatch
    ) {
      await loadAwayPlayersForMatch(
        activeMatch
      );
    }

  } catch (error) {
    console.error(
      "Kunne ikke laste matches.json:",
      error
    );

    if (
      matchSelect
    ) {
      matchSelect.innerHTML =
        '<option value="">Kunne ikke laste kamper</option>';
    }

    activeMatch =
      getStoredActiveMatch();

    renderActiveMatch();

    if (
      activeMatch
    ) {
      await loadAwayPlayersForMatch(
        activeMatch
      );
    }
  }
}


function renderActiveMatch() {
  if (
    !activeMatch
  ) {
    if (
      activeMatchStatus
    ) {
      activeMatchStatus.textContent =
        "Ingen kamp aktivert";
    }

    if (
      activeMatchDate
    ) {
      activeMatchDate.textContent =
        "";
    }

    renderScoreboard();
    renderPenaltyClockTeamHeadings();

    return;
  }

  if (
    activeMatchStatus
  ) {
    activeMatchStatus.textContent =
      `${activeMatch.homeTeam} – ${activeMatch.awayTeam}`;
  }

  if (
    activeMatchDate
  ) {
    activeMatchDate.textContent =
      activeMatch.date ||
      "";
  }

  if (
    activeMatch.homeLogo &&
    homeLogo
  ) {
    homeLogo.src =
      activeMatch.homeLogo;
  }

  if (
    activeMatch.awayLogo &&
    awayLogo
  ) {
    awayLogo.src =
      activeMatch.awayLogo;
  }

  renderScoreboard();

  renderPenaltyClockTeamHeadings();

  renderArenaTimeoutControl();
}


if (
  activateMatchButton
) {
  activateMatchButton.addEventListener(
    "click",
    async () => {
      const index =
        Number(
          matchSelect
            ? matchSelect.value
            : NaN
        );

      if (
        Number.isNaN(
          index
        ) ||
        !matches[
          index
        ]
      ) {
        alert(
          "Velg en kamp først."
        );

        return;
      }

      activeMatch =
        matches[
          index
        ];

      localStorage.setItem(
        ACTIVE_MATCH_KEY,
        JSON.stringify(
          activeMatch
        )
      );

      renderActiveMatch();

      await loadAwayPlayersForMatch(
        activeMatch
      );

      channel.postMessage({
        type:
          "matchUpdate",

        match:
          activeMatch
      });

      persistPenaltyClockState();
    }
  );
}


/* =========================================================
   HJEMMESPILLERE
========================================================= */

async function loadPlayers() {
  try {
    const response =
      await fetch(
        "../data/players.json",
        {
          cache:
            "no-store"
        }
      );

    if (
      !response.ok
    ) {
      throw new Error(
        `HTTP ${response.status}`
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
        "players.json må inneholde en liste."
      );
    }

    players =
      data;

    renderPlayers();

  } catch (error) {
    console.error(
      "Kunne ikke laste players.json:",
      error
    );

    players =
      [];

    renderPlayers();
  }
}


function renderPlayers() {
  if (
    homeGoalPlayersContainer
  ) {
    homeGoalPlayersContainer.innerHTML =
      "";
  }

  if (
    homeGoalAssistSelect
  ) {
    homeGoalAssistSelect.innerHTML =
      '<option value="">Ingen assist</option>';
  }

  if (
    penaltyHomePlayerSelect
  ) {
    penaltyHomePlayerSelect.innerHTML =
      '<option value="">Velg spiller</option>';
  }

  if (
    bestHomePlayerSelect
  ) {
    bestHomePlayerSelect.innerHTML =
      '<option value="">Velg spiller …</option>';
  }

  players.forEach(
    (
      player,
      index
    ) => {
      if (
        homeGoalPlayersContainer
      ) {
        const goalButton =
          document.createElement(
            "button"
          );

        goalButton.type =
          "button";

        goalButton.className =
          "player-button";

        goalButton.innerHTML = `
          <span class="player-number">${player.number}</span>
          <span class="player-name">${player.name}</span>
        `;

        goalButton.addEventListener(
          "click",
          () => {
            selectedHomeGoalPlayer =
              player;

            homeGoalPlayersContainer
              .querySelectorAll(
                ".player-button"
              )
              .forEach(
                (button) => {
                  button.classList.toggle(
                    "selected-player",
                    button === goalButton
                  );
                }
              );

            if (
              homeGoalSelectionStatus
            ) {
              homeGoalSelectionStatus.textContent =
                `Målscorer: #${player.number} ${player.name}`;
            }
          }
        );

        homeGoalPlayersContainer.appendChild(
          goalButton
        );
      }

      if (
        homeGoalAssistSelect
      ) {
        const assistOption =
          document.createElement(
            "option"
          );

        assistOption.value =
          index;

        assistOption.textContent =
          `#${player.number} ${player.name}`;

        homeGoalAssistSelect.appendChild(
          assistOption
        );
      }

      if (
        penaltyHomePlayerSelect
      ) {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          index;

        option.textContent =
          `#${player.number} ${player.name}`;

        penaltyHomePlayerSelect.appendChild(
          option
        );
      }

      if (
        bestHomePlayerSelect
      ) {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          index;

        option.textContent =
          `#${player.number} ${player.name}`;

        bestHomePlayerSelect.appendChild(
          option
        );
      }
    }
  );

  refreshPenaltyClockSelectors();
}


/* =========================================================
   UMIDDELBAR MÅLFEIRING
========================================================= */

if (
  showGoalCelebrationButton
) {
  showGoalCelebrationButton.addEventListener(
    "click",
    () => {
      goalCelebrationRunning =
        !goalCelebrationRunning;

      showGoalCelebrationButton.classList.toggle(
        "running",
        goalCelebrationRunning
      );

      channel.postMessage({
        type:
          goalCelebrationRunning
            ? "goalCelebrationStart"
            : "goalCelebrationStop",

        match:
          activeMatch
      });
    }
  );
}


/* =========================================================
   HJEMMEMÅL – MÅLSCORER OG ASSIST
========================================================= */

function resetHomeGoalSelection() {
  selectedHomeGoalPlayer =
    null;

  if (
    homeGoalPlayersContainer
  ) {
    homeGoalPlayersContainer
      .querySelectorAll(
        ".player-button"
      )
      .forEach(
        (button) => {
          button.classList.remove(
            "selected-player"
          );
        }
      );
  }

  if (
    homeGoalAssistSelect
  ) {
    homeGoalAssistSelect.value =
      "";
  }

  if (
    homeGoalSelectionStatus
  ) {
    homeGoalSelectionStatus.textContent =
      "Velg målscorer";
  }
}


if (
  showHomeGoalButton
) {
  showHomeGoalButton.addEventListener(
    "click",
    () => {
      if (
        homeGoalRunning
      ) {
        homeGoalRunning =
          false;

        showHomeGoalButton.textContent =
          "VIS MÅLSCORER";

        showHomeGoalButton.classList.remove(
          "running"
        );

        resetHomeGoalSelection();

        channel.postMessage({
          type:
            "goalHomeStop"
        });

        return;
      }

      if (
        !selectedHomeGoalPlayer
      ) {
        alert(
          "Velg målscorer for hjemmelaget."
        );

        return;
      }

      const assistIndex =
        homeGoalAssistSelect
          ? homeGoalAssistSelect.value
          : "";

      const assist =
        assistIndex === ""
          ? null
          : players[
              Number(
                assistIndex
              )
            ] || null;

      if (
        assist ===
        selectedHomeGoalPlayer
      ) {
        alert(
          "Målscorer og assist kan ikke være samme spiller."
        );

        return;
      }

      homeGoalRunning =
        true;

      showHomeGoalButton.textContent =
        "STOPP MÅLVISNING";

      showHomeGoalButton.classList.add(
        "running"
      );

      channel.postMessage({
        type:
          "goalHome",

        scorer:
          selectedHomeGoalPlayer,

        assist,

        match:
          activeMatch
      });
    }
  );
}


/* =========================================================
   BORTEMÅL
========================================================= */

if (
  showAwayGoalButton
) {
  showAwayGoalButton.addEventListener(
    "click",
    () => {
      let scorer =
        null;

      let assist =
        null;

      const number =
        awayGoalNumberInput
          ? awayGoalNumberInput.value.trim()
          : "";

      const name =
        awayGoalNameInput
          ? awayGoalNameInput.value.trim()
          : "";

      const assistNumber =
        awayAssistNumberInput
          ? awayAssistNumberInput.value.trim()
          : "";

      const assistName =
        awayAssistNameInput
          ? awayAssistNameInput.value.trim()
          : "";

      if (!number) {
        alert(
          "Skriv inn draktnummer på målscorer."
        );

        return;
      }

      if (
        awayPlayersLoaded
      ) {
        scorer =
          findAwayPlayerByNumber(
            number
          );

        if (!scorer) {
          alert(
            `Fant ikke spiller #${number} i bortelagets lagoppstilling.`
          );

          return;
        }

        if (assistNumber) {
          assist =
            findAwayPlayerByNumber(
              assistNumber
            );

          if (!assist) {
            alert(
              `Fant ikke assist #${assistNumber} i bortelagets lagoppstilling.`
            );

            return;
          }
        }

      } else {

        scorer = {
          number,
          name
        };

        if (
          assistNumber ||
          assistName
        ) {
          assist = {
            number:
              assistNumber,

            name:
              assistName
          };
        }
      }

      channel.postMessage({
        type:
          "goalAway",

        scorer,
        assist,

        match:
          activeMatch
      });

      if (
        awayGoalPlayerSelect
      ) {
        awayGoalPlayerSelect.value =
          "";
      }

      if (
        awayGoalAssistSelect
      ) {
        awayGoalAssistSelect.value =
          "";
      }

      if (
        awayGoalNumberInput
      ) {
        awayGoalNumberInput.value =
          "";
      }

      if (
        awayGoalNameInput
      ) {
        awayGoalNameInput.value =
          "";
      }

      if (
        awayAssistNumberInput
      ) {
        awayAssistNumberInput.value =
          "";
      }

      if (
        awayAssistNameInput
      ) {
        awayAssistNameInput.value =
          "";
      }
    }
  );
}


if (
  awayGoalNumberInput
) {
  awayGoalNumberInput.addEventListener(
    "input",
    () =>
      syncAwayGoalNameFromNumber(
        awayGoalNumberInput,
        awayGoalNameInput
      )
  );
}


if (
  awayAssistNumberInput
) {
  awayAssistNumberInput.addEventListener(
    "input",
    () =>
      syncAwayGoalNameFromNumber(
        awayAssistNumberInput,
        awayAssistNameInput
      )
  );
}


/* =========================================================
   UTVISNING – PRESENTASJON
========================================================= */

function getPenaltyTeam() {
  const selected =
    document.querySelector(
      'input[name="penaltyTeam"]:checked'
    );

  if (
    selected
  ) {
    return selected.value;
  }

  const legacy =
    document.getElementById(
      "penaltyTeam"
    );

  return legacy
    ? legacy.value
    : "home";
}


function updatePenaltyControls() {
  if (
    !penaltyHomeControls ||
    !penaltyAwayControls
  ) {
    return;
  }

  const team =
    getPenaltyTeam();

  if (
    team === "home"
  ) {
    penaltyHomeControls.style.display =
      "flex";

    penaltyAwayControls.style.display =
      "none";

  } else {
    penaltyHomeControls.style.display =
      "none";

    penaltyAwayControls.style.display =
      "flex";
  }
}


document
  .querySelectorAll(
    'input[name="penaltyTeam"]'
  )
  .forEach(
    (radio) => {
      radio.addEventListener(
        "change",
        updatePenaltyControls
      );
    }
  );


const legacyPenaltyTeam =
  document.getElementById(
    "penaltyTeam"
  );

if (
  legacyPenaltyTeam
) {
  legacyPenaltyTeam.addEventListener(
    "change",
    updatePenaltyControls
  );
}


if (
  showPenaltyButton
) {
  showPenaltyButton.addEventListener(
    "click",
    () => {
      if (
        !activeMatch
      ) {
        alert(
          "Aktiver en kamp først."
        );

        return;
      }

      const team =
        getPenaltyTeam();

      let player =
        null;

      if (
        team === "home"
      ) {
        const index =
          Number(
            penaltyHomePlayerSelect
              ? penaltyHomePlayerSelect.value
              : NaN
          );

        if (
          Number.isNaN(
            index
          ) ||
          !players[
            index
          ]
        ) {
          alert(
            "Velg spiller."
          );

          return;
        }

        player =
          players[
            index
          ];

      } else {
        const number =
          penaltyAwayNumberInput
            ? penaltyAwayNumberInput.value.trim()
            : "";

        const name =
          penaltyAwayNameInput
            ? penaltyAwayNameInput.value.trim()
            : "";

        if (!number) {
          alert(
            "Skriv inn draktnummer."
          );

          return;
        }

        player = {
          number,
          name
        };
      }

      channel.postMessage({
        type:
          "penalty",

        team,
        player,

        match:
          activeMatch
      });

      if (
        penaltyHomePlayerSelect
      ) {
        penaltyHomePlayerSelect.value =
          "";
      }

      if (
        penaltyAwayNumberInput
      ) {
        penaltyAwayNumberInput.value =
          "";
      }

      if (
        penaltyAwayNameInput
      ) {
        penaltyAwayNameInput.value =
          "";
      }
    }
  );
}


/* =========================================================
   UTVISNINGSKLOKKER – UI
========================================================= */

function installPenaltyClocks() {
  if (
    document.getElementById(
      "operatorPenaltyClocks"
    )
  ) {
    return;
  }

  const workspace =
    document.querySelector(
      ".operator-live-workspace"
    );

  if (!workspace) {
    return;
  }

  const preview =
    workspace.querySelector(
      ".live-preview-panel"
    );

  let rightStack =
    workspace.querySelector(
      ".arena-kube-right-stack"
    );

  if (!rightStack) {
    rightStack =
      document.createElement(
        "div"
      );

    rightStack.className =
      "arena-kube-right-stack";

    workspace.appendChild(
      rightStack
    );
  }

  if (
    preview &&
    preview.parentElement !==
      rightStack
  ) {
    rightStack.appendChild(
      preview
    );
  }

  const panel =
    document.createElement(
      "section"
    );

  panel.id =
    "operatorPenaltyClocks";

  panel.innerHTML = `
    <div class="penalty-clock-title">
      UTVISNINGSKLOKKER
    </div>

    <div id="operatorPenaltyGrid">
      ${createPenaltyTeamMarkup("home")}
      ${createPenaltyTeamMarkup("away")}
    </div>
  `;

  rightStack.appendChild(
    panel
  );

  bindPenaltyClockButtons();

  refreshPenaltyClockSelectors();

  renderPenaltyClockTeamHeadings();

  renderPenaltyClocks();
}


function createPenaltyTeamMarkup(
  team
) {
  return `
    <div data-penalty-team="${team}">
      <div data-penalty-team-heading="${team}">
        ${team === "home" ? "HJEMME" : "BORTE"}
      </div>

      <div data-penalty-slots="${team}">
        ${Array.from(
          {
            length:
              PENALTY_SLOT_COUNT
          },
          (
            _,
            index
          ) =>
            createPenaltySlotMarkup(
              team,
              index
            )
        ).join("")}
      </div>
    </div>
  `;
}


function createPenaltySlotMarkup(
  team,
  index
) {
  return `
    <div
      data-penalty-slot
      data-team="${team}"
      data-index="${index}"
    >
      <input
        data-penalty-player-manual
        data-team="${team}"
        data-index="${index}"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="3"
        aria-label="Spillernummer"
        placeholder="NR."
      >

      <select
        data-penalty-duration
        data-team="${team}"
        data-index="${index}"
      >
        <option value="2">2 min</option>
        <option value="4">4 min</option>
        <option value="10">10 min</option>
      </select>

      <div data-penalty-player-label>
        Ingen utvisning
      </div>

      <div class="penalty-clock-button-row">
        <button
          type="button"
          data-penalty-start
          data-team="${team}"
          data-index="${index}"
        >
          START
        </button>

        <button
          type="button"
          data-penalty-clear
          data-team="${team}"
          data-index="${index}"
        >
          FJERN
        </button>
      </div>
    </div>
  `;
}


function renderPenaltyClockTeamHeadings() {
  const match =
    activeMatch ||
    getStoredActiveMatch();

  const homeHeading =
    document.querySelector(
      '[data-penalty-team-heading="home"]'
    );

  const awayHeading =
    document.querySelector(
      '[data-penalty-team-heading="away"]'
    );

  if (
    homeHeading
  ) {
    homeHeading.textContent =
      match &&
      match.homeTeam
        ? match.homeTeam
        : "HJEMME";
  }

  if (
    awayHeading
  ) {
    awayHeading.textContent =
      match &&
      match.awayTeam
        ? match.awayTeam
        : "BORTE";
  }
}


function fillPenaltyClockSelect(
  select,
  list
) {
  if (
    !select
  ) {
    return;
  }

  const oldValue =
    select.value;

  select.innerHTML =
    '<option value="">Velg spiller …</option>';

  sortPlayersByNumber(
    list
  ).forEach(
    (player) => {
      const option =
        document.createElement(
          "option"
        );

      option.value =
        JSON.stringify({
          number:
            player.number,

          name:
            player.name ||
            ""
        });

      option.textContent =
        `#${player.number} ${player.name || ""}`.trim();

      select.appendChild(
        option
      );
    }
  );

  if (
    Array.from(
      select.options
    ).some(
      (option) =>
        option.value ===
        oldValue
    )
  ) {
    select.value =
      oldValue;
  }
}


function refreshPenaltyClockSelectors() {
  /* Nummerfeltene krever ingen oppbygging. Hjemmenavn slås
     opp i players.json når START trykkes; borte bruker nummer. */
}


function readPenaltyClockPlayer(
  team,
  index
) {
  const manual =
    document.querySelector(
      `[data-penalty-player-manual][data-team="${team}"][data-index="${index}"]`
    );

  const manualText =
    manual &&
    !manual.hidden
      ? String(manual.value).trim()
      : "";

  if (
    !manualText
  ) {
    return null;
  }

  const homePlayer =
    team === "home"
      ? players.find(
          (player) =>
            String(player.number) ===
              manualText
        )
      : null;

  if (
    team === "home" &&
    !homePlayer
  ) {
    return null;
  }

  return {
    number:
      manualText,

    name:
      homePlayer &&
      homePlayer.name
        ? homePlayer.name
        : ""
  };
}


function getPenaltyDurationMinutes(
  team,
  index
) {
  const select =
    document.querySelector(
      `[data-penalty-duration][data-team="${team}"][data-index="${index}"]`
    );

  const minutes =
    Number(
      select
        ? select.value
        : PENALTY_DEFAULT_MINUTES
    );

  return [
    2,
    4,
    10
  ].includes(
    minutes
  )
    ? minutes
    : PENALTY_DEFAULT_MINUTES;
}


function startPenaltyClock(
  team,
  index
) {
  const player =
    readPenaltyClockPlayer(
      team,
      index
    );

  if (!player) {
    alert(
      "Velg eller skriv inn utvist spiller først."
    );

    return;
  }

  const durationMinutes =
    getPenaltyDurationMinutes(
      team,
      index
    );

  const durationMs =
    durationMinutes *
    60 *
    1000;

  penaltyClockState[
    team
  ][index] = {
    active:
      true,

    playerNumber:
      String(
        player.number ||
        ""
      ),

    playerName:
      player.name ||
      "",

    durationMinutes,

    durationMs,

    remainingMs:
      durationMs,

    lastUpdatedAt:
      Date.now()
  };

  persistPenaltyClockState();

  renderPenaltyClocks();
}


function clearPenaltyClock(
  team,
  index
) {
  penaltyClockState[
    team
  ][index] =
    createEmptyPenaltySlot();

  persistPenaltyClockState();

  const select =
    document.querySelector(
      `[data-penalty-player-select][data-team="${team}"][data-index="${index}"]`
    );

  const manual =
    document.querySelector(
      `[data-penalty-player-manual][data-team="${team}"][data-index="${index}"]`
    );

  const duration =
    document.querySelector(
      `[data-penalty-duration][data-team="${team}"][data-index="${index}"]`
    );

  if (
    select
  ) {
    select.value =
      "";
  }

  if (
    manual
  ) {
    manual.value =
      "";
  }

  if (
    duration
  ) {
    duration.value =
      String(
        PENALTY_DEFAULT_MINUTES
      );
  }

  renderPenaltyClocks();
}


function bindPenaltyClockButtons() {
  document
    .querySelectorAll(
      "[data-penalty-start]"
    )
    .forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            startPenaltyClock(
              button.dataset.team,
              Number(
                button.dataset.index
              )
            );
          }
        );
      }
    );

  document
    .querySelectorAll(
      "[data-penalty-clear]"
    )
    .forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            clearPenaltyClock(
              button.dataset.team,
              Number(
                button.dataset.index
              )
            );
          }
        );
      }
    );

  document
    .querySelectorAll(
      "[data-penalty-duration]"
    )
    .forEach(
      (select) => {
        select.addEventListener(
          "change",
          () => {
            const team =
              select.dataset.team;

            const index =
              Number(
                select.dataset.index
              );

            const slot =
              penaltyClockState[
                team
              ][index];

            if (
              !slot.active
            ) {
              const minutes =
                getPenaltyDurationMinutes(
                  team,
                  index
                );

              slot.durationMinutes =
                minutes;

              slot.durationMs =
                minutes *
                60 *
                1000;

              slot.remainingMs =
                slot.durationMs;

              persistPenaltyClockState();

              renderPenaltyClocks();
            }
          }
        );
      }
    );
}


function renderPenaltyClocks() {
  [
    "home",
    "away"
  ].forEach(
    (team) => {
      penaltyClockState[
        team
      ].forEach(
        (
          slot,
          index
        ) => {
          const wrapper =
            document.querySelector(
              `[data-penalty-slot][data-team="${team}"][data-index="${index}"]`
            );

          const time =
            document.querySelector(
              `[data-penalty-time][data-team="${team}"][data-index="${index}"]`
            ) ||
            wrapper
              ? wrapper &&
                wrapper.querySelector(
                  "[data-penalty-time]"
                )
              : null;

          const label =
            wrapper
              ? wrapper.querySelector(
                  "[data-penalty-player-label]"
                )
              : null;

          const durationSelect =
            document.querySelector(
              `[data-penalty-duration][data-team="${team}"][data-index="${index}"]`
            );

          const numberInput =
            document.querySelector(
              `[data-penalty-player-manual][data-team="${team}"][data-index="${index}"]`
            );

          const startButton =
            document.querySelector(
              `[data-penalty-start][data-team="${team}"][data-index="${index}"]`
            );

          if (
            wrapper
          ) {
            wrapper.classList.toggle(
              "active",
              slot.active
            );
          }

          if (
            time
          ) {
            time.textContent =
              formatClock(
                slot.active
                  ? slot.remainingMs
                  : slot.durationMs
              );
          }

          if (
            label
          ) {
            if (
              slot.active
            ) {
              label.textContent =
                (
                  slot.playerNumber
                    ? `#${slot.playerNumber}`
                    : ""
                ) +
                (
                  slot.playerName
                    ? ` ${slot.playerName}`
                    : ""
                );

            } else {
              label.textContent =
                "Ingen utvisning";
            }
          }

          if (
            durationSelect &&
            !slot.active
          ) {
            durationSelect.value =
              String(
                slot.durationMinutes ||
                PENALTY_DEFAULT_MINUTES
              );
          }

          if (
            durationSelect
          ) {
            durationSelect.disabled =
              slot.active;
          }

          if (
            numberInput
          ) {
            numberInput.disabled =
              slot.active;
          }

          if (
            startButton
          ) {
            startButton.textContent =
              slot.active
                ? formatClock(
                    slot.remainingMs
                  )
                : "START";

            startButton.disabled =
              slot.active;
          }
        }
      );
    }
  );
}


/* =========================================================
   BANENS BESTE HJEMME
========================================================= */

function bindBestHomeButton() {
  if (
    !showBestHomeButton ||
    showBestHomeButton.dataset.bound ===
      "true"
  ) {
    return;
  }

  showBestHomeButton.dataset.bound =
    "true";

  showBestHomeButton.addEventListener(
    "click",
    () => {
      const index =
        Number(
          bestHomePlayerSelect
            ? bestHomePlayerSelect.value
            : NaN
        );

      if (
        Number.isNaN(
          index
        ) ||
        !players[
          index
        ]
      ) {
        alert(
          "Velg spiller."
        );

        return;
      }

      const player =
        players[
          index
        ];

      channel.postMessage({
        type:
          "bestPlayerHome",

        player: {
          number:
            player.number,

          name:
            player.name,

          image:
            player.image
        }
      });
    }
  );
}


/* =========================================================
   BANENS BESTE BORTE
========================================================= */

if (
  showBestAwayButton
) {
  showBestAwayButton.addEventListener(
    "click",
    () => {
      let player =
        null;

      if (
        awayPlayersLoaded
      ) {
        player =
          getAwayPlayerFromSelect(
            bestAwayPlayerSelect
          );

        if (!player) {
          alert(
            "Velg bortespiller."
          );

          return;
        }

      } else {
        const number =
          bestAwayNumberInput
            ? bestAwayNumberInput.value.trim()
            : "";

        if (!number) {
          alert(
            "Skriv inn spillernummer."
          );

          return;
        }

        player = {
          number,
          name:
            ""
        };
      }

      channel.postMessage({
        type:
          "bestPlayerAway",

        number:
          player.number,

        player,

        match:
          activeMatch
      });

      if (
        bestAwayPlayerSelect
      ) {
        bestAwayPlayerSelect.value =
          "";
      }

      if (
        bestAwayNumberInput
      ) {
        bestAwayNumberInput.value =
          "";
      }
    }
  );
}


/* =========================================================
   HOVEDKONTROLLER
========================================================= */

if (
  showGameButton
) {
  showGameButton.addEventListener(
    "click",
    () => {
      channel.postMessage({
        type:
          "game",

        match:
          activeMatch
      });
    }
  );
}


if (
  showSponsorsButton
) {
  showSponsorsButton.addEventListener(
    "click",
    () => {
      channel.postMessage({
        type:
          "sponsors"
      });
    }
  );
}


if (
  showMessageButton
) {
  showMessageButton.addEventListener(
    "click",
    () => {
      let text =
        messageInput
          ? messageInput.value.trim()
          : "";

      if (
        !text
      ) {
        text =
          prompt(
            "Skriv meldingen som skal vises:"
          ) ||
          "";
      }

      text =
        text.trim();

      if (
        !text
      ) {
        return;
      }

      channel.postMessage({
        type:
          "message",

        text
      });

      if (
        messageInput
      ) {
        messageInput.value =
          "";
      }
    }
  );
}


if (
  stopAudioButton
) {
  stopAudioButton.addEventListener(
    "click",
    () => {
      channel.postMessage({
        type:
          "stopAudio"
      });

    }
  );
}


if (
  clearDisplayButton
) {
  clearDisplayButton.addEventListener(
    "click",
    () => {
      channel.postMessage({
        type:
          "clear"
      });
    }
  );
}


/* =========================================================
   PREFLIGHT – STATUS
========================================================= */

function setPreflightItem(
  id,
  state,
  text
) {
  const element =
    document.getElementById(
      id
    );

  if (!element) {
    return;
  }

  element.classList.remove(
    "neutral",
    "checking",
    "ok",
    "success",
    "fail",
    "error"
  );

  element.classList.add(
    state
  );

  const icon =
    element.querySelector(
      ".preflight-icon"
    );

  const status =
    element.querySelector(
      "strong"
    );

  if (
    icon
  ) {
    if (
      state === "ok" ||
      state === "success"
    ) {
      icon.textContent =
        "✓";

    } else if (
      state === "fail" ||
      state === "error"
    ) {
      icon.textContent =
        "✕";

    } else if (
      state === "checking"
    ) {
      icon.textContent =
        "…";

    } else {
      icon.textContent =
        "●";
    }
  }

  if (
    status
  ) {
    status.textContent =
      text;
  }
}


function setOverall(
  state,
  text
) {
  if (
    !preflightOverall
  ) {
    return;
  }

  preflightOverall.classList.remove(
    "neutral",
    "checking",
    "ok",
    "success",
    "fail",
    "error"
  );

  preflightOverall.classList.add(
    state
  );

  preflightOverall.textContent =
    text;
}


function setConnectionStatus(
  connected,
  text
) {
  if (
    !connectionStatus
  ) {
    return;
  }

  connectionStatus.textContent =
    text;

  connectionStatus.classList.toggle(
    "connected",
    connected
  );
}


function resetPreflight() {
  setOverall(
    "checking",
    "TESTER …"
  );

  setConnectionStatus(
    false,
    "TESTER DISPLAY …"
  );

  PREFLIGHT_CHECK_IDS.forEach(
    (id) => {
      setPreflightItem(
        id,
        "checking",
        "Tester …"
      );
    }
  );
}


/* =========================================================
   PREFLIGHT – FILTEST
========================================================= */

async function testUrl(
  url
) {
  if (!url) {
    return false;
  }

  try {
    const response =
      await fetch(
        url,
        {
          cache:
            "no-store"
        }
      );

    return (
      response.ok
    );

  } catch (error) {
    return false;
  }
}


async function testJsonArray(
  url
) {
  try {
    const response =
      await fetch(
        url,
        {
          cache:
            "no-store"
        }
      );

    if (
      !response.ok
    ) {
      return {
        ok:
          false,

        count:
          0
      };
    }

    const data =
      await response.json();

    return {
      ok:
        Array.isArray(
          data
        ),

      count:
        Array.isArray(
          data
        )
          ? data.length
          : 0
    };

  } catch (error) {
    return {
      ok:
        false,

      count:
        0
    };
  }
}


/* =========================================================
   PREFLIGHT – DISPLAY
========================================================= */

channel.addEventListener(
  "message",
  (event) => {
    const data =
      event.data;

    if (
      !data ||
      !data.type
    ) {
      return;
    }

    if (
      data.type ===
        "preflightPong"
    ) {
      if (
        displayPingTimer
      ) {
        clearTimeout(
          displayPingTimer
        );

        displayPingTimer =
          null;
      }

      if (
        displayPingResolver
      ) {
        const resolve =
          displayPingResolver;

        displayPingResolver =
          null;

        resolve(
          true
        );
      }

      return;
    }

    if (
      data.type ===
        "preflightAudioResult" &&
      displayAudioResolver &&
      (
        !displayAudioRequestId ||
        data.requestId ===
          displayAudioRequestId
      )
    ) {
      if (
        displayAudioTimer
      ) {
        clearTimeout(
          displayAudioTimer
        );

        displayAudioTimer =
          null;
      }

      const resolve =
        displayAudioResolver;

      displayAudioResolver =
        null;

      displayAudioRequestId =
        null;

      resolve({
        ok:
          Boolean(
            data.ok
          ),

        alreadyEnabled:
          Boolean(
            data.alreadyEnabled
          ),

        message:
          data.message ||
          ""
      });

      return;
    }

    if (
      data.type ===
        "timeoutFinished"
    ) {
      localStorage.removeItem(
        TIMEOUT_KEY
      );

      renderArenaTimeoutControl();
    }

    if (
      data.type ===
        "goalCelebrationFinished"
    ) {
      goalCelebrationRunning =
        false;

      if (
        showGoalCelebrationButton
      ) {
        showGoalCelebrationButton.classList.remove(
          "running"
        );
      }
    }

    if (
      data.type ===
        "goalHomeFinished"
    ) {
      homeGoalRunning =
        false;

      if (
        showHomeGoalButton
      ) {
        showHomeGoalButton.textContent =
          "VIS MÅLSCORER";

        showHomeGoalButton.classList.remove(
          "running"
        );
      }

      resetHomeGoalSelection();
    }
  }
);


function pingDisplay() {
  return new Promise(
    (resolve) => {
      if (
        displayPingTimer
      ) {
        clearTimeout(
          displayPingTimer
        );
      }

      displayPingResolver =
        resolve;

      channel.postMessage({
        type:
          "preflightPing",

        sentAt:
          Date.now()
      });

      displayPingTimer =
        setTimeout(
          () => {
            if (
              displayPingResolver
            ) {
              const resolver =
                displayPingResolver;

              displayPingResolver =
                null;

              displayPingTimer =
                null;

              resolver(
                false
              );
            }
          },
          1800
        );
    }
  );
}


function testDisplayAudio() {
  return new Promise(
    (resolve) => {
      if (
        displayAudioTimer
      ) {
        clearTimeout(
          displayAudioTimer
        );
      }

      const requestId =
        `audio-${Date.now()}-${Math.random()}`;

      displayAudioRequestId =
        requestId;

      displayAudioResolver =
        resolve;

      channel.postMessage({
        type:
          "preflightAudioTest",

        requestId
      });

      displayAudioTimer =
        setTimeout(
          () => {
            if (
              displayAudioResolver
            ) {
              const resolver =
                displayAudioResolver;

              displayAudioResolver =
                null;

              displayAudioRequestId =
                null;

              displayAudioTimer =
                null;

              resolver({
                ok:
                  false,

                alreadyEnabled:
                  false,

                message:
                  "Ingen lydrespons"
              });
            }
          },
          3000
        );
    }
  );
}


/* =========================================================
   PREFLIGHT – FULL KAMPKLAR-SJEKK
========================================================= */

async function runPreflight() {
  resetPreflight();

  if (
    preflightButton
  ) {
    preflightButton.disabled =
      true;
  }

  const results =
    [];

  try {
    activeMatch =
      activeMatch ||
      getStoredActiveMatch();

    const matchOk =
      Boolean(
        activeMatch &&
        activeMatch.homeTeam &&
        activeMatch.awayTeam
      );

    results.push(
      matchOk
    );

    setPreflightItem(
      "checkMatch",
      matchOk
        ? "ok"
        : "fail",
      matchOk
        ? `${activeMatch.homeTeam} – ${activeMatch.awayTeam}`
        : "Ingen aktiv kamp"
    );

    const [
      playersResult,
      sponsorsResult
    ] =
      await Promise.all([
        testJsonArray(
          "../data/players.json"
        ),

        testJsonArray(
          "../data/sponsors.json"
        )
      ]);

    results.push(
      playersResult.ok
    );

    results.push(
      sponsorsResult.ok
    );

    setPreflightItem(
      "checkPlayers",
      playersResult.ok
        ? "ok"
        : "fail",
      playersResult.ok
        ? `${playersResult.count} spillere`
        : "Kunne ikke laste"
    );

    setPreflightItem(
      "checkSponsors",
      sponsorsResult.ok
        ? "ok"
        : "fail",
      sponsorsResult.ok
        ? `${sponsorsResult.count} sponsorer`
        : "Kunne ikke laste"
    );

    let homeLogoOk =
      false;

    let awayLogoOk =
      false;

    if (
      activeMatch
    ) {
      [
        homeLogoOk,
        awayLogoOk
      ] =
        await Promise.all([
          testUrl(
            activeMatch.homeLogo
          ),

          testUrl(
            activeMatch.awayLogo
          )
        ]);
    }

    results.push(
      homeLogoOk
    );

    results.push(
      awayLogoOk
    );

    setPreflightItem(
      "checkHomeLogo",
      homeLogoOk
        ? "ok"
        : "fail",
      homeLogoOk
        ? "OK"
        : "Mangler / kan ikke lastes"
    );

    setPreflightItem(
      "checkAwayLogo",
      awayLogoOk
        ? "ok"
        : "fail",
      awayLogoOk
        ? "OK"
        : "Mangler / kan ikke lastes"
    );

    const [
      bestAudioOk,
      homeGoalAudioOk,
      penaltyAudioOk,
      entranceVideoOk,
      entranceAudioOk
    ] =
      await Promise.all([
        testUrl(
          "../audio/best-player.mp3"
        ),

        testUrl(
          "../audio/goal-home.mp3"
        ),


        testUrl(
          "../audio/penalty.mp3"
        ),

        testUrl(
          ENTRANCE_VIDEO_URL
        ),

        testUrl(
          ENTRANCE_AUDIO_URL
        )
      ]);

    results.push(
      bestAudioOk,
      homeGoalAudioOk,
      penaltyAudioOk,
      entranceVideoOk,
      entranceAudioOk
    );

    setPreflightItem(
      "checkBestAudio",
      bestAudioOk
        ? "ok"
        : "fail",
      bestAudioOk
        ? "OK"
        : "Mangler"
    );

    setPreflightItem(
      "checkHomeGoalAudio",
      homeGoalAudioOk
        ? "ok"
        : "fail",
      homeGoalAudioOk
        ? "OK"
        : "Mangler"
    );


    setPreflightItem(
      "checkPenaltyAudio",
      penaltyAudioOk
        ? "ok"
        : "fail",
      penaltyAudioOk
        ? "OK"
        : "Mangler"
    );

    setPreflightItem(
      "checkEntranceVideo",
      entranceVideoOk &&
      entranceAudioOk
        ? "ok"
        : "fail",
      entranceVideoOk &&
      entranceAudioOk
        ? "Video + lyd funnet"
        : "Video eller lyd mangler"
    );

    let awayRosterPreflightOk =
      true;

    if (
      activeMatch
    ) {
      const url =
        getAwayPlayersUrl(
          activeMatch
        );

      if (
        awayPlayersLoaded
      ) {
        setPreflightItem(
          "checkAwayPlayers",
          "ok",
          `${awayPlayers.length} spillere`
        );

      } else if (
        awayPlayersExplicit
      ) {
        awayRosterPreflightOk =
          false;

        setPreflightItem(
          "checkAwayPlayers",
          "fail",
          "Oppgitt fil mangler"
        );

      } else {
        setPreflightItem(
          "checkAwayPlayers",
          "ok",
          url
            ? "Manuell fallback"
            : "Ikke konfigurert"
        );
      }

    } else {
      setPreflightItem(
        "checkAwayPlayers",
        "ok",
        "Ingen aktiv kamp"
      );
    }

    results.push(
      awayRosterPreflightOk
    );

    const displayOnline =
      await pingDisplay();

    if (
      !displayOnline
    ) {
      results.push(
        false
      );

      setPreflightItem(
        "checkDisplay",
        "fail",
        "Display svarer ikke"
      );

      setConnectionStatus(
        false,
        "DISPLAY SVARER IKKE"
      );

    } else {
      setConnectionStatus(
        true,
        "DISPLAY TILKOBLET – TESTER LYD"
      );

      const audioResult =
        await testDisplayAudio();

      results.push(
        audioResult.ok
      );

      if (
        audioResult.ok
      ) {
        setPreflightItem(
          "checkDisplay",
          "ok",
          audioResult.alreadyEnabled
            ? "Svar + lyd allerede aktiv"
            : "Svar + lyd aktivert"
        );

        setConnectionStatus(
          true,
          "DISPLAY + LYD KLAR"
        );

      } else {
        setPreflightItem(
          "checkDisplay",
          "fail",
          "Display svarer – aktiver lyd på display"
        );

        setConnectionStatus(
          true,
          "DISPLAY TILKOBLET – AKTIVER LYD"
        );
      }
    }

    const allOk =
      results.length ===
        PREFLIGHT_CHECK_IDS.length &&
      results.every(
        Boolean
      );

    if (
      allOk
    ) {
      setOverall(
        "ok",
        "✓ KAMPKLAR"
      );

    } else {
      setOverall(
        "fail",
        "✕ IKKE KAMPKLAR"
      );
    }

  } catch (error) {
    console.error(
      "Kampklar-sjekk feilet:",
      error
    );

    setOverall(
      "fail",
      "✕ SJEKK FEILET"
    );

  } finally {
    if (
      preflightButton
    ) {
      preflightButton.disabled =
        false;
    }
  }
}


if (
  preflightButton
) {
  preflightButton.addEventListener(
    "click",
    runPreflight
  );
}


/* =========================================================
   KLOKKE – LÅS VED SCROLL
========================================================= */

let clockPlaceholder =
  null;

let clockOriginalTop =
  0;


function updateClockOriginalPosition() {
  if (
    !operatorClockCenter
  ) {
    return;
  }

  clockOriginalTop =
    operatorClockCenter
      .getBoundingClientRect()
      .top +
    window.scrollY;
}


function updateFloatingClock() {
  if (
    !operatorClockCenter ||
    !clockPlaceholder
  ) {
    return;
  }

  const shouldFix =
    window.scrollY >
    clockOriginalTop -
    12;

  if (
    shouldFix
  ) {
    if (
      !operatorClockCenter.classList.contains(
        "clock-fixed"
      )
    ) {
      const rect =
        operatorClockCenter
          .getBoundingClientRect();

      clockPlaceholder.style.height =
        `${rect.height}px`;

      clockPlaceholder.style.width =
        `${rect.width}px`;

      clockPlaceholder.style.margin =
        "0 auto";

      clockPlaceholder.classList.add(
        "active"
      );

      operatorClockCenter.style.left =
        `${rect.left}px`;

      operatorClockCenter.style.width =
        `${rect.width}px`;

      operatorClockCenter.classList.add(
        "clock-fixed"
      );
    }

  } else {
    if (
      operatorClockCenter.classList.contains(
        "clock-fixed"
      )
    ) {
      operatorClockCenter.classList.remove(
        "clock-fixed"
      );

      operatorClockCenter.style.left =
        "";

      operatorClockCenter.style.width =
        "";

      clockPlaceholder.classList.remove(
        "active"
      );

      clockPlaceholder.style.height =
        "";

      clockPlaceholder.style.width =
        "";

      clockPlaceholder.style.margin =
        "";

      updateClockOriginalPosition();
    }
  }
}


function setupFloatingClock() {
  if (
    !operatorClockCenter
  ) {
    return;
  }

  clockPlaceholder =
    document.createElement(
      "div"
    );

  clockPlaceholder.className =
    "clock-placeholder";

  operatorClockCenter.parentNode.insertBefore(
    clockPlaceholder,
    operatorClockCenter
  );

  updateClockOriginalPosition();

  window.addEventListener(
    "scroll",
    updateFloatingClock,
    {
      passive:
        true
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        operatorClockCenter.classList.contains(
          "clock-fixed"
        )
      ) {
        operatorClockCenter.classList.remove(
          "clock-fixed"
        );

        operatorClockCenter.style.left =
          "";

        operatorClockCenter.style.width =
          "";

        clockPlaceholder.classList.remove(
          "active"
        );

        clockPlaceholder.style.height =
          "";

        clockPlaceholder.style.width =
          "";

        clockPlaceholder.style.margin =
          "";
      }

      updateClockOriginalPosition();

      updateFloatingClock();
    }
  );

  updateFloatingClock();
}


/* =========================================================
   LØPENDE OPPDATERING
========================================================= */

setInterval(
  () => {
    const now =
      Date.now();

    checkPeriodEnd();

    updatePenaltyClockState(
      false,
      now
    );

    renderScoreboard();

    renderBreakClock();

    renderPenaltyClocks();

    renderArenaTimeoutControl();
  },
  100
);


/* =========================================================
   OPPSTART
========================================================= */

installOperatorEnhancementStyles();

installAwayPlayersPreflightItem();

installBestHomeSelect();

installAwayGoalSelects();

installBestAwaySelect();

installPenaltyClocks();

installArenaTimeoutControl();

bindBestHomeButton();

updatePenaltyControls();

loadMatches();

loadPlayers();

renderScoreboard();

renderBreakClock();

renderPenaltyClocks();

persistPenaltyClockState();

setupFloatingClock();

console.log(
  "Arena Kube v2.4 – synkroniserte kamp-/utvisningsklokker og separat timeout aktivert."
);
