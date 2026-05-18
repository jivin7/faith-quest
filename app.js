const STORAGE_KEY = "faithQuestSave";

const STORIES = [
  {
    id: "noah",
    title: "NOAH'S ARK",
    subtitle: "Trust God through the storm",
    desc: "God calls Noah to build an ark and save his family. Walk through five levels of faith and obedience.",
    reward: { coins: 500, gems: 25 },
    unlockAt: 0,
    art: "linear-gradient(160deg, #1a3a5c, #0a2540)",
    cover: "noah-ark-cover.png",
    levels: [
      {
        id: 1,
        title: "God's Call",
        objective: "Choose the response that honors God.",
        type: "quiz",
        time: 120,
        reward: { coins: 80, gems: 5, xp: 100 },
        quiz: {
          q: "What did God ask Noah to build?",
          options: ["A temple", "An ark", "A tower", "A city"],
          correct: 1,
        },
      },
      {
        id: 2,
        title: "Gather the Animals",
        objective: "Answer correctly to bring the animals aboard.",
        type: "quiz",
        time: 120,
        reward: { coins: 90, gems: 5, xp: 110 },
        quiz: {
          q: "How did the animals come to Noah?",
          options: [
            "Noah hunted them",
            "God brought them two by two",
            "They were carved from wood",
            "Angels carried boxes",
          ],
          correct: 1,
        },
      },
      {
        id: 3,
        title: "Build the Ark",
        objective: "Put the steps in the right order.",
        type: "sequence",
        time: 150,
        reward: { coins: 100, gems: 8, xp: 120 },
        sequence: [
          "Hear God's instructions",
          "Gather wood and materials",
          "Build the ark with your family",
          "Enter the ark before the rain",
        ],
      },
      {
        id: 4,
        title: "The Flood",
        objective: "Stay faithful when the waters rise.",
        type: "quiz",
        time: 90,
        reward: { coins: 110, gems: 8, xp: 130 },
        quiz: {
          q: "How long did rain fall during the great flood?",
          options: ["7 days", "40 days and nights", "1 year", "3 hours"],
          correct: 1,
        },
      },
      {
        id: 5,
        title: "A New Beginning",
        objective: "Remember God's promise.",
        type: "quiz",
        time: 120,
        reward: { coins: 120, gems: 10, xp: 150 },
        quiz: {
          q: "What sign did God give as a promise never to flood the earth again?",
          options: ["A star", "A rainbow", "A dove", "Thunder"],
          correct: 1,
        },
      },
    ],
    mission: {
      thumb: "🛶",
      caption: "Obey God and build the ark.",
      sceneClass: "scene-forest",
      verse: {
        text: "By faith Noah, when warned about things not yet seen, built an ark.",
        ref: "Hebrews 11:7",
      },
      tip: "God gave Noah a mission. Stay focused and trust His plan!",
      steps: [
        { id: "call", label: "Hear God's calling", type: "auto" },
        { id: "animals", label: "Prepare the animals", type: "auto" },
        {
          id: "wood",
          label: "Collect wood",
          type: "gather",
          tool: "axe",
          target: 10,
          collectLabel: "WOOD COLLECTED",
          objective: "Gather Wood",
          actionLabel: "Chop tree 🪓",
        },
        {
          id: "build",
          label: "Build the ark",
          type: "tap",
          tool: "hammer",
          target: 8,
          collectLabel: "ARK BUILT",
          objective: "Build the Ark",
          actionLabel: "Hammer planks 🔨",
        },
        {
          id: "board",
          label: "Board before the flood",
          type: "noah_board",
          objective: "Enter the Ark",
          collectLabel: "BOARDING",
          actionLabel: "Enter the ark 🚪",
          message: "God said: Take your family and go into the ark before the flood comes!",
        },
        {
          id: "storm",
          label: "Trust through the storm",
          type: "noah_flood",
          objective: "The Great Flood",
          collectLabel: "FLOOD",
          actionLabel: "Trust God 🙏",
          message: "The rain fell forty days. Noah trusted God inside the ark.",
        },
        {
          id: "promise",
          label: "See God's promise",
          type: "noah_rainbow",
          objective: "God's Rainbow Promise",
          collectLabel: "PROMISE",
          actionLabel: "See the rainbow 🌈",
          message: "God set a rainbow in the sky — a promise to never flood the whole earth again.",
        },
      ],
      reward: { coins: 300, gems: 20, xp: 200 },
    },
  },
  {
    id: "david",
    title: "DAVID & GOLIATH",
    subtitle: "Courage against the giant",
    desc: "A young shepherd faces a giant with faith in the Lord.",
    reward: { coins: 550, gems: 30 },
    unlockAt: 3,
    art: "linear-gradient(160deg, #3d2a1a, #1a1208)",
    levels: [
      {
        id: 1,
        title: "The Challenge",
        objective: "What did David trust?",
        type: "quiz",
        time: 120,
        reward: { coins: 90, gems: 6, xp: 110 },
        quiz: {
          q: "David said the battle belongs to…",
          options: ["Saul", "The army", "The Lord", "Goliath"],
          correct: 2,
        },
      },
      {
        id: 2,
        title: "Five Stones",
        objective: "Pick the truth from Scripture.",
        type: "quiz",
        time: 120,
        reward: { coins: 100, gems: 6, xp: 120 },
        quiz: {
          q: "What weapon did David use against Goliath?",
          options: ["A sword", "A sling and stone", "A spear", "Fire"],
          correct: 1,
        },
      },
      {
        id: 3,
        title: "Victory",
        objective: "Order the events of the story.",
        type: "sequence",
        time: 150,
        reward: { coins: 120, gems: 10, xp: 140 },
        sequence: [
          "Goliath mocks Israel",
          "David offers to fight",
          "David strikes the giant",
          "Israel praises God",
        ],
      },
    ],
    mission: {
      thumb: "⚔",
      caption: "Face the giant with faith.",
      sceneClass: "scene-valley",
      verse: { text: "The battle is the Lord's.", ref: "1 Samuel 17:47" },
      tip: "David trusted God, not his own strength.",
      steps: [
        { id: "shepherd", label: "Tend the sheep", type: "auto" },
        { id: "giant", label: "Hear Goliath's challenge", type: "auto" },
        {
          id: "stones",
          label: "Choose five smooth stones",
          type: "gather",
          tool: "axe",
          target: 5,
          collectLabel: "STONES READY",
          objective: "Gather Stones",
          actionLabel: "Pick stones 🪨",
        },
        {
          id: "sling",
          label: "Ready the sling",
          type: "tap",
          tool: "sling",
          target: 5,
          collectLabel: "SLING READY",
          objective: "Practice Sling",
          actionLabel: "Swing sling 🎯",
        },
        {
          id: "battle",
          label: "Face Goliath",
          type: "fight",
          tool: "sling",
          target: 10,
          collectLabel: "GOLIATH",
          objective: "Defeat Goliath",
          actionLabel: "Sling stone 🪨",
        },
        { id: "victory", label: "Praise God", type: "confirm", objective: "Give thanks", actionLabel: "Praise God ✨" },
      ],
      reward: { coins: 280, gems: 18, xp: 180 },
    },
  },
  {
    id: "moses",
    title: "MOSES",
    subtitle: "Lead with faith",
    desc: "From the basket to the Red Sea—follow Moses' journey.",
    reward: { coins: 600, gems: 35 },
    unlockAt: 5,
    art: "linear-gradient(160deg, #2a1a3d, #0f0820)",
    levels: [
      {
        id: 1,
        title: "The Burning Bush",
        objective: "Listen to God's call.",
        type: "quiz",
        time: 120,
        reward: { coins: 85, gems: 5, xp: 100 },
        quiz: {
          q: "What did God tell Moses to do?",
          options: [
            "Build a palace",
            "Lead Israel out of Egypt",
            "Stay in Midian forever",
            "Fight Rome",
          ],
          correct: 1,
        },
      },
      {
        id: 2,
        title: "Let My People Go",
        objective: "Remember the plagues and Pharaoh.",
        type: "quiz",
        time: 120,
        reward: { coins: 95, gems: 6, xp: 110 },
        quiz: {
          q: "Who hardened his heart against letting Israel leave?",
          options: ["Moses", "Aaron", "Pharaoh", "Joshua"],
          correct: 2,
        },
      },
    ],
    mission: {
      thumb: "🔥",
      caption: "Lead God's people to freedom.",
      sceneClass: "scene-desert",
      verse: { text: "The Lord will fight for you; you need only to be still.", ref: "Exodus 14:14" },
      tip: "Moses obeyed even when it was hard.",
      steps: [
        { id: "bush", label: "Hear at the burning bush", type: "auto" },
        { id: "pharaoh", label: "Ask Pharaoh to let go", type: "auto" },
        {
          id: "staff",
          label: "Raise the staff",
          type: "gather",
          tool: "axe",
          target: 6,
          collectLabel: "FAITH RAISED",
          objective: "Lift the Staff",
          actionLabel: "Raise staff ✋",
        },
        {
          id: "sea",
          label: "Part the sea",
          type: "tap",
          tool: "hammer",
          target: 6,
          collectLabel: "PATH OPEN",
          objective: "Open the Sea",
          actionLabel: "Stretch hands 🌊",
        },
        { id: "cross", label: "Cross on dry ground", type: "confirm", objective: "Cross safely", actionLabel: "Walk forward 👣" },
        { id: "song", label: "Sing praise", type: "confirm", objective: "Give praise", actionLabel: "Sing praise 🎵" },
      ],
      reward: { coins: 320, gems: 22, xp: 190 },
    },
  },
];

const ACHIEVEMENTS = [
  { id: "first", title: "First Steps", icon: "👣", cat: "stories", check: (s) => s.totalLevels >= 1 },
  { id: "dedicated", title: "Dedicated", icon: "📖", cat: "stories", check: (s) => s.totalLevels >= 5 },
  { id: "faithful", title: "Faithful", icon: "✝", cat: "special", check: (s) => s.totalLevels >= 8 },
  { id: "noah", title: "Ark Builder", icon: "🛶", cat: "stories", check: (s) => s.storyComplete?.noah },
  { id: "david", title: "Giant Slayer", icon: "⚔", cat: "stories", check: (s) => s.storyComplete?.david },
  { id: "coins", title: "Treasurer", icon: "🪙", cat: "challenges", check: (s) => s.coins >= 1000 },
  { id: "daily", title: "Daily Light", icon: "☀", cat: "challenges", check: (s) => s.dailyLevels >= 3 },
  { id: "perfect", title: "Perfect Heart", icon: "❤", cat: "special", check: (s) => s.heartsLeft === 3 && s.lastWin },
];

const CHARACTERS = [
  {
    id: "boy",
    name: "Faith Explorer",
    price: 0,
    currency: "coins",
    sprite: "character.png",
    desc: "Your starter hero.",
    starter: true,
  },
  {
    id: "noah",
    name: "Noah",
    price: 350,
    currency: "coins",
    sprite: "noah-character.png",
    desc: "The faithful ark builder with his staff.",
  },
  {
    id: "shepherd",
    name: "Shepherd",
    price: 220,
    currency: "coins",
    sprite: "character.png",
    desc: "A brave young shepherd.",
  },
];

const VERSES = [
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "Be strong and courageous. Do not be afraid.", ref: "Joshua 1:9" },
  { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
];

let state = loadState();
let activeStoryId = "noah";
let activeLevelIndex = 0;
let gameTimer = null;
let gameTimeLeft = 0;
let hearts = 3;
let sequencePicks = [];
let achievementTab = "all";
/** Pending photo in edit modal (data URL) before save */
let pendingAvatarUrl = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function defaultState() {
  return {
    coins: 250,
    gems: 50,
    xp: 0,
    level: 1,
    username: "WARRIOR_07",
    avatarUrl: null,
    progress: { noah: 0, david: 0, moses: 0 },
    storyComplete: {},
    missionProgress: {},
    missionComplete: {},
    achievements: [],
    dailyLevels: 0,
    dailyDate: todayKey(),
    totalLevels: 0,
    heartsLeft: 3,
    lastWin: false,
    ownedCharacters: ["boy"],
    equippedCharacter: "boy",
  };
}

function migrateState(s) {
  if (!Array.isArray(s.ownedCharacters) || !s.ownedCharacters.length) {
    s.ownedCharacters = ["boy"];
  }
  if (!s.equippedCharacter || !s.ownedCharacters.includes(s.equippedCharacter)) {
    s.equippedCharacter = "boy";
  }
  return s;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = migrateState({ ...defaultState(), ...JSON.parse(raw) });
      if (s.dailyDate !== todayKey()) {
        s.dailyLevels = 0;
        s.dailyDate = todayKey();
      }
      return s;
    }
  } catch (_) {}
  return defaultState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    if (state.avatarUrl) {
      state.avatarUrl = null;
      alert("Photo was too large to save. Try a smaller image or remove the photo.");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }
}

function xpForLevel(lvl) {
  return 400 + (lvl - 1) * 100;
}

function storyUnlocked(story) {
  return state.totalLevels >= story.unlockAt;
}

function getStory(id) {
  return STORIES.find((s) => s.id === id);
}

function storyArtStyle(story) {
  if (story.cover) {
    return `background-image:url('${story.cover}');background-size:cover;background-position:center top;background-color:#0a2540;`;
  }
  return `background:${story.art};`;
}

function applyStoryCover(el, story) {
  if (!el) return;
  if (story.cover) {
    el.style.backgroundImage = `url('${story.cover}')`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center top";
    el.classList.remove("hidden");
  } else {
    el.style.backgroundImage = "";
    el.classList.add("hidden");
  }
}

function completedCount(storyId) {
  return state.progress[storyId] || 0;
}

function showView(name) {
  if (name !== "mission" && typeof JungleGame !== "undefined") JungleGame.stop();
  $$(".view").forEach((v) => v.classList.remove("active"));
  const el = document.getElementById(`view-${name}`);
  if (el) el.classList.add("active");
  document.body.classList.toggle("mission-mode", name === "mission");
  const topBar = $(".top-bar");
  if (topBar) topBar.style.display = name === "mission" ? "none" : "";
  $$(".nav-link").forEach((n) => {
    n.classList.toggle("active", n.dataset.nav === name || (name === "mission" && n.dataset.nav === "dashboard"));
  });
}

function canPlayMission(storyId) {
  const story = getStory(storyId);
  if (!story?.mission) return false;
  return completedCount(storyId) >= story.levels.length;
}

function getMissionProgress(storyId) {
  if (!state.missionProgress[storyId]) {
    state.missionProgress[storyId] = { stepIndex: 2, counter: 0 };
  }
  return state.missionProgress[storyId];
}

function getCurrentMissionStep(story) {
  const prog = getMissionProgress(story.id);
  let idx = prog.stepIndex;
  while (idx < story.mission.steps.length && story.mission.steps[idx].type === "auto") {
    idx++;
  }
  if (idx !== prog.stepIndex) {
    prog.stepIndex = idx;
    saveState();
  }
  return story.mission.steps[idx] || null;
}

function restartMission(storyId) {
  const id = storyId || activeStoryId;
  const story = getStory(id);
  if (!story?.mission) return;
  if (state.missionComplete[id] && !confirm("Replay this completed mission from the start?")) return;
  if (!state.missionComplete[id] && !confirm("Restart this mission from the beginning? Your progress on this mission will reset.")) {
    return;
  }

  if (typeof JungleGame !== "undefined") JungleGame.stop();
  state.missionComplete[id] = false;
  state.missionProgress[id] = { stepIndex: 0, counter: 0 };
  let idx = 0;
  while (idx < story.mission.steps.length && story.mission.steps[idx].type === "auto") idx += 1;
  state.missionProgress[id].stepIndex = idx;
  saveState();
  renderMission();
}

function openMission(storyId) {
  if (!canPlayMission(storyId)) {
    alert("Complete all story levels first to unlock the mission!");
    return;
  }
  activeStoryId = storyId;
  const prog = getMissionProgress(storyId);
  if (prog.stepIndex < 2) prog.stepIndex = 2;
  saveState();
  renderMission();
  showView("mission");
}

function renderMission() {
  const story = getStory(activeStoryId);
  if (!story?.mission) return;
  const m = story.mission;
  const prog = getMissionProgress(story.id);
  const step = getCurrentMissionStep(story);

  $("#mission-np-title").textContent = story.title.replace(/'/g, "'");
  $("#mission-np-caption").textContent = m.caption;
  $("#mission-np-thumb").textContent = m.thumb;
  $("#mission-energy").textContent = state.coins;
  $("#mission-player-level").textContent = state.level;
  const xpPct = Math.min(100, (state.xp / xpForLevel(state.level)) * 100);
  $("#mission-level-fill").style.width = `${xpPct}%`;
  $("#mission-sidebar-verse").textContent = VERSES[1].text;
  $("#mission-sidebar-verse-ref").textContent = VERSES[1].ref;
  $("#mission-verse-overlay").textContent = m.verse.text;
  $("#mission-tip-text").textContent = m.tip;

  applyAvatarToSlot($("#mission-avatar-initial"), $("#mission-avatar-img"), state.avatarUrl, state.username);

  const scene = $("#mission-scene");
  scene.className = `mission-scene ${m.sceneClass}`;

  const list = $("#mission-story-list");
  list.innerHTML = "";
  STORIES.forEach((s) => {
    if (!s.mission) return;
    const li = document.createElement("li");
    const unlocked = canPlayMission(s.id);
    li.className = s.id === activeStoryId ? "active" : "";
    if (!unlocked) li.classList.add("locked");
    const thumbInner = s.cover
      ? ""
      : s.mission.thumb;
    li.innerHTML = `<span class="ms-thumb${s.cover ? " ms-thumb-cover" : ""}" style="${storyArtStyle(s)}">${thumbInner}</span><span><strong>${s.title}</strong><small>${s.mission.caption}</small></span>`;
    if (unlocked) li.addEventListener("click", () => openMission(s.id));
    list.appendChild(li);
  });

  const stepsEl = $("#mission-steps");
  stepsEl.innerHTML = "";
  m.steps.forEach((st, i) => {
    const li = document.createElement("li");
    if (i < prog.stepIndex) li.classList.add("done");
    else if (i === prog.stepIndex) li.classList.add("current");
    else li.classList.add("future");
    li.textContent = st.label;
    stepsEl.appendChild(li);
  });

  renderMissionTools(m, step);
  renderMissionObjective(story, step, prog);

  if (state.missionComplete[story.id]) {
    if (typeof JungleGame !== "undefined") JungleGame.stop();
    $("#mission-objective-title").textContent = "Mission Complete!";
    $("#mission-objective-count").textContent = "✓";
    $("#mission-scene-action").classList.add("hidden");
  } else if (
    step &&
    ["gather", "tap", "confirm", "fight", "noah_board", "noah_flood", "noah_rainbow"].includes(step.type)
  ) {
    if (typeof JungleGame === "undefined" || !JungleGame.isRunning()) {
      startMissionWorld(story, step, prog);
    } else {
      syncMissionProgressHud(prog.counter || 0, step.target || 1, step);
    }
  } else {
    if (typeof JungleGame !== "undefined") JungleGame.stop();
    $("#mission-scene").classList.add("mission-scene-static");
  }
}

function syncMissionProgressHud(count, target, step) {
  $("#mission-objective-count").textContent = `${count} / ${target}`;
  $("#mission-collect-label").textContent = step.collectLabel || "PROGRESS";
  $("#mission-collect-count").textContent = `${count} / ${target}`;
  $("#mission-collect-fill").style.width = `${(count / target) * 100}%`;
}

function startMissionWorld(story, step, prog) {
  if (typeof JungleGame === "undefined") return;
  const target =
    step.target ??
    (step.type === "noah_board"
      ? 1
      : step.type === "noah_flood" || step.type === "noah_rainbow"
        ? 100
        : step.type === "confirm"
          ? 1
          : step.type === "fight"
            ? 10
            : step.type === "tap"
              ? 8
              : 10);
  const count = prog.counter || 0;
  $("#mission-scene").classList.remove("mission-scene-static");
  $("#mission-scene-action").classList.add("hidden");

  let mode = "gather";
  if (step.type === "tap") mode = "work";
  if (step.type === "confirm") mode = "interact";
  if (step.type === "fight") mode = "battle";
  if (step.type === "noah_board") mode = "noah_board";
  if (step.type === "noah_flood") mode = "noah_flood";
  if (step.type === "noah_rainbow") mode = "noah_rainbow";

  const interactIcons = {
    board: "🚪",
    storm: "🙏",
    promise: "🌈",
    battle: "⚔",
    victory: "✨",
    cross: "👣",
    song: "🎵",
  };

  const hero = getEquippedCharacter();
  JungleGame.start({
    mode,
    characterSprite: hero.sprite,
    requiredTool:
      step.tool ||
      (mode === "gather" ? "axe" : mode === "work" ? "hammer" : mode === "battle" ? "sling" : null),
    target,
    progressStart: count,
    siteLabel: step.type === "tap" ? (step.tool === "sling" ? "TARGET" : "ARK") : story.title,
    theme: step.type === "fight" || story.id === "david" ? "valley" : "jungle",
    enemyName: step.type === "fight" ? "GOLIATH" : null,
    interactIcon: interactIcons[step.id] || "🙏",
    cinematicMessage: step.message || step.objective,
    onProgress: (n, max) => {
      prog.counter = n;
      syncMissionProgressHud(n, max, step);
      saveState();
    },
    onComplete: () => {
      prog.counter = target;
      saveState();
      JungleGame.stop();
      missionAdvanceStep(story);
    },
  });
}

function renderMissionTools(mission, step) {
  if (step?.type?.startsWith("noah_")) {
    const wrap = $("#mission-tools");
    wrap.innerHTML = `<p class="tools-story-only">Follow God's plan — watch and obey.</p>`;
    return;
  }
  let tools = [
    { id: "axe", icon: "🪓", label: "Axe" },
    { id: "saw", icon: "🪚", label: "Saw" },
    { id: "rope", icon: "🪢", label: "Rope", badge: 3 },
    { id: "hammer", icon: "🔨", label: "Hammer" },
  ];
  if (step?.tool === "sling" || step?.type === "fight") {
    tools = [{ id: "sling", icon: "🎯", label: "Sling" }];
    if (step.type === "gather") {
      tools = [
        { id: "axe", icon: "🪓", label: "Axe" },
        { id: "sling", icon: "🎯", label: "Sling" },
      ];
    }
  }
  const wrap = $("#mission-tools");
  wrap.innerHTML = "";
  const activeTool = step?.tool || "axe";
  tools.forEach((t) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tool-btn${t.id === activeTool ? " active" : ""}`;
    btn.dataset.tool = t.id;
    btn.innerHTML = `<span>${t.icon}</span><small>${t.label}</small>${t.badge ? `<em>${t.badge}</em>` : ""}`;
    btn.addEventListener("click", () => {
      $$(".tool-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tip = document.getElementById("mission-tip-text");
      if (!tip || !step) return;
      if (step.type === "gather") {
        tip.textContent =
          t.id === "axe" ? "Walk to a tree and press SPACE to chop." : "Select the Axe to chop trees.";
      } else if (step.type === "tap") {
        if (step.tool === "sling") {
          tip.textContent =
            t.id === "sling" ? "Aim at the target — press SPACE to sling." : "Select the Sling to practice.";
        } else {
          tip.textContent =
            t.id === "hammer" ? "Walk to the ark and press SPACE to hammer." : "Select the Hammer to build.";
        }
      } else if (step.type === "fight") {
        tip.textContent = "Face Goliath — press SPACE to sling stones at him!";
      } else if (step.type === "noah_board") {
        tip.textContent = "Walk to the ark ramp and press SPACE to go aboard before the flood!";
      } else if (step.type === "noah_flood") {
        tip.textContent = "Watch the flood rise. Trust God — you are safe in the ark.";
      } else if (step.type === "noah_rainbow") {
        tip.textContent = "The storm is over. Look for God's rainbow promise!";
      } else if (step.type === "confirm") {
        tip.textContent = "Walk to the glowing spot and press SPACE.";
      }
    });
    wrap.appendChild(btn);
  });
}

function renderMissionObjective(story, step, prog) {
  if (!step || state.missionComplete[story.id]) return;

  $("#mission-objective-title").textContent = step.objective || step.label;
  const target = step.target || 1;
  const count = prog.counter || 0;

  if (["gather", "tap", "confirm", "fight", "noah_board", "noah_flood", "noah_rainbow"].includes(step.type)) {
    syncMissionProgressHud(count, target, step);
    $("#mission-scene-action").classList.add("hidden");
  }
}

function missionAction(story) {
  const prog = getMissionProgress(story.id);
  const step = story.mission.steps[prog.stepIndex];
  if (!step) return;

  const activeToolBtn = $(".tool-btn.active");
  const toolId = activeToolBtn?.dataset?.tool || step.tool;
  if (step.tool && toolId !== step.tool) {
    $("#mission-tip-text").textContent = `Use the ${step.tool === "hammer" ? "hammer" : "axe"} for this step!`;
    return;
  }

  prog.counter = (prog.counter || 0) + 1;
  const target = step.target || 1;

  if (prog.counter >= target) {
    missionAdvanceStep(story);
    return;
  }

  saveState();
  renderMissionObjective(story, step, prog);
  $("#mission-scene").classList.add("scene-pulse");
  setTimeout(() => $("#mission-scene").classList.remove("scene-pulse"), 200);
}

function missionAdvanceStep(story) {
  if (typeof JungleGame !== "undefined") JungleGame.stop();
  const prog = getMissionProgress(story.id);
  prog.stepIndex += 1;
  prog.counter = 0;

  if (prog.stepIndex >= story.mission.steps.length) {
    completeMission(story);
    return;
  }

  while (
    prog.stepIndex < story.mission.steps.length &&
    story.mission.steps[prog.stepIndex].type === "auto"
  ) {
    prog.stepIndex += 1;
  }

  if (prog.stepIndex >= story.mission.steps.length) {
    completeMission(story);
    return;
  }

  saveState();
  renderMission();
}

function completeMission(story) {
  if (state.missionComplete[story.id]) return;
  state.missionComplete[story.id] = true;
  const r = story.mission.reward;
  state.coins += r.coins;
  state.gems += r.gems;
  state.xp += r.xp;
  while (state.xp >= xpForLevel(state.level)) {
    state.xp -= xpForLevel(state.level);
    state.level += 1;
  }
  checkAchievements();
  saveState();
  alert(`Mission complete! +${r.coins} coins · +${r.gems} gems\n${story.title} — you lived the story!`);
  renderMission();
}

function updateStoryMissionUI(storyId) {
  const can = canPlayMission(storyId);
  const banner = $("#story-mission-unlock");
  const btnMission = $("#btn-play-mission");
  if (banner) banner.classList.toggle("hidden", !can);
  if (btnMission) btnMission.classList.toggle("hidden", !can);
}

function showMissionUnlockOnResult() {
  const story = getStory(activeStoryId);
  const allDone = completedCount(activeStoryId) >= story.levels.length;
  const btn = $("#btn-result-mission");
  if (btn) btn.classList.toggle("hidden", !allDone || !story.mission);
}

function getDisplayInitial(name) {
  const n = (name || "P").trim();
  return (n[0] || "P").toUpperCase();
}

function applyAvatarToSlot(initialEl, imgEl, url, name) {
  if (!initialEl || !imgEl) return;
  const initial = getDisplayInitial(name);
  initialEl.textContent = initial;
  if (url) {
    imgEl.src = url;
    imgEl.classList.remove("hidden");
    initialEl.classList.add("hidden");
  } else {
    imgEl.src = "";
    imgEl.classList.add("hidden");
    initialEl.classList.remove("hidden");
  }
}

function renderAvatars() {
  const name = state.username;
  const url = state.avatarUrl;
  applyAvatarToSlot($("#header-avatar-initial"), $("#header-avatar-img"), url, name);
  applyAvatarToSlot($("#profile-avatar-initial"), $("#profile-avatar-img"), url, name);
}

function renderHeader() {
  $("#header-level").textContent = state.level;
  $("#coins-display").textContent = state.coins;
  $("#gems-display").textContent = state.gems;
  renderAvatars();
}

function renderProfile() {
  $("#profile-name").textContent = state.username;
  const eq = getEquippedCharacter();
  const eqEl = $("#profile-equipped-char");
  if (eqEl) eqEl.textContent = `Playing as: ${eq.name}`;
  $("#profile-level").textContent = state.level;
  renderAvatars();
  const maxXp = xpForLevel(state.level);
  $("#xp-current").textContent = state.xp;
  $("#xp-max").textContent = maxXp;
  $("#xp-fill").style.width = `${Math.min(100, (state.xp / maxXp) * 100)}%`;
  $("#stat-stories").textContent = Object.values(state.storyComplete).filter(Boolean).length;
  $("#stat-achievements").textContent = state.achievements.length;
  $("#stat-points").textContent = state.coins;
  renderRecentAchievements();
}

function renderRecentAchievements() {
  const ul = $("#recent-achievements");
  ul.innerHTML = "";
  const unlocked = ACHIEVEMENTS.filter((a) => state.achievements.includes(a.id)).slice(-3);
  if (!unlocked.length) {
    ul.innerHTML = "<li>Complete a level to earn your first badge!</li>";
    return;
  }
  unlocked.forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${a.icon} ${a.title}</span><span class="reward">+50 🪙</span>`;
    ul.appendChild(li);
  });
}

function renderStoryCards() {
  const wrap = $("#story-cards");
  wrap.innerHTML = "";
  STORIES.forEach((story) => {
    const unlocked = storyUnlocked(story);
    const done = completedCount(story.id);
    const total = story.levels.length;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `story-card${unlocked ? "" : " locked"}`;
    btn.innerHTML = `
      <motion-div class="story-card-art${story.cover ? " story-card-art--cover" : ""}" style="${storyArtStyle(story)}">
        ${unlocked ? "" : '<span class="lock-badge">🔒</span>'}
      </motion-div>
      <motion-div class="story-card-body">
        <h3>${story.title}</h3>
        <motion-div class="level-bar"><motion-div class="level-bar-fill" style="width:${(done / total) * 100}%"></motion-div></motion-div>
        <p class="level-bar-label">${done} / ${total} Levels</p>
      </motion-div>
    `.replace(/motion-div/g, "div");
    if (unlocked) {
      btn.addEventListener("click", () => {
        if (canPlayMission(story.id)) openMission(story.id);
        else openStory(story.id);
      });
    }
    if (canPlayMission(story.id)) {
      const tag = document.createElement("p");
      tag.className = "story-mission-tag";
      tag.textContent = "Mission ready";
      btn.querySelector(".story-card-body")?.appendChild(tag);
    }
    wrap.appendChild(btn);
  });
}

function renderLevelMap(containerId, storyId) {
  const story = getStory(storyId);
  const container = document.getElementById(containerId);
  if (!story || !container) return;
  container.innerHTML = "";
  const done = completedCount(storyId);
  story.levels.forEach((lvl, i) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "level-node";
    node.textContent = i + 1;
    if (i < done) node.classList.add("done");
    else if (i === done) node.classList.add("current");
    else node.classList.add("locked");
    if (i <= done) {
      node.addEventListener("click", () => startLevel(storyId, i));
    }
    container.appendChild(node);
  });
}

function renderMapPanel() {
  const story = getStory(activeStoryId);
  if (!story) return;
  $("#map-story-title").textContent = story.title;
  applyStoryCover($("#map-panel-cover"), story);
  $("#map-desc").textContent = story.desc;
  $("#map-reward-text").textContent = `${story.reward.coins} 🪙 · ${story.reward.gems} 💎`;
  renderLevelMap("level-map", activeStoryId);
}

function renderBadges() {
  const grid = $("#badge-grid");
  grid.innerHTML = "";
  ACHIEVEMENTS.filter((a) => achievementTab === "all" || a.cat === achievementTab).forEach((a) => {
    const unlocked = state.achievements.includes(a.id);
    const div = document.createElement("div");
    div.className = `badge${unlocked ? "" : " locked"}`;
    div.innerHTML = `<div class="badge-icon">${unlocked ? a.icon : "🔒"}</div><span>${a.title}</span>`;
    grid.appendChild(div);
  });
}

function checkAchievements() {
  const snap = { ...state, storyComplete: state.storyComplete };
  ACHIEVEMENTS.forEach((a) => {
    if (!state.achievements.includes(a.id) && a.check(snap)) {
      state.achievements.push(a.id);
      state.coins += 50;
    }
  });
}

function getCharacter(id) {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}

function getEquippedCharacter() {
  return getCharacter(state.equippedCharacter);
}

function buyCharacter(id) {
  const ch = getCharacter(id);
  if (state.ownedCharacters.includes(id)) return true;
  if (ch.starter) {
    if (!state.ownedCharacters.includes(id)) state.ownedCharacters.push(id);
    saveState();
    return true;
  }
  const price = ch.price || 0;
  if (ch.currency === "gems") {
    if (state.gems < price) {
      alert(`You need ${price} gems to unlock ${ch.name}.`);
      return false;
    }
    state.gems -= price;
  } else if (state.coins < price) {
    alert(`You need ${price} coins to unlock ${ch.name}.`);
    return false;
  } else {
    state.coins -= price;
  }
  if (!state.ownedCharacters.includes(id)) state.ownedCharacters.push(id);
  saveState();
  renderHeader();
  return true;
}

function equipCharacter(id) {
  if (!state.ownedCharacters.includes(id)) return;
  state.equippedCharacter = id;
  saveState();
  renderShop("shop-items");
  renderShop("shop-items-full");
}

let shopTab = "characters";

function renderShop(targetId) {
  const wrap = document.getElementById(targetId);
  if (!wrap) return;
  wrap.innerHTML = "";

  if (shopTab !== "characters") {
    wrap.innerHTML = `<p class="shop-coming-soon">Boosts and extras coming soon!</p>`;
    return;
  }

  CHARACTERS.forEach((ch) => {
    const owned = state.ownedCharacters.includes(ch.id);
    const equipped = state.equippedCharacter === ch.id;
    const card = document.createElement("div");
    card.className = `shop-card shop-card-char${equipped ? " equipped" : ""}`;
    const coinIcon = "\u{1FA99}";
    const gemIcon = "\u{1F48E}";
    const priceText = ch.starter ? "Free" : `${ch.price} ${ch.currency === "gems" ? gemIcon : coinIcon}`;
    card.innerHTML = `
      <div class="shop-card-art shop-char-art">
        <img src="${ch.sprite}" alt="${ch.name}" loading="lazy">
        ${equipped ? '<span class="shop-equipped-badge">Equipped</span>' : ""}
      </div>
      <h4>${ch.name}</h4>
      <p class="shop-char-desc">${ch.desc}</p>
      <p class="price">${owned ? "Owned" : priceText}</p>
    `;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-sm shop-char-btn";
    if (equipped) {
      btn.textContent = "Playing";
      btn.disabled = true;
    } else if (owned) {
      btn.textContent = "Equip";
      btn.classList.add("btn-gold");
      btn.addEventListener("click", () => equipCharacter(ch.id));
    } else {
      btn.textContent = "Buy & Equip";
      btn.classList.add("btn-outline");
      btn.addEventListener("click", () => {
        if (buyCharacter(ch.id)) equipCharacter(ch.id);
      });
    }
    card.appendChild(btn);
    wrap.appendChild(card);
  });
}

function bindShopTabs() {
  document.querySelectorAll(".shop-panel .tab, #view-shop .tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const label = tab.textContent.trim().toLowerCase();
      shopTab = label.includes("character") ? "characters" : label.includes("boost") ? "boosts" : "featured";
      document.querySelectorAll(".shop-panel .tab, #view-shop .tab").forEach((t) => {
        t.classList.toggle("active", t === tab);
      });
      renderShop("shop-items");
      renderShop("shop-items-full");
    });
  });
}

function renderDaily() {
  const pct = Math.min(100, (state.dailyLevels / 3) * 100);
  $("#daily-progress").style.width = `${pct}%`;
  $("#daily-done").textContent = state.dailyLevels;
  const v = VERSES[new Date().getDate() % VERSES.length];
  $("#verse-text").textContent = v.text;
  $("#verse-ref").textContent = v.ref;
}

function validateUsername(name) {
  const t = name.trim();
  return t.length >= 2 && t.length <= 24;
}

function openProfileModal() {
  pendingAvatarUrl = state.avatarUrl;
  const input = $("#profile-name-input");
  input.value = state.username;
  $("#profile-name-error").hidden = true;
  applyAvatarToSlot($("#modal-avatar-initial"), $("#modal-avatar-img"), pendingAvatarUrl, input.value);
  $("#profile-modal").classList.remove("hidden");
  input.focus();
}

function closeProfileModal() {
  $("#profile-modal").classList.add("hidden");
  pendingAvatarUrl = null;
  $("#profile-photo-input").value = "";
}

function resizeImageFile(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) {
            h = (h / w) * maxSize;
            w = maxSize;
          } else {
            w = (w / h) * maxSize;
            h = maxSize;
          }
        }
        const cnv = document.createElement("canvas");
        cnv.width = w;
        cnv.height = h;
        cnv.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(cnv.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function onProfilePhotoSelected(file) {
  if (!file || !file.type.startsWith("image/")) return;
  if (file.size > 8 * 1024 * 1024) {
    alert("Please choose an image under 8 MB.");
    return;
  }
  resizeImageFile(file, 256, 0.82)
    .then((dataUrl) => {
      pendingAvatarUrl = dataUrl;
      const name = $("#profile-name-input").value;
      applyAvatarToSlot($("#modal-avatar-initial"), $("#modal-avatar-img"), pendingAvatarUrl, name);
    })
    .catch(() => alert("Could not load that image. Try another file."));
}

function saveProfileFromModal() {
  const name = $("#profile-name-input").value.trim();
  if (!validateUsername(name)) {
    $("#profile-name-error").hidden = false;
    return;
  }
  state.username = name.replace(/\s+/g, " ");
  state.avatarUrl = pendingAvatarUrl;
  saveState();
  closeProfileModal();
  renderDashboard();
  renderLeaderboard();
}

function renderDashboard() {
  renderHeader();
  renderProfile();
  renderStoryCards();
  renderMapPanel();
  renderBadges();
  renderShop("shop-items");
  renderDaily();
}

function openStory(storyId) {
  activeStoryId = storyId;
  const story = getStory(storyId);
  $("#story-view-title").textContent = story.title;
  const done = completedCount(storyId);
  const sub = canPlayMission(storyId)
    ? `${story.levels.length} levels complete · Story mission unlocked`
    : `${done}/${story.levels.length} levels · Bible adventure`;
  $("#story-view-sub").textContent = sub;
  $("#story-blurb").textContent = story.desc;
  applyStoryCover($("#story-view-cover"), story);
  renderLevelMap("story-level-map", storyId);
  updateStoryMissionUI(storyId);
  showView("story");
}

function startLevel(storyId, levelIndex) {
  activeStoryId = storyId;
  activeLevelIndex = levelIndex;
  const story = getStory(storyId);
  const level = story.levels[levelIndex];
  hearts = 3;
  sequencePicks = [];
  state.lastWin = false;

  $("#level-title").textContent = level.title;
  $("#level-objective").textContent = level.objective;
  $("#game-result").classList.add("hidden");
  $(".game-stage").style.display = "block";
  updateHearts();
  renderGameContent(level);
  startTimer(level.time);
  showView("game");
}

function updateHearts() {
  $("#game-hearts").textContent = "❤️".repeat(hearts) + "🖤".repeat(3 - hearts);
}

function startTimer(seconds) {
  clearInterval(gameTimer);
  gameTimeLeft = seconds;
  updateTimerDisplay();
  gameTimer = setInterval(() => {
    gameTimeLeft -= 1;
    updateTimerDisplay();
    if (gameTimeLeft <= 0) {
      clearInterval(gameTimer);
      failLevel("Time's up! Try again.");
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(gameTimeLeft / 60);
  const s = gameTimeLeft % 60;
  $("#game-timer").textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function renderGameContent(level) {
  const box = $("#game-content");
  box.innerHTML = "";
  $("#level-progress").style.width = "0%";

  if (level.type === "quiz") {
    const q = document.createElement("p");
    q.className = "quiz-question";
    q.style.fontSize = "1.05rem";
    q.style.marginBottom = "1rem";
    q.textContent = level.quiz.q;
    box.appendChild(q);
    const opts = document.createElement("div");
    opts.className = "quiz-options";
    level.quiz.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-opt";
      btn.textContent = text;
      btn.addEventListener("click", () => onQuizAnswer(btn, i, level));
      opts.appendChild(btn);
    });
    box.appendChild(opts);
  }

  if (level.type === "sequence") {
    const hint = document.createElement("p");
    hint.textContent = "Tap each step in the correct order:";
    hint.style.color = "var(--text-muted)";
    hint.style.marginBottom = "0.75rem";
    box.appendChild(hint);
    const list = document.createElement("div");
    list.className = "sequence-list";
    list.id = "sequence-list";
    const shuffled = [...level.sequence].sort(() => Math.random() - 0.5);
    shuffled.forEach((text) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "sequence-item";
      item.textContent = text;
      item.dataset.text = text;
      item.addEventListener("click", () => onSequencePick(item, level));
      list.appendChild(item);
    });
    box.innerHTML = "";
    box.appendChild(hint);
    box.appendChild(list);
  }
}

function onQuizAnswer(btn, index, level) {
  $$(".quiz-opt").forEach((b) => (b.disabled = true));
  const correct = index === level.quiz.correct;
  btn.classList.add(correct ? "correct" : "wrong");
  if (correct) {
    $("#level-progress").style.width = "100%";
    setTimeout(() => winLevel(level), 600);
  } else {
    hearts -= 1;
    updateHearts();
    if (hearts <= 0) failLevel("Wrong answer. Read the story and try again!");
    else {
      $$(".quiz-opt").forEach((b) => {
        b.disabled = false;
        b.classList.remove("wrong", "correct");
      });
      btn.classList.remove("wrong");
    }
  }
}

function onSequencePick(item, level) {
  if (item.classList.contains("done-order")) return;
  const expected = level.sequence[sequencePicks.length];
  if (item.dataset.text !== expected) {
    hearts -= 1;
    updateHearts();
    item.classList.add("wrong");
    setTimeout(() => item.classList.remove("wrong"), 400);
    if (hearts <= 0) failLevel("Wrong order. Try again!");
    return;
  }
  sequencePicks.push(item.dataset.text);
  item.classList.add("picked", "done-order");
  $("#level-progress").style.width = `${(sequencePicks.length / level.sequence.length) * 100}%`;
  if (sequencePicks.length === level.sequence.length) {
    setTimeout(() => winLevel(level), 500);
  }
}

function winLevel(level) {
  clearInterval(gameTimer);
  state.lastWin = true;
  state.heartsLeft = hearts;
  state.coins += level.reward.coins;
  state.gems += level.reward.gems;
  state.xp += level.reward.xp;

  const story = getStory(activeStoryId);
  const prev = completedCount(activeStoryId);
  if (activeLevelIndex >= prev) {
    state.progress[activeStoryId] = activeLevelIndex + 1;
    state.totalLevels += 1;
    state.dailyLevels = Math.min(3, state.dailyLevels + 1);
  }
  if (completedCount(activeStoryId) >= story.levels.length) {
    state.storyComplete[activeStoryId] = true;
    state.coins += story.reward.coins;
    state.gems += story.reward.gems;
  }

  while (state.xp >= xpForLevel(state.level)) {
    state.xp -= xpForLevel(state.level);
    state.level += 1;
  }

  checkAchievements();
  saveState();

  $(".game-stage").style.display = "none";
  $("#game-result").classList.remove("hidden");
  $("#result-title").textContent = "Level Complete!";
  $("#result-msg").textContent = `You finished "${level.title}".`;
  $("#result-reward").textContent = `+${level.reward.coins} 🪙 · +${level.reward.gems} 💎 · +${level.reward.xp} XP`;
  showMissionUnlockOnResult();
  if (completedCount(activeStoryId) >= story.levels.length) {
    $("#result-msg").textContent += " Story mission unlocked — play the full interactive story!";
  }
}

function failLevel(msg) {
  clearInterval(gameTimer);
  $(".game-stage").style.display = "none";
  $("#game-result").classList.remove("hidden");
  $("#result-title").textContent = "Keep Going";
  $("#result-msg").textContent = msg;
  $("#result-reward").textContent = "";
  $("#btn-next-level").textContent = "Try Again";
}

function continueAfterResult() {
  const story = getStory(activeStoryId);
  const done = completedCount(activeStoryId);
  if (done < story.levels.length) {
    startLevel(activeStoryId, done);
  } else if (canPlayMission(activeStoryId)) {
    openMission(activeStoryId);
  } else {
    openStory(activeStoryId);
  }
}

function bindEvents() {
  $$("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const view = el.dataset.nav;
      if (view === "dashboard") renderDashboard();
      if (view === "journey") renderJourney();
      if (view === "leaderboard") renderLeaderboard();
      if (view === "shop") renderShop("shop-items-full");
      showView(view);
    });
  });

  $("#btn-start-quest").addEventListener("click", () => {
    const first = STORIES.find((s) => storyUnlocked(s));
    if (first) openStory(first.id);
  });

  $("#btn-continue-hero").addEventListener("click", () => {
    let best = STORIES[0];
    for (const s of STORIES) {
      if (storyUnlocked(s) && completedCount(s.id) < s.levels.length) {
        best = s;
        break;
      }
    }
    openStory(best.id);
  });

  $("#btn-map-continue").addEventListener("click", () => {
    const done = completedCount(activeStoryId);
    const story = getStory(activeStoryId);
    if (done < story.levels.length) startLevel(activeStoryId, done);
    else if (canPlayMission(activeStoryId)) openMission(activeStoryId);
    else openStory(activeStoryId);
  });

  $("#btn-story-continue").addEventListener("click", () => {
    const story = getStory(activeStoryId);
    const done = completedCount(activeStoryId);
    if (done >= story.levels.length && canPlayMission(activeStoryId)) openMission(activeStoryId);
    else if (done < story.levels.length) startLevel(activeStoryId, done);
    else openStory(activeStoryId);
  });

  $("#btn-play-mission").addEventListener("click", () => openMission(activeStoryId));
  $("#btn-result-mission").addEventListener("click", () => openMission(activeStoryId));
  $("#btn-restart-mission").addEventListener("click", () => restartMission(activeStoryId));

  $$("[data-mission-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const nav = el.dataset.missionNav;
      if (nav === "mission") return;
      if (nav === "dashboard" || nav === "stories") {
        renderDashboard();
        showView("dashboard");
      } else if (nav === "profile") {
        openProfileModal();
      }
    });
  });

  $("[data-back]").addEventListener("click", () => {
    renderDashboard();
    showView("dashboard");
  });

  $("[data-back-game]").addEventListener("click", () => {
    clearInterval(gameTimer);
    openStory(activeStoryId);
  });

  $("#btn-next-level").addEventListener("click", () => {
    if ($("#result-title").textContent === "Keep Going") {
      startLevel(activeStoryId, activeLevelIndex);
    } else {
      continueAfterResult();
    }
  });

  $("#btn-exit-story").addEventListener("click", () => {
    renderDashboard();
    showView("dashboard");
  });

  $("#btn-pause").addEventListener("click", () => {
    if (gameTimer) {
      clearInterval(gameTimer);
      gameTimer = null;
      $("#btn-pause").textContent = "▶";
    } else {
      gameTimer = setInterval(() => {
        gameTimeLeft -= 1;
        updateTimerDisplay();
        if (gameTimeLeft <= 0) {
          clearInterval(gameTimer);
          failLevel("Time's up!");
        }
      }, 1000);
      $("#btn-pause").textContent = "⏸";
    }
  });

  $("#achievement-tabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    $("#achievement-tabs .tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    achievementTab = tab.dataset.tab;
    renderBadges();
  });

  $("#btn-sound").addEventListener("click", () => {
    const btn = $("#btn-sound");
    btn.textContent = btn.textContent.includes("ON") ? "🔇 OFF" : "🔊 ON";
  });

  $("#btn-edit-profile").addEventListener("click", openProfileModal);
  $("#profile-avatar-btn").addEventListener("click", openProfileModal);
  $("#header-avatar").addEventListener("click", openProfileModal);
  const missionAvatar = $("#mission-header-avatar");
  if (missionAvatar) missionAvatar.addEventListener("click", openProfileModal);

  $$("[data-close-profile]").forEach((el) => {
    el.addEventListener("click", closeProfileModal);
  });

  $("#btn-save-profile").addEventListener("click", saveProfileFromModal);

  $("#profile-photo-input").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) onProfilePhotoSelected(file);
  });

  $("#btn-remove-photo").addEventListener("click", (e) => {
    e.stopPropagation();
    pendingAvatarUrl = null;
    $("#profile-photo-input").value = "";
    applyAvatarToSlot(
      $("#modal-avatar-initial"),
      $("#modal-avatar-img"),
      null,
      $("#profile-name-input").value
    );
  });

  $("#profile-name-input").addEventListener("input", () => {
    $("#profile-name-error").hidden = true;
    applyAvatarToSlot(
      $("#modal-avatar-initial"),
      $("#modal-avatar-img"),
      pendingAvatarUrl,
      $("#profile-name-input").value
    );
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#profile-modal").classList.contains("hidden")) {
      closeProfileModal();
    }
  });

  renderLeaderboard();
}

function renderJourney() {
  const list = $("#journey-list");
  if (!list) return;
  list.innerHTML = "";
  STORIES.forEach((story) => {
    const done = completedCount(story.id);
    const li = document.createElement("li");
    li.textContent = `${story.title}: ${done}/${story.levels.length} levels`;
    if (storyUnlocked(story)) {
      li.style.cursor = "pointer";
      li.style.color = "var(--gold-bright)";
      li.addEventListener("click", () => openStory(story.id));
    }
    list.appendChild(li);
  });
}

function renderLeaderboard() {
  const list = $("#leaderboard-list");
  if (!list) return;
  const names = ["FAITH_KID", "BIBLE_HERO", state.username, "GRACE_22", "PSALM_91"];
  const scores = [3200, 2800, state.coins + state.xp, 2100, 1900];
  const sorted = names.map((n, i) => ({ n, s: scores[i] })).sort((a, b) => b.s - a.s);
  list.innerHTML = sorted
    .map(
      (row, i) =>
        `<li class="${row.n === state.username ? "you" : ""}">${i + 1}. ${row.n} — ${row.s} pts</li>`
    )
    .join("");
}

function init() {
  activeStoryId = "noah";
  state = migrateState(state);
  bindEvents();
  bindShopTabs();
  document.querySelectorAll(".shop-panel .tab, #view-shop .tab").forEach((t) => {
    t.classList.toggle("active", t.textContent.trim().toLowerCase().includes("character"));
  });
  renderDashboard();
  renderShop("shop-items-full");
  showView("dashboard");
}

init();
