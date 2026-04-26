const STORAGE_KEY = "ucat-reflex-data-v3";
const LEGACY_STORAGE_KEYS = ["ucat-reflex-data-v2", "ucat-reflex-data"];
const SETTINGS_KEY = "ucat-reflex-settings";
const SESSION_LENGTH = 12;

const defaultData = {
  vrSessions: [],
  dmSessions: [],
  qrSessions: [],
  sjtSessions: []
};

const defaultSettings = {
  rememberMedicalMode: true,
  medicalMode: false,
  theme: "light"
};

const vrLibrary = [
  {
    category: "Medicine",
    title: "Hospital Flow and Early Assessment",
    text: "Emergency departments often improve patient flow not by adding more beds, but by refining triage and senior assessment at the front door. When experienced clinicians review patients early, they can discharge some individuals safely, redirect others to ambulatory care, and identify those who need urgent intervention. Research in service design suggests that bottlenecks usually arise when decisions are delayed rather than when total demand suddenly changes. However, hospitals that introduce rapid assessment still need robust follow-up pathways. Without those, patients may leave the department faster yet return later with unresolved problems.",
    questions: [
      { prompt: "The passage proves extra beds never help performance.", answer: "Can't Tell" },
      { prompt: "Delayed decisions can create bottlenecks in emergency care.", answer: "True" },
      { prompt: "Rapid assessment removes the need for follow-up pathways.", answer: "False" }
    ]
  },
  {
    category: "Medicine",
    title: "Screening and Risk Communication",
    text: "Public health screening programmes are most effective when invitations explain both possible benefits and possible harms. Early detection can improve outcomes for some diseases, yet false positives may expose patients to anxiety and unnecessary follow-up tests. Researchers therefore emphasise informed participation rather than automatic uptake. A screening service can still be successful even if not every eligible person attends, provided those who do participate understand what the test can and cannot establish.",
    questions: [
      { prompt: "False positives can lead to unnecessary investigations.", answer: "True" },
      { prompt: "A screening programme only works if every eligible person attends.", answer: "False" },
      { prompt: "The passage states screening always causes anxiety.", answer: "False" }
    ]
  },
  {
    category: "The Economist",
    title: "Inflation, Rates, and Investment",
    text: "When inflation remains above target, central banks may keep interest rates elevated even if growth slows. Higher borrowing costs can cool consumer demand, but they also reshape corporate priorities. Firms facing expensive debt often delay expansion and focus on cash flow resilience instead. Investors sometimes interpret that restraint as weakness, though in some sectors it reflects discipline. Market reactions therefore depend not only on policy moves themselves, but on whether companies appear prepared for a longer period of tighter financial conditions.",
    questions: [
      { prompt: "Higher borrowing costs can change company strategy.", answer: "True" },
      { prompt: "Every investor sees delayed expansion as weakness.", answer: "False" },
      { prompt: "The passage says interest rates will definitely fall soon.", answer: "False" }
    ]
  },
  {
    category: "The Economist",
    title: "Trade and Productivity",
    text: "Economists often note that trade policy affects productivity through several channels at once. Lower barriers can reduce input costs, widen export markets, and expose domestic firms to stronger competition. Even so, the transition is not painless. Some sectors adjust quickly while others struggle with retraining needs and capital constraints. As a result, aggregate gains may arrive long before all communities feel them equally.",
    questions: [
      { prompt: "Trade policy can influence productivity in more than one way.", answer: "True" },
      { prompt: "Every sector adjusts quickly after trade barriers fall.", answer: "False" },
      { prompt: "The passage proves all communities benefit immediately.", answer: "False" }
    ]
  },
  {
    category: "Psychology",
    title: "Attention and Cognitive Load",
    text: "Psychologists studying attention note that people perform worse on complex tasks when working memory is overloaded. This does not mean distraction always comes from the outside. Internal worries, background planning, and emotional rumination can consume the same limited cognitive resources required for reasoning. Some interventions therefore try to improve performance not by removing all stimuli, but by reducing task-switching and helping people commit to one goal at a time. The benefit is often modest, yet consistent enough to matter in assessment settings.",
    questions: [
      { prompt: "Internal thoughts can interfere with reasoning performance.", answer: "True" },
      { prompt: "All distractions must come from the external environment.", answer: "False" },
      { prompt: "The passage claims the benefits of reducing task-switching are enormous.", answer: "False" }
    ]
  },
  {
    category: "Psychology",
    title: "Feedback and Motivation",
    text: "Feedback can improve performance, but only when it is specific enough for the learner to act on. Praise alone may increase confidence without clarifying what should change next. By contrast, precise comments tied to strategy, timing, or method can help students adjust their approach on the following attempt. Psychologists also note that immediate feedback is not automatically superior. In some contexts, a short delay may promote reflection rather than impulsive correction.",
    questions: [
      { prompt: "Specific feedback is more actionable than praise alone.", answer: "True" },
      { prompt: "Immediate feedback is always best.", answer: "False" },
      { prompt: "The passage suggests delayed feedback can never help learning.", answer: "False" }
    ]
  },
  {
    category: "Tech",
    title: "AI Deployment in Product Teams",
    text: "Technology companies increasingly deploy generative systems inside existing products, but adoption depends on reliability as much as novelty. Teams may launch a feature to strong curiosity and still face declining usage if the outputs feel unpredictable. Some product leaders therefore prefer smaller tools with narrow use cases over sweeping assistants that promise everything. The logic is simple: when users know what a tool is for, they can judge success more easily. Broader systems can still win, but usually only after they establish trust through repeatable results.",
    questions: [
      { prompt: "Reliability matters alongside novelty in product adoption.", answer: "True" },
      { prompt: "Broad AI systems can never succeed in products.", answer: "False" },
      { prompt: "Narrow tools may be easier for users to evaluate.", answer: "True" }
    ]
  },
  {
    category: "Tech",
    title: "Cloud Costs and Engineering Decisions",
    text: "Engineering teams sometimes treat cloud spending as a finance problem rather than a product problem, yet architecture choices and feature design often determine recurring costs. A service that feels fast at low scale may become expensive when user demand rises sharply. For that reason, some companies review usage patterns before optimising code line by line. The cheapest system is not always the best one, but a team that ignores cost entirely may discover too late that growth has made its own success harder to sustain.",
    questions: [
      { prompt: "Feature design can affect recurring cloud costs.", answer: "True" },
      { prompt: "The cheapest system is always the best system.", answer: "False" },
      { prompt: "Companies may study usage patterns before detailed optimisation.", answer: "True" }
    ]
  },
  {
    category: "Medicine",
    title: "Primary Care Access",
    text: "Health systems attempting to improve primary care access often focus on appointment numbers, but continuity can matter just as much as speed. Patients with chronic illness may benefit when the clinician already understands their history, preferences, and prior treatment responses. Rapid access is still important, especially for acute concerns, yet a service designed around speed alone can fragment care. Administrators therefore face a trade-off that is operational rather than purely clinical.",
    questions: [
      { prompt: "Continuity may matter alongside rapid access in primary care.", answer: "True" },
      { prompt: "The passage says speed is irrelevant for acute concerns.", answer: "False" },
      { prompt: "A speed-only system can fragment care.", answer: "True" }
    ]
  },
  {
    category: "The Economist",
    title: "Energy Markets and Incentives",
    text: "Governments trying to accelerate energy transitions often combine regulation with financial incentives. Subsidies may encourage early investment, but investors still look for policy consistency over time. A generous scheme that changes every year can weaken confidence rather than build it. Policymakers therefore face the challenge of designing support that attracts capital without creating long-term dependence on constant intervention.",
    questions: [
      { prompt: "Policy consistency can influence investor confidence.", answer: "True" },
      { prompt: "Subsidies alone guarantee sustained investment.", answer: "False" },
      { prompt: "The passage says policymakers want permanent dependence on intervention.", answer: "False" }
    ]
  }
];

const dmQuestionBank = {
  simple: [
    {
      premises: ["All books are learning resources.", "No learning resources are edible."],
      validConclusion: "Therefore, no books are edible.",
      invalidConclusion: "Therefore, some edible items are books."
    },
    {
      premises: ["All tutors are mentors.", "No mentors are robots."],
      validConclusion: "Therefore, no tutors are robots.",
      invalidConclusion: "Therefore, all robots are tutors."
    },
    {
      premises: ["All blue cards are study tools.", "No study tools are vehicles."],
      validConclusion: "Therefore, no blue cards are vehicles.",
      invalidConclusion: "Therefore, some vehicles are blue cards."
    },
    {
      premises: ["All A are B.", "No B are C."],
      validConclusion: "Therefore, no A are C.",
      invalidConclusion: "Therefore, some C are A."
    },
    {
      premises: ["All revision plans are schedules.", "No schedules are random guesses."],
      validConclusion: "Therefore, no revision plans are random guesses.",
      invalidConclusion: "Therefore, some random guesses are revision plans."
    }
  ],
  medical: [
    {
      premises: ["All histopathology slides are diagnostic materials.", "No diagnostic materials are living tissue."],
      validConclusion: "Therefore, no histopathology slides are living tissue.",
      invalidConclusion: "Therefore, some living tissue is a histopathology slide."
    },
    {
      premises: ["All renal wards are inpatient units.", "No inpatient units are outpatient clinics."],
      validConclusion: "Therefore, no renal wards are outpatient clinics.",
      invalidConclusion: "Therefore, all outpatient clinics are renal wards."
    },
    {
      premises: ["All neuroplasticity seminars are teaching sessions.", "No teaching sessions are emergency procedures."],
      validConclusion: "Therefore, no neuroplasticity seminars are emergency procedures.",
      invalidConclusion: "Therefore, some emergency procedures are neuroplasticity seminars."
    },
    {
      premises: ["All myocardial biopsy forms are clinical records.", "No clinical records are conscious patients."],
      validConclusion: "Therefore, no myocardial biopsy forms are conscious patients.",
      invalidConclusion: "Therefore, some conscious patients are myocardial biopsy forms."
    },
    {
      premises: ["All histology reports are laboratory documents.", "No laboratory documents are living organs."],
      validConclusion: "Therefore, no histology reports are living organs.",
      invalidConclusion: "Therefore, some living organs are histology reports."
    }
  ]
};

const sjtScenarios = [
  {
    pillar: "Autonomy",
    title: "Respecting a Patient Choice",
    scenario: "A competent adult patient refuses a recommended diagnostic procedure after the risks and benefits have been explained clearly. The team believes the test would be useful but the patient remains calm, informed, and consistent.",
    responses: [
      "Document the discussion, confirm capacity, and respect the patient's decision while offering time for further questions.",
      "Encourage another brief conversation with a senior clinician to ensure the patient understands the consequences.",
      "Delay discharge until the patient agrees because the team knows what is best.",
      "Tell the family to pressure the patient into accepting the procedure."
    ],
    ranking: [1, 2, 4, 3]
  },
  {
    pillar: "Beneficence",
    title: "Following Up a Missed Result",
    scenario: "You notice a test result suggesting a patient may need early treatment, but the result has not yet been discussed at the ward round and the patient is due to leave later that day.",
    responses: [
      "Escalate the result promptly to the responsible clinician and help ensure the patient is reviewed before discharge.",
      "Check the notes and gather the relevant details so the handover is clear and efficient.",
      "Assume someone else will notice it eventually and continue with routine tasks.",
      "Mention it casually at the end of the day if there is time."
    ],
    ranking: [1, 2, 4, 3]
  },
  {
    pillar: "Non-maleficence",
    title: "Preventing Medication Harm",
    scenario: "During preparation of medications, you see that a dose written on a chart looks unusually high for a frail patient with renal impairment.",
    responses: [
      "Pause administration and escalate the concern immediately so the prescription can be checked.",
      "Review the chart and relevant guidance before speaking to the prescriber if available.",
      "Give the dose anyway because the chart is signed.",
      "Ask another student what they would do and leave it at that."
    ],
    ranking: [1, 2, 4, 3]
  },
  {
    pillar: "Justice",
    title: "Fair Allocation of Time",
    scenario: "A clinic is running late and two patients both need attention. One is assertive and demanding, while the other has been waiting quietly with worsening symptoms.",
    responses: [
      "Prioritise based on clinical need and fairness rather than who is most vocal.",
      "Explain the delay transparently and reassess both patients' urgency.",
      "See the demanding patient first to reduce complaints.",
      "Ignore the quieter patient because they seem less likely to object."
    ],
    ranking: [1, 2, 3, 4]
  },
  {
    pillar: "Autonomy",
    title: "Confidential Information",
    scenario: "A patient's friend asks you in the corridor for details about a recent diagnosis, saying they are only trying to help and the patient would not mind.",
    responses: [
      "Explain that you cannot share confidential information without the patient's consent.",
      "Offer to help the friend speak with the patient directly if appropriate.",
      "Share a brief summary because the friend seems concerned.",
      "Discuss the case quietly away from the ward desk."
    ],
    ranking: [1, 2, 3, 4]
  }
];

const state = {
  currentScreen: "home",
  data: loadData(),
  settings: loadJSON(SETTINGS_KEY, defaultSettings),
  deferredPrompt: null,
  charts: {},
  session: createEmptySession()
};

function createEmptySession() {
  return {
    mode: null,
    questions: [],
    index: 0,
    answers: [],
    startedAt: 0,
    questionStartedAt: 0,
    vrReadSeconds: 0,
    vrReadingFinished: false,
    qrHasMistake: false,
    locked: false,
    autoAdvanceId: null
  };
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...structuredClone(fallback), ...JSON.parse(raw) } : structuredClone(fallback);
  } catch (error) {
    return structuredClone(fallback);
  }
}

function loadData() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      return { ...structuredClone(defaultData), ...JSON.parse(current) };
    }

    for (const key of LEGACY_STORAGE_KEYS) {
      const legacy = localStorage.getItem(key);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        return {
          ...structuredClone(defaultData),
          vrSessions: parsed.vrSessions || [],
          dmSessions: parsed.dmSessions || [],
          qrSessions: parsed.qrSessions || [],
          sjtSessions: parsed.sjtSessions || []
        };
      }
    }
  } catch (error) {
    return structuredClone(defaultData);
  }

  return structuredClone(defaultData);
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function shuffle(list) {
  const clone = [...list];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function sampleCount(list, count) {
  if (list.length >= count) {
    return shuffle(list).slice(0, count);
  }

  const result = [];
  while (result.length < count) {
    result.push(...shuffle(list));
  }
  return result.slice(0, count);
}

function sampleOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function roundTo(value, decimals = 2) {
  return Number(value.toFixed(decimals));
}

function countWords(text) {
  return text.trim().split(/\s+/).length;
}

function average(list) {
  return list.length ? list.reduce((sum, value) => sum + value, 0) / list.length : 0;
}

function secondsToLabel(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function formatDateLabel(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function setScreen(screen) {
  state.currentScreen = screen;

  const screenMap = {
    home: "homeScreen",
    exercise: "exerciseScreen",
    results: "resultsScreen",
    stats: "statsScreen",
    settings: "settingsScreen"
  };

  qsa(".screen").forEach((element) => {
    element.classList.toggle("active", element.id === screenMap[screen]);
  });

  qsa(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.screenTarget === screen);
  });

  document.body.classList.toggle("exercise-active", screen === "exercise");
  document.body.classList.toggle("focus-active", screen === "exercise" || screen === "results");

  if (screen === "stats") {
    renderDashboard();
  }

  renderStreakBar();

  window.scrollTo(0, 0);
}

function applyTheme(theme) {
  const allowed = ["light", "dark", "sepia"];
  const selected = allowed.includes(theme) ? theme : "light";
  state.settings.theme = selected;
  document.body.dataset.theme = selected;
  qsa("[data-theme-option]").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeOption === selected);
  });
}

function setExerciseFeedback(message = "", type = "") {
  const feedback = qs("#exerciseFeedback");
  feedback.textContent = message;
  feedback.className = `feedback${type ? ` ${type}` : ""}`;
}

function getDailyProgressMap() {
  const map = new Map();
  ["vrSessions", "dmSessions", "qrSessions", "sjtSessions"].forEach((key) => {
    state.data[key].forEach((session) => {
      const day = new Date(session.date).toISOString().slice(0, 10);
      map.set(day, (map.get(day) || 0) + 1);
    });
  });
  return map;
}

function getCurrentStreak(progressMap = getDailyProgressMap()) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;

  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const iso = date.toISOString().slice(0, 10);
    if (!progressMap.get(iso)) {
      if (offset === 0) {
        continue;
      }
      break;
    }
    streak += 1;
  }

  if (!streak) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const iso = yesterday.toISOString().slice(0, 10);
    if (progressMap.get(iso)) {
      return 1;
    }
  }

  return streak;
}

function renderStreakBar() {
  const progressMap = getDailyProgressMap();
  const streak = getCurrentStreak(progressMap);
  const totalToday = progressMap.get(new Date().toISOString().slice(0, 10)) || 0;
  qs("#streakValue").textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  qs("#streakMeta").textContent = totalToday ? `${totalToday} session${totalToday === 1 ? "" : "s"} today` : "Complete a session today";
  qs("#streakFill").style.width = `${Math.min(100, streak * 14)}%`;
}

function clearAutoAdvance() {
  if (state.session.autoAdvanceId) {
    clearTimeout(state.session.autoAdvanceId);
    state.session.autoAdvanceId = null;
  }
}

function queueNextStep(callback, delay = 1000) {
  clearAutoAdvance();
  state.session.autoAdvanceId = window.setTimeout(() => {
    state.session.autoAdvanceId = null;
    callback();
  }, delay);
}

function buildVrPool() {
  return vrLibrary.flatMap((passage) =>
    passage.questions.map((question) => ({
      category: passage.category,
      title: passage.title,
      text: passage.text,
      prompt: question.prompt,
      answer: question.answer,
      words: countWords(passage.text)
    }))
  );
}

function buildDmSessionQuestions() {
  const mode = state.settings.medicalMode ? "medical" : "simple";
  const bank = dmQuestionBank[mode];
  return Array.from({ length: SESSION_LENGTH }, () => {
    const base = sampleOne(bank);
    const isValid = Math.random() > 0.5;
    return {
      mode,
      premises: base.premises,
      prompt: isValid ? base.validConclusion : base.invalidConclusion,
      answer: isValid ? "Valid" : "Invalid"
    };
  });
}

function buildQrSessionQuestions() {
  return Array.from({ length: SESSION_LENGTH }, () => sampleOne([
    createPercentageQuestion,
    createReciprocalQuestion,
    createCurrencyQuestion
  ])());
}

function buildSjtSessionQuestions() {
  return sampleCount(sjtScenarios, SESSION_LENGTH).map((scenario) => ({
    pillar: scenario.pillar,
    title: scenario.title,
    scenario: scenario.scenario,
    responses: scenario.responses,
    answerIndex: scenario.ranking.indexOf(1)
  }));
}

function startSession(mode) {
  clearAutoAdvance();
  state.session = createEmptySession();
  state.session.mode = mode;
  state.session.startedAt = Date.now();

  if (mode === "vr") {
    state.session.questions = sampleCount(buildVrPool(), SESSION_LENGTH);
  } else if (mode === "dm") {
    state.session.questions = buildDmSessionQuestions();
  } else if (mode === "qr") {
    state.session.questions = buildQrSessionQuestions();
  } else if (mode === "sjt") {
    state.session.questions = buildSjtSessionQuestions();
  }

  setScreen("exercise");
  renderCurrentExercise();
}

function renderCurrentExercise() {
  const question = state.session.questions[state.session.index];
  state.session.questionStartedAt = Date.now();
  state.session.vrReadSeconds = 0;
  state.session.vrReadingFinished = false;
  state.session.qrHasMistake = false;
  state.session.locked = false;
  setExerciseFeedback("");

  qs("#exerciseModeLabel").textContent = state.session.mode.toUpperCase();
  qs("#exerciseCounter").textContent = `Question ${state.session.index + 1} of ${state.session.questions.length}`;
  qs("#exerciseBadge").textContent = currentBadgeText(question);
  qs("#exerciseTitle").textContent = currentTitleText(question);
  qs("#exerciseEyebrow").textContent = currentEyebrowText();
  qs("#exerciseContent").className = `exercise-content ${currentLayoutClass()}`;

  if (state.session.mode === "vr") {
    renderVrQuestion(question);
  } else if (state.session.mode === "dm") {
    renderDmQuestion(question);
  } else if (state.session.mode === "qr") {
    renderQrQuestion(question);
  } else if (state.session.mode === "sjt") {
    renderSjtQuestion(question);
  }
}

function currentLayoutClass() {
  if (state.session.mode === "vr") {
    return "layout-vr";
  }
  if (state.session.mode === "dm" || state.session.mode === "sjt") {
    return "layout-choice";
  }
  return "layout-stack";
}

function currentEyebrowText() {
  const labels = {
    vr: "Verbal Reasoning",
    dm: "Decision Making",
    qr: "Quantitative Reasoning",
    sjt: "Situational Judgement"
  };
  return labels[state.session.mode] || "Session";
}

function currentTitleText(question) {
  if (state.session.mode === "vr") {
    return question.title;
  }
  if (state.session.mode === "dm") {
    return "Syllogism";
  }
  if (state.session.mode === "qr") {
    return question.type;
  }
  return question.title;
}

function currentBadgeText(question) {
  if (state.session.mode === "vr") {
    return question.category;
  }
  if (state.session.mode === "dm") {
    return question.mode === "medical" ? "Medical Mode" : "Simple Mode";
  }
  if (state.session.mode === "qr") {
    return "Type the correct value";
  }
  return question.pillar;
}

function renderVrQuestion(question) {
  qs("#exerciseContent").innerHTML = `
    <div class="exercise-panel">
      <div class="metric-chip-row">
        <div class="metric-chip">${question.words} words</div>
        <div class="metric-chip">WPM tracked</div>
      </div>
      <article class="passage">${question.text}</article>
    </div>
    <div class="exercise-answer-panel">
      <article class="prompt-box">${question.prompt}</article>
      <button id="finishReadingButton" class="primary-button full-width-button" type="button">Finished Reading</button>
      <div id="vrAnswers" class="answer-grid hidden">
        <button class="answer-button" data-answer="True" type="button">A) True</button>
        <button class="answer-button" data-answer="False" type="button">B) False</button>
        <button class="answer-button" data-answer="Can't Tell" type="button">C) Can't Tell</button>
      </div>
    </div>
  `;
  setExerciseFeedback("Read the extract, tap Finished Reading, then answer.");

  qs("#finishReadingButton").addEventListener("click", () => {
    state.session.vrReadingFinished = true;
    state.session.vrReadSeconds = Math.max(1, Math.round((Date.now() - state.session.questionStartedAt) / 1000));
    qs("#finishReadingButton").classList.add("hidden");
    qs("#vrAnswers").classList.remove("hidden");
    setExerciseFeedback(`Reading time captured: ${state.session.vrReadSeconds}s.`);
  });

  qsa("#vrAnswers .answer-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (!state.session.vrReadingFinished || state.session.locked) {
        return;
      }
      state.session.locked = true;
      const selected = button.dataset.answer;
      const correct = selected === question.answer;
      const wpm = Math.round((question.words / state.session.vrReadSeconds) * 60);
      state.session.answers.push({
        correct,
        wpm,
        readSeconds: state.session.vrReadSeconds
      });
      setExerciseFeedback(correct ? "Correct" : `Incorrect. Answer: ${question.answer}`, correct ? "success" : "error");
      queueNextOrFinish();
    });
  });
}

function renderDmQuestion(question) {
  qs("#exerciseContent").innerHTML = `
    <div class="exercise-panel">
      <article class="prompt-box">${question.premises[0]}</article>
      <article class="prompt-box">${question.premises[1]}</article>
    </div>
    <div class="exercise-answer-panel">
      <article class="prompt-box"><strong>${question.prompt}</strong></article>
      <div class="answer-grid">
        <button class="answer-button" data-answer="Valid" type="button">A) Valid</button>
        <button class="answer-button" data-answer="Invalid" type="button">B) Invalid</button>
      </div>
    </div>
  `;
  setExerciseFeedback("Choose whether the conclusion logically follows.");

  qsa(".answer-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.session.locked) {
        return;
      }
      state.session.locked = true;
      const selected = button.dataset.answer;
      const correct = selected === question.answer;
      state.session.answers.push({ correct });
      setExerciseFeedback(correct ? "Correct" : `Incorrect. Answer: ${question.answer}`, correct ? "success" : "error");
      queueNextOrFinish();
    });
  });
}

function renderQrQuestion(question) {
  qs("#exerciseContent").innerHTML = `
    <div class="exercise-panel">
      <div class="metric-chip-row">
        <div class="metric-chip">Auto-advance on correct entry</div>
        <div class="metric-chip">Tolerance: 0.02</div>
      </div>
      <article class="prompt-box">${question.prompt}</article>
    </div>
    <div class="exercise-answer-panel">
      <div class="input-stack">
        <label class="sr-only" for="qrInput">Type your answer</label>
        <input id="qrInput" class="text-input" inputmode="decimal" autocomplete="off" placeholder="Type answer">
      </div>
    </div>
  `;
  setExerciseFeedback("Type the answer. The next question appears as soon as the number is correct.");

  const input = qs("#qrInput");
  input.focus();

  input.addEventListener("input", () => {
    const value = Number(input.value.trim());
    if (!input.value.trim() || !Number.isFinite(value)) {
      return;
    }

    const correct = Math.abs(value - question.answer) < 0.02;
    if (correct) {
      if (state.session.locked) {
        return;
      }
      state.session.locked = true;
      state.session.answers.push({ correct: !state.session.qrHasMistake });
      setExerciseFeedback("Correct", "success");
      queueNextOrFinish(180);
      return;
    }

    state.session.qrHasMistake = true;
    setExerciseFeedback("Keep going", "");
  });
}

function renderSjtQuestion(question) {
  qs("#exerciseContent").innerHTML = `
    <div class="exercise-panel">
      <article class="scenario-box">${question.scenario}</article>
    </div>
    <div class="exercise-answer-panel">
      <div class="answer-grid">
        ${question.responses.map((response, index) => `
          <button class="answer-button" data-answer-index="${index}" type="button">${String.fromCharCode(65 + index)}) ${response}</button>
        `).join("")}
      </div>
    </div>
  `;
  setExerciseFeedback("Select the most appropriate response.");

  qsa(".answer-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.session.locked) {
        return;
      }
      state.session.locked = true;
      const selectedIndex = Number(button.dataset.answerIndex);
      const correct = selectedIndex === question.answerIndex;
      state.session.answers.push({ correct });
      setExerciseFeedback(correct ? "Correct" : "Incorrect", correct ? "success" : "error");
      queueNextOrFinish();
    });
  });
}

function queueNextOrFinish(delay = 1000) {
  queueNextStep(() => {
    state.session.index += 1;
    if (state.session.index >= state.session.questions.length) {
      finishSession();
      return;
    }
    renderCurrentExercise();
  }, delay);
}

function finishSession() {
  clearAutoAdvance();
  const totalSeconds = Math.max(1, Math.round((Date.now() - state.session.startedAt) / 1000));
  const accuracy = Math.round((state.session.answers.filter((item) => item.correct).length / state.session.questions.length) * 100);
  const summary = {
    mode: state.session.mode,
    date: new Date().toISOString(),
    totalQuestions: state.session.questions.length,
    accuracy,
    timeSeconds: totalSeconds,
    avgWpm: state.session.mode === "vr" ? Math.round(average(state.session.answers.map((item) => item.wpm || 0))) : null
  };

  if (state.session.mode === "vr") {
    state.data.vrSessions.push(summary);
  } else if (state.session.mode === "dm") {
    summary.modeLabel = state.settings.medicalMode ? "medical" : "simple";
    state.data.dmSessions.push(summary);
  } else if (state.session.mode === "qr") {
    state.data.qrSessions.push(summary);
  } else if (state.session.mode === "sjt") {
    state.data.sjtSessions.push(summary);
  }

  saveData();
  renderResults(summary);
}

function renderResults(summary) {
  const titles = {
    vr: "Verbal Reasoning Results",
    dm: "Decision Making Results",
    qr: "Quantitative Reasoning Results",
    sjt: "Situational Judgement Results"
  };

  qs("#resultsTitle").textContent = titles[summary.mode];
  qs("#resultsAccuracy").textContent = `${summary.accuracy}%`;
  qs("#resultsTime").textContent = secondsToLabel(summary.timeSeconds);
  qs("#resultsWpm").textContent = summary.avgWpm ? String(summary.avgWpm) : "--";
  qs("#resultsMeta").innerHTML = `
    <div class="prompt-box">Questions completed: ${summary.totalQuestions}</div>
    <div class="prompt-box">${summary.mode === "vr" ? `Average reading speed: ${summary.avgWpm} WPM` : "WPM is tracked for Verbal Reasoning sessions only."}</div>
  `;
  setScreen("results");
}

function resetSessionAndHome() {
  clearAutoAdvance();
  state.session = createEmptySession();
  setScreen("home");
}

function sharedChartOptions(extra = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#f4f4f2" }
      }
    },
    ...extra
  };
}

function recreateChart(id, config) {
  if (state.charts[id]) {
    state.charts[id].destroy();
  }
  state.charts[id] = new Chart(qs(`#${id}`), config);
}

function renderSummaryCards() {
  const vrLast = state.data.vrSessions.at(-1);
  const dmLast = state.data.dmSessions.at(-1);
  const qrLast = state.data.qrSessions.at(-1);
  const sjtLast = state.data.sjtSessions.at(-1);

  qs("#vrSummaryValue").textContent = `${Math.round(average(state.data.vrSessions.map((item) => item.accuracy || item.comprehension || 0)))}%`;
  qs("#vrSummaryMeta").textContent = vrLast ? `Latest: ${vrLast.avgWpm || vrLast.wpm || 0} WPM` : "No sessions yet";

  qs("#dmSummaryValue").textContent = `${Math.round(average(state.data.dmSessions.map((item) => item.accuracy || 0)))}%`;
  qs("#dmSummaryMeta").textContent = dmLast ? `Latest: ${secondsToLabel(dmLast.timeSeconds || 0)}` : "No sessions yet";

  qs("#qrSummaryValue").textContent = `${Math.round(average(state.data.qrSessions.map((item) => item.accuracy || 0)))}%`;
  qs("#qrSummaryMeta").textContent = qrLast ? `Latest: ${secondsToLabel(qrLast.timeSeconds || 0)}` : "No sessions yet";

  qs("#sjtSummaryValue").textContent = `${Math.round(average(state.data.sjtSessions.map((item) => item.accuracy || item.score || 0)))}%`;
  qs("#sjtSummaryMeta").textContent = sjtLast ? `Latest: ${secondsToLabel(sjtLast.timeSeconds || 0)}` : "No sessions yet";
}

function renderVrChart() {
  recreateChart("vrChart", {
    type: "line",
    data: {
      labels: state.data.vrSessions.map((item) => formatDateLabel(item.date)),
      datasets: [
        {
          label: "WPM",
          data: state.data.vrSessions.map((item) => item.avgWpm || item.wpm || 0),
          borderColor: "#f0f0ea",
          backgroundColor: "rgba(240,240,234,0.18)",
          yAxisID: "y"
        },
        {
          label: "Accuracy %",
          data: state.data.vrSessions.map((item) => item.accuracy || item.comprehension || 0),
          borderColor: "#9dc5a5",
          backgroundColor: "rgba(157,197,165,0.18)",
          yAxisID: "y1"
        }
      ]
    },
    options: sharedChartOptions({
      scales: {
        y: { beginAtZero: true, ticks: { color: "#b4b4af" }, grid: { color: "#2d3036" } },
        y1: { beginAtZero: true, max: 100, position: "right", ticks: { color: "#b4b4af" }, grid: { drawOnChartArea: false } },
        x: { ticks: { color: "#b4b4af" }, grid: { color: "#2d3036" } }
      }
    })
  });
}

function renderDmChart() {
  recreateChart("dmChart", {
    type: "bar",
    data: {
      labels: state.data.dmSessions.map((item) => formatDateLabel(item.date)),
      datasets: [{
        label: "Accuracy %",
        data: state.data.dmSessions.map((item) => item.accuracy || 0),
        backgroundColor: "rgba(215,245,222,0.72)",
        borderColor: "#d7f5de",
        borderWidth: 1
      }]
    },
    options: sharedChartOptions({
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: "#b4b4af" }, grid: { color: "#2d3036" } },
        x: { ticks: { color: "#b4b4af" }, grid: { display: false } }
      }
    })
  });
}

function renderQrChart() {
  recreateChart("qrChart", {
    type: "bar",
    data: {
      labels: state.data.qrSessions.map((item) => formatDateLabel(item.date)),
      datasets: [{
        label: "Accuracy %",
        data: state.data.qrSessions.map((item) => item.accuracy || 0),
        backgroundColor: "rgba(240,240,234,0.72)",
        borderColor: "#f0f0ea",
        borderWidth: 1
      }]
    },
    options: sharedChartOptions({
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: "#b4b4af" }, grid: { color: "#2d3036" } },
        x: { ticks: { color: "#b4b4af" }, grid: { display: false } }
      }
    })
  });
}

function renderSjtChart() {
  recreateChart("sjtChart", {
    type: "line",
    data: {
      labels: state.data.sjtSessions.map((item) => formatDateLabel(item.date)),
      datasets: [{
        label: "Accuracy %",
        data: state.data.sjtSessions.map((item) => item.accuracy || item.score || 0),
        borderColor: "#d7f5de",
        backgroundColor: "rgba(215,245,222,0.18)",
        fill: true
      }]
    },
    options: sharedChartOptions({
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: "#b4b4af" }, grid: { color: "#2d3036" } },
        x: { ticks: { color: "#b4b4af" }, grid: { color: "#2d3036" } }
      }
    })
  });
}

function renderCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  qs("#calendarMonthLabel").textContent = today.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  const firstGridOffset = (firstDay.getDay() + 6) % 7;
  const firstGridDate = new Date(year, month, 1 - firstGridOffset);
  const progress = getDailyProgressMap();
  const cells = [];

  for (let offset = 0; offset < 42; offset += 1) {
    const cellDate = new Date(firstGridDate);
    cellDate.setDate(firstGridDate.getDate() + offset);
    const iso = cellDate.toISOString().slice(0, 10);
    const count = progress.get(iso) || 0;
    const level = Math.min(4, count);
    const inMonth = cellDate.getMonth() === month;
    cells.push(`
      <div class="calendar-day level-${level} ${inMonth ? "" : "muted"}">
        <strong>${cellDate.getDate()}</strong>
        <small>${count ? `${count} session${count === 1 ? "" : "s"}` : ""}</small>
      </div>
    `);
  }

  qs("#calendarGrid").innerHTML = cells.join("");
}

function renderDashboard() {
  renderSummaryCards();
  renderVrChart();
  renderDmChart();
  renderQrChart();
  renderSjtChart();
  renderCalendar();
  renderStreakBar();
}

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function exportData() {
  const rows = [
    ["type", "date", "accuracy", "time_seconds", "wpm", "extra"],
    ...state.data.vrSessions.map((item) => ["VR", item.date, item.accuracy || "", item.timeSeconds || "", item.avgWpm || item.wpm || "", item.totalQuestions || ""]),
    ...state.data.dmSessions.map((item) => ["DM", item.date, item.accuracy || "", item.timeSeconds || "", "", item.modeLabel || ""]),
    ...state.data.qrSessions.map((item) => ["QR", item.date, item.accuracy || "", item.timeSeconds || "", "", item.totalQuestions || ""]),
    ...state.data.sjtSessions.map((item) => ["SJT", item.date, item.accuracy || item.score || "", item.timeSeconds || "", "", item.totalQuestions || ""])
  ];
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `ucat-reflex-export-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function resetData() {
  state.data = structuredClone(defaultData);
  saveData();
  renderDashboard();
}

function wireSettings() {
  const persistToggle = qs("#persistMedicalMode");
  const medicalToggle = qs("#medicalModeToggle");
  const themeButtons = qsa("[data-theme-option]");
  persistToggle.checked = state.settings.rememberMedicalMode;
  medicalToggle.checked = state.settings.medicalMode;
  applyTheme(state.settings.theme);

  persistToggle.addEventListener("change", () => {
    state.settings.rememberMedicalMode = persistToggle.checked;
    if (!persistToggle.checked) {
      state.settings.medicalMode = false;
      medicalToggle.checked = false;
    }
    saveSettings();
  });

  medicalToggle.addEventListener("change", () => {
    state.settings.medicalMode = medicalToggle.checked;
    if (state.settings.rememberMedicalMode) {
      saveSettings();
    }
  });

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeOption);
      saveSettings();
    });
  });
}

function setupNavigation() {
  qsa(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      setScreen(button.dataset.screenTarget);
    });
  });
}

function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredPrompt = event;
    qs("#installButton").classList.remove("hidden");
  });

  qs("#installButton").addEventListener("click", async () => {
    if (!state.deferredPrompt) {
      return;
    }
    state.deferredPrompt.prompt();
    await state.deferredPrompt.userChoice;
    state.deferredPrompt = null;
    qs("#installButton").classList.add("hidden");
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
}

function createPercentageQuestion() {
  const base = randomInt(40, 320);
  const increase = sampleOne([5, 10, 12, 15, 20, 25]);
  return {
    type: "Percentage Increase",
    prompt: `${base} increased by ${increase}% = ?`,
    answer: roundTo((base * (100 + increase)) / 100, 2)
  };
}

function createReciprocalQuestion() {
  const denominator = sampleOne([2, 4, 5, 8, 10, 20, 25]);
  return {
    type: "1/x Decimal",
    prompt: `Convert 1/${denominator} to a decimal.`,
    answer: roundTo(1 / denominator, 4)
  };
}

function createCurrencyQuestion() {
  const pounds = randomInt(12, 180);
  const rate = sampleOne([1.12, 1.18, 1.24, 1.31]);
  return {
    type: "Currency Shift",
    prompt: `If £1 = €${rate}, how many euros is £${pounds}?`,
    answer: roundTo(pounds * rate, 2)
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init() {
  setupNavigation();
  wireSettings();
  setupInstallPrompt();
  registerServiceWorker();

  qs("#launchVrSession").addEventListener("click", () => startSession("vr"));
  qs("#launchDmSession").addEventListener("click", () => startSession("dm"));
  qs("#launchQrSession").addEventListener("click", () => startSession("qr"));
  qs("#launchSjtSession").addEventListener("click", () => startSession("sjt"));
  qs("#quitSessionButton").addEventListener("click", resetSessionAndHome);
  qs("#backHomeButton").addEventListener("click", resetSessionAndHome);
  qs("#exportButton").addEventListener("click", exportData);
  qs("#resetDataButton").addEventListener("click", resetData);

  renderDashboard();
  setScreen("home");
}

document.addEventListener("DOMContentLoaded", init);
