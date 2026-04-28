const STORAGE_KEY = "ucat-reflex-data-v3";
const LEGACY_STORAGE_KEYS = ["ucat-reflex-data-v2", "ucat-reflex-data"];
const SETTINGS_KEY = "ucat-reflex-settings";
const SESSION_LENGTH = 12;
const DM_SESSION_LENGTH = 11;

const defaultData = {
  vrSessions: [],
  dmSessions: [],
  qrSessions: [],
  sjtSessions: []
};

const defaultSettings = {
  rememberMedicalMode: true,
  medicalMode: false,
  theme: "light",
  enableHighlighting: true
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
  },
  {
    category: "Psychology",
    title: "Sleep, Revision, and Recall",
    text: "Students often assume that more late-night revision always leads to better recall, yet sleep research suggests a more complicated picture. Memory consolidation depends partly on rest, meaning an additional hour of tired studying may contribute less than expected. That does not imply revision time is unimportant. Instead, it suggests that the quality and timing of study may matter as much as the quantity. Learners who ignore sleep entirely can mistake effort for efficiency.",
    questions: [
      { prompt: "Sleep can play a role in memory consolidation.", answer: "True" },
      { prompt: "The passage says revision time has no value.", answer: "False" },
      { prompt: "Effort and efficiency are not always the same thing.", answer: "True" }
    ]
  }
];

const questionLibrary = vrLibrary.map((set, index) => ({
  id: `vr-set-${String(index + 1).padStart(3, "0")}`,
  type: "VR",
  title: set.title,
  category: set.category,
  passage: set.text,
  questions: set.questions.map((question, questionIndex) => ({
    id: `${String(index + 1).padStart(3, "0")}-${questionIndex + 1}`,
    text: question.prompt,
    answer: question.answer,
    rationale: question.rationale || ""
  }))
}));

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

const DM_SEEN_KEY = "ucat-reflex-dm-seen";
const MEDICAL_DICTIONARY = [
  "Pathogen", "Antibody", "Leukocyte", "Platelet", "Neuron", "Axon", "Synapse", "Myocardium", "Atrium", "Ventricle",
  "Aorta", "Bronchiole", "Alveolus", "Diaphragm", "Trachea", "Larynx", "Pharynx", "Oesophagus", "Hepatocyte", "Nephron",
  "Glomerulus", "Ureter", "Bladder", "Pancreas", "Spleen", "Thyroid", "Pituitary", "Hypothalamus", "Adrenal", "Insulin",
  "Glucagon", "Cortisol", "Histamine", "Cytokine", "Lymphocyte", "Macrophage", "PlasmaCell", "Antigen", "Enzyme", "Peptide",
  "Protein", "Genome", "Chromosome", "Allele", "Nucleus", "Mitochondrion", "Ribosome", "Lysosome", "Collagen", "Keratin",
  "Ligament", "Tendon", "Cartilage", "Femur", "Tibia", "Fibula", "Scapula", "Clavicle", "Pelvis", "Patella",
  "Mandible", "Maxilla", "Retina", "Cornea", "Iris", "Pupil", "Cochlea", "Vestibule", "Cerebellum", "Cortex",
  "Medulla", "SpinalCord", "Ganglion", "Myelin", "Dendrite", "Hormone", "Receptor", "Agonist", "Antagonist", "Analgesic",
  "Sedative", "Antibiotic", "Antiviral", "Vaccine", "Serum", "Biopsy", "Incision", "Suture", "Cannula", "Catheter",
  "Stethoscope", "Speculum", "Scalpel", "Forceps", "Syringe", "Infusion", "Dialysis", "Radiograph", "Ultrasound", "MRI",
  "CTScan", "Endoscope", "Pacemaker", "Defibrillator", "Ventilator", "Nebuliser", "Culture", "Assay", "Titrate", "Buffer",
  "Catalyst", "Solute", "Solvent", "Membrane", "Diffusion", "Osmosis", "Transporter", "Hemoglobin", "Plasma", "Erythrocyte",
  "Venule", "Arteriole", "Capillary", "Thrombus", "Embolus", "Ischaemia", "Hypoxia", "Sepsis", "Anaphylaxis", "Pyrexia",
  "Oedema", "Lesion", "Tumour", "Cyst", "Fracture", "Sprain", "Atrophy", "Necrosis", "Fibrosis", "Mutation",
  "Transcript", "Promoter", "Codon", "Proteinase", "Kinase", "Phagocyte", "Granulocyte", "Monocyte", "Basophil", "Eosinophil",
  "Neutrophil", "Sarcomere", "Myofibril", "Fascia", "Dermis", "Epidermis", "Follicle", "Papilla", "Canaliculi", "Osteocyte",
  "Osteoblast", "Osteoclast", "Chondrocyte", "Enterocyte", "Gastrin", "BileSalt", "Lactate", "AcetylCoA", "Glycogen", "Ketone",
  "Serotonin", "Dopamine", "Acetylcholine", "Noradrenaline", "Microglia", "Astrocyte", "Podocyte", "Mesangium", "Endometrium", "Myometrium",
  "Placenta", "Blastocyst", "Embryo", "Foetus", "Antrum", "Ileum", "Jejunum", "Duodenum", "Cecum", "Rectum",
  "Papule", "Nodule", "Abscess", "Granuloma", "Pathway", "Reuptake", "Filtration", "Perfusion", "Infarct", "Saturation"
];

class SyllogismGenerator {
  constructor({ medicalMode }) {
    this.medicalMode = medicalMode;
    this.simpleTerms = ["A", "B", "C", "D"];
    this.termMaps = [
      { A: "A", B: "B", C: "C", D: "D" },
      { A: "A", B: "C", C: "D", D: "B" }
    ];
  }

  generateSession(count = SESSION_LENGTH) {
    const weekKey = this.getWeekKey();
    const seenMap = this.loadSeenMap();
    const seenThisWeek = new Set(seenMap[weekKey] || []);
    const candidates = shuffle(this.buildAllCandidates());
    const unseen = candidates.filter((candidate) => !seenThisWeek.has(candidate.skeletonId));
    const selected = (unseen.length >= count ? unseen : candidates).slice(0, count);

    seenMap[weekKey] = [...new Set([...(seenMap[weekKey] || []), ...selected.map((item) => item.skeletonId)])];
    this.saveSeenMap(seenMap);

    return selected.map((candidate) => this.formatQuestion(candidate));
  }

  getWeekKey(date = new Date()) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
    return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
  }

  loadSeenMap() {
    try {
      return JSON.parse(localStorage.getItem(DM_SEEN_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  saveSeenMap(map) {
    localStorage.setItem(DM_SEEN_KEY, JSON.stringify(map));
  }

  buildAllCandidates() {
    return [
      ...this.generateLinearChain(),
      ...this.generateLinearOnlyChain(),
      ...this.generateThreeStepChain(),
      ...this.generateExclusionChain(),
      ...this.generateReverseExclusionChain(),
      ...this.generateSomeBridge(),
      ...this.generateMostBridge(),
      ...this.generateOnlyReverseChain(),
      ...this.generateDoubleOnlyChain(),
      ...this.generateBranchBarrier()
    ];
  }

  generateLinearChain() {
    return this.expandStructure("linear", [
      { title: "Linear Chain", premises: [["all", "A", "B"], ["all", "B", "C"]], valid: ["all", "A", "C"] },
      { title: "Linear Chain", premises: [["some", "A", "B"], ["all", "B", "C"]], valid: ["some", "A", "C"] },
      { title: "Linear Chain", premises: [["most", "A", "B"], ["all", "B", "C"]], valid: ["most", "A", "C"] },
      { title: "Linear Chain", premises: [["all", "A", "B"], ["most", "B", "C"]], valid: ["some", "A", "C"] }
    ]);
  }

  generateLinearOnlyChain() {
    return this.expandStructure("linear-only", [
      { title: "Only Chain", premises: [["all", "A", "B"], ["only", "C", "B"]], valid: ["all", "A", "C"] },
      { title: "Only Chain", premises: [["some", "A", "B"], ["only", "C", "B"]], valid: ["some", "A", "C"] },
      { title: "Only Chain", premises: [["most", "A", "B"], ["only", "C", "B"]], valid: ["most", "A", "C"] },
      { title: "Only Chain", premises: [["all", "D", "B"], ["only", "C", "B"]], valid: ["all", "D", "C"] }
    ]);
  }

  generateThreeStepChain() {
    return this.expandStructure("three-step", [
      { title: "Three-Step Chain", premises: [["all", "A", "B"], ["all", "B", "C"], ["all", "C", "D"]], valid: ["all", "A", "D"] },
      { title: "Three-Step Chain", premises: [["some", "A", "B"], ["all", "B", "C"], ["all", "C", "D"]], valid: ["some", "A", "D"] },
      { title: "Three-Step Chain", premises: [["most", "A", "B"], ["all", "B", "C"], ["all", "C", "D"]], valid: ["most", "A", "D"] },
      { title: "Three-Step Chain", premises: [["all", "A", "B"], ["all", "B", "C"], ["only", "D", "C"]], valid: ["all", "A", "D"] }
    ]);
  }

  generateExclusionChain() {
    return this.expandStructure("exclusion", [
      { title: "Exclusion Chain", premises: [["all", "A", "B"], ["no", "B", "C"]], valid: ["no", "A", "C"] },
      { title: "Exclusion Chain", premises: [["all", "D", "B"], ["no", "B", "C"]], valid: ["no", "D", "C"] },
      { title: "Exclusion Chain", premises: [["all", "A", "B"], ["only", "C", "D"], ["no", "B", "D"]], valid: ["no", "A", "C"] },
      { title: "Exclusion Chain", premises: [["most", "A", "B"], ["no", "B", "C"]], valid: ["some", "A", "B"] }
    ]);
  }

  generateReverseExclusionChain() {
    return this.expandStructure("reverse-exclusion", [
      { title: "Reverse Exclusion", premises: [["no", "A", "B"], ["all", "C", "B"]], valid: ["no", "C", "A"] },
      { title: "Reverse Exclusion", premises: [["no", "D", "B"], ["all", "C", "B"]], valid: ["no", "C", "D"] },
      { title: "Reverse Exclusion", premises: [["no", "A", "B"], ["only", "B", "C"]], valid: ["no", "C", "A"] },
      { title: "Reverse Exclusion", premises: [["no", "A", "B"], ["most", "C", "B"]], valid: ["some", "C", "B"] }
    ]);
  }

  generateSomeBridge() {
    return this.expandStructure("some-bridge", [
      { title: "Some Bridge", premises: [["some", "A", "B"], ["all", "B", "C"]], valid: ["some", "A", "C"] },
      { title: "Some Bridge", premises: [["some", "D", "B"], ["all", "B", "C"]], valid: ["some", "D", "C"] },
      { title: "Some Bridge", premises: [["some", "A", "B"], ["only", "C", "B"]], valid: ["some", "A", "C"] },
      { title: "Some Bridge", premises: [["some", "A", "B"], ["all", "B", "D"], ["all", "D", "C"]], valid: ["some", "A", "C"] }
    ]);
  }

  generateMostBridge() {
    return this.expandStructure("most-bridge", [
      { title: "Most Bridge", premises: [["most", "A", "B"], ["all", "B", "C"]], valid: ["most", "A", "C"] },
      { title: "Most Bridge", premises: [["most", "D", "B"], ["all", "B", "C"]], valid: ["most", "D", "C"] },
      { title: "Most Bridge", premises: [["most", "A", "B"], ["only", "C", "B"]], valid: ["most", "A", "C"] },
      { title: "Most Bridge", premises: [["most", "A", "B"], ["all", "B", "D"], ["all", "D", "C"]], valid: ["most", "A", "C"] }
    ]);
  }

  generateOnlyReverseChain() {
    return this.expandStructure("only-reverse", [
      { title: "Only Reverse", premises: [["only", "B", "C"], ["all", "A", "C"]], valid: ["all", "A", "B"] },
      { title: "Only Reverse", premises: [["only", "B", "C"], ["some", "A", "C"]], valid: ["some", "A", "B"] },
      { title: "Only Reverse", premises: [["only", "B", "C"], ["most", "A", "C"]], valid: ["most", "A", "B"] },
      { title: "Only Reverse", premises: [["only", "D", "C"], ["all", "A", "C"]], valid: ["all", "A", "D"] }
    ]);
  }

  generateDoubleOnlyChain() {
    return this.expandStructure("double-only", [
      { title: "Double Only", premises: [["only", "B", "C"], ["only", "C", "D"]], valid: ["only", "B", "D"] },
      { title: "Double Only", premises: [["only", "C", "D"], ["all", "A", "D"]], valid: ["all", "A", "C"] },
      { title: "Double Only", premises: [["only", "B", "C"], ["all", "A", "C"]], valid: ["all", "A", "B"] },
      { title: "Double Only", premises: [["only", "D", "B"], ["only", "B", "C"]], valid: ["only", "D", "C"] }
    ]);
  }

  generateBranchBarrier() {
    return this.expandStructure("branch-barrier", [
      { title: "Branch Barrier", premises: [["all", "A", "B"], ["all", "D", "B"], ["no", "B", "C"]], valid: ["no", "A", "C"] },
      { title: "Branch Barrier", premises: [["all", "A", "B"], ["all", "D", "B"], ["no", "B", "C"]], valid: ["no", "D", "C"] },
      { title: "Branch Barrier", premises: [["all", "A", "B"], ["all", "D", "B"], ["only", "C", "B"]], valid: ["all", "A", "C"] },
      { title: "Branch Barrier", premises: [["some", "A", "B"], ["all", "D", "B"], ["all", "B", "C"]], valid: ["some", "A", "C"] }
    ]);
  }

  expandStructure(prefix, patterns) {
    return patterns.flatMap((pattern, patternIndex) =>
      this.termMaps.map((termMap, mapIndex) => ({
        ...pattern,
        premises: pattern.premises.map(([operator, left, right]) => [operator, termMap[left], termMap[right]]),
        valid: [pattern.valid[0], termMap[pattern.valid[1]], termMap[pattern.valid[2]]],
        skeletonId: `${prefix}-${patternIndex}-${mapIndex}-${pattern.premises.map((premise) => premise[0]).join("-")}`
      }))
    );
  }

  formatQuestion(candidate) {
    const termMapping = this.createTermMapping();
    const validStatement = this.formatStatement(...candidate.valid);
    const distractors = this.buildDistractors(candidate);
    const indexedOptions = shuffle([
      { text: validStatement, correct: true },
      ...distractors.map((text) => ({ text, correct: false }))
    ]);

    return {
      mode: this.medicalMode ? "medical" : "simple",
      structure: candidate.title,
      premises: candidate.premises.map((premise) => this.skinStatement(this.formatStatement(...premise), termMapping)),
      options: indexedOptions.map((option) => this.skinStatement(option.text, termMapping)),
      answerIndex: indexedOptions.findIndex((option) => option.correct),
      skeletonId: candidate.skeletonId
    };
  }

  buildDistractors(candidate) {
    const [validOperator, left, right] = candidate.valid;
    const validStatement = this.formatStatement(validOperator, left, right);
    const premiseSubjects = candidate.premises.map(([, subject]) => subject);
    const premiseObjects = candidate.premises.map(([, , object]) => object);
    const termPool = [...new Set(candidate.premises.flatMap(([, subject, object]) => [subject, object]))];
    const distractors = [];

    const pushUnique = (statement) => {
      if (statement && statement !== validStatement && !distractors.includes(statement)) {
        distractors.push(statement);
      }
    };

    const converseSource = candidate.premises.find(([operator]) => operator === "all" || operator === "most")
      || (validOperator === "all" || validOperator === "most" ? candidate.valid : null);
    if (converseSource) {
      pushUnique(this.formatStatement(converseSource[0], converseSource[2], converseSource[1]));
    }

    const midGapLeft = premiseSubjects[0];
    const midGapRight = premiseSubjects.find((subject) => subject !== midGapLeft) || premiseObjects.at(-1);
    pushUnique(this.formatStatement("all", midGapLeft, midGapRight));

    let quantifierStretch = "";
    if (validOperator === "some" || validOperator === "most") {
      quantifierStretch = this.formatStatement("all", left, right);
    } else if (candidate.premises.some(([operator]) => operator === "some")) {
      const [somePremise] = candidate.premises.filter(([operator]) => operator === "some");
      quantifierStretch = this.formatStatement("all", somePremise[1], somePremise[2]);
    } else if (candidate.premises.some(([operator]) => operator === "most")) {
      const [mostPremise] = candidate.premises.filter(([operator]) => operator === "most");
      quantifierStretch = this.formatStatement("all", mostPremise[1], mostPremise[2]);
    } else {
      quantifierStretch = this.formatStatement("some", right, left);
    }
    pushUnique(quantifierStretch);

    [
      this.formatStatement("all", right, left),
      this.formatStatement("some", left, right),
      this.formatStatement("most", right, left),
      this.formatStatement("all", termPool.at(-1) || right, termPool[0] || left),
      this.formatStatement("no", left, termPool.find((term) => term !== right && term !== left) || right)
    ].forEach(pushUnique);

    return distractors.slice(0, 3);
  }

  formatStatement(operator, left, right) {
    if (operator === "all") {
      return `All ${left} are ${right}.`;
    }
    if (operator === "some") {
      return `Some ${left} are ${right}.`;
    }
    if (operator === "no") {
      return `No ${left} are ${right}.`;
    }
    if (operator === "most") {
      return `Most ${left} are ${right}.`;
    }
    return `Only ${left} are ${right}.`;
  }

  createTermMapping() {
    if (!this.medicalMode) {
      return { A: "A", B: "B", C: "C", D: "D" };
    }

    const terms = shuffle(MEDICAL_DICTIONARY).slice(0, 4);
    return { A: terms[0], B: terms[1], C: terms[2], D: terms[3] };
  }

  skinStatement(logicString, mapping) {
    if (!this.medicalMode) {
      return logicString;
    }
    return applyMedicalSkin(logicString, mapping);
  }
}

function applyMedicalSkin(logicString, mapping) {
  return logicString
    .replace(/\bA\b/g, mapping.A)
    .replace(/\bB\b/g, mapping.B)
    .replace(/\bC\b/g, mapping.C)
    .replace(/\bD\b/g, mapping.D)
    .replace(/\bE\b/g, mapping.E || "E");
}

const SIMPLE_DM_TERMS = [
  "Archive", "Beacon", "Circuit", "Delta", "Engine", "Filter", "Gateway", "Harbour", "Index", "Junction",
  "Kernel", "Ledger", "Matrix", "Node", "Orbit", "Portal", "Quartz", "Relay", "Signal", "Transit",
  "Unit", "Vector", "Workshop", "Yard", "Zone"
];

const logicLibrary = [
  {
    id: "chain-blocker",
    title: "Chain Blocker",
    rules: [["all", "A", "B"], ["all", "B", "C"], ["no", "C", "D"]],
    statements: [
      { rule: ["all", "A", "C"], answer: true },
      { rule: ["no", "A", "D"], answer: true },
      { rule: ["all", "C", "A"], answer: false },
      { rule: ["some", "A", "D"], answer: false },
      { rule: ["all", "D", "B"], answer: false }
    ]
  },
  {
    id: "double-branch-exclusion",
    title: "Double Branch",
    rules: [["all", "A", "B"], ["all", "D", "B"], ["no", "B", "C"]],
    statements: [
      { rule: ["no", "A", "C"], answer: true },
      { rule: ["no", "D", "C"], answer: true },
      { rule: ["all", "A", "D"], answer: false },
      { rule: ["some", "C", "B"], answer: false },
      { rule: ["all", "C", "A"], answer: false }
    ]
  },
  {
    id: "some-chain",
    title: "Some Chain",
    rules: [["some", "A", "B"], ["all", "B", "C"], ["no", "C", "D"]],
    statements: [
      { rule: ["some", "A", "C"], answer: true },
      { rule: ["no", "B", "D"], answer: true },
      { rule: ["all", "A", "C"], answer: false },
      { rule: ["some", "D", "B"], answer: false },
      { rule: ["all", "C", "B"], answer: false }
    ]
  },
  {
    id: "reverse-exclusion",
    title: "Reverse Exclusion",
    rules: [["no", "A", "B"], ["all", "C", "B"], ["all", "D", "A"]],
    statements: [
      { rule: ["no", "C", "A"], answer: true },
      { rule: ["no", "D", "B"], answer: true },
      { rule: ["all", "A", "D"], answer: false },
      { rule: ["some", "C", "D"], answer: false },
      { rule: ["all", "B", "C"], answer: false }
    ]
  },
  {
    id: "four-step-barrier",
    title: "Four-Step Barrier",
    rules: [["all", "A", "B"], ["all", "B", "C"], ["all", "C", "D"], ["no", "D", "E"]],
    statements: [
      { rule: ["all", "A", "D"], answer: true },
      { rule: ["no", "A", "E"], answer: true },
      { rule: ["all", "D", "A"], answer: false },
      { rule: ["some", "E", "A"], answer: false },
      { rule: ["all", "E", "C"], answer: false }
    ]
  },
  {
    id: "partial-overlap",
    title: "Partial Overlap",
    rules: [["some", "A", "B"], ["some", "B", "C"], ["no", "C", "D"]],
    statements: [
      { rule: ["some", "B", "C"], answer: true },
      { rule: ["no", "D", "C"], answer: true },
      { rule: ["all", "A", "C"], answer: false },
      { rule: ["some", "A", "D"], answer: false },
      { rule: ["all", "B", "D"], answer: false }
    ]
  },
  {
    id: "all-some-branch",
    title: "All-Some Branch",
    rules: [["all", "A", "B"], ["some", "C", "B"], ["no", "B", "D"]],
    statements: [
      { rule: ["no", "A", "D"], answer: true },
      { rule: ["some", "C", "B"], answer: true },
      { rule: ["all", "C", "A"], answer: false },
      { rule: ["some", "A", "D"], answer: false },
      { rule: ["all", "D", "B"], answer: false }
    ]
  },
  {
    id: "most-chain",
    title: "Most Chain",
    rules: [["most", "A", "B"], ["all", "B", "C"], ["no", "C", "D"]],
    statements: [
      { rule: ["most", "A", "C"], answer: true },
      { rule: ["no", "B", "D"], answer: true },
      { rule: ["all", "A", "C"], answer: false },
      { rule: ["some", "D", "B"], answer: false },
      { rule: ["all", "C", "B"], answer: false }
    ]
  },
  {
    id: "split-chain",
    title: "Split Chain",
    rules: [["all", "A", "B"], ["no", "B", "C"], ["all", "D", "C"]],
    statements: [
      { rule: ["no", "A", "C"], answer: true },
      { rule: ["no", "A", "D"], answer: true },
      { rule: ["all", "C", "D"], answer: false },
      { rule: ["some", "A", "D"], answer: false },
      { rule: ["all", "D", "B"], answer: false }
    ]
  },
  {
    id: "some-four-step",
    title: "Some Four-Step",
    rules: [["some", "A", "B"], ["all", "B", "C"], ["all", "C", "D"], ["no", "D", "E"]],
    statements: [
      { rule: ["some", "A", "D"], answer: true },
      { rule: ["no", "C", "E"], answer: true },
      { rule: ["all", "A", "D"], answer: false },
      { rule: ["some", "A", "E"], answer: false },
      { rule: ["all", "E", "D"], answer: false }
    ]
  },
  {
    id: "branch-comparison",
    title: "Branch Comparison",
    rules: [["all", "A", "B"], ["all", "C", "B"], ["all", "B", "D"], ["no", "D", "E"]],
    statements: [
      { rule: ["all", "A", "D"], answer: true },
      { rule: ["no", "C", "E"], answer: true },
      { rule: ["all", "A", "C"], answer: false },
      { rule: ["some", "E", "B"], answer: false },
      { rule: ["all", "E", "A"], answer: false }
    ]
  },
  {
    id: "nested-negation",
    title: "Nested Negation",
    rules: [["no", "A", "B"], ["all", "C", "A"], ["all", "D", "B"], ["some", "E", "D"]],
    statements: [
      { rule: ["no", "C", "D"], answer: true },
      { rule: ["some", "E", "B"], answer: true },
      { rule: ["all", "E", "A"], answer: false },
      { rule: ["some", "C", "D"], answer: false },
      { rule: ["no", "E", "B"], answer: false }
    ]
  },
  {
    id: "most-some-branch",
    title: "Most-Some Branch",
    rules: [["most", "A", "B"], ["all", "C", "B"], ["no", "B", "D"], ["some", "E", "C"]],
    statements: [
      { rule: ["no", "C", "D"], answer: true },
      { rule: ["some", "E", "B"], answer: true },
      { rule: ["all", "A", "C"], answer: false },
      { rule: ["some", "A", "D"], answer: false },
      { rule: ["all", "D", "B"], answer: false }
    ]
  },
  {
    id: "resource-barrier",
    title: "Resource Barrier",
    rules: [["all", "A", "B"], ["some", "B", "C"], ["no", "C", "D"], ["all", "E", "D"]],
    statements: [
      { rule: ["no", "C", "E"], answer: true },
      { rule: ["all", "E", "D"], answer: true },
      { rule: ["all", "A", "C"], answer: false },
      { rule: ["some", "A", "C"], answer: false },
      { rule: ["all", "B", "C"], answer: false }
    ]
  },
  {
    id: "dual-chain",
    title: "Dual Chain",
    rules: [["all", "A", "B"], ["all", "B", "C"], ["all", "D", "E"], ["no", "C", "E"]],
    statements: [
      { rule: ["no", "A", "D"], answer: true },
      { rule: ["all", "A", "C"], answer: true },
      { rule: ["all", "D", "A"], answer: false },
      { rule: ["some", "A", "E"], answer: false },
      { rule: ["all", "E", "D"], answer: false }
    ]
  }
];

function createPairKey(left, right) {
  return [left, right].sort().join("::");
}

function evaluateLogic(rules, statementRule, mapping = {}) {
  const terms = [...new Set([...rules.flatMap((rule) => [rule[1], rule[2]]), statementRule[1], statementRule[2]])];
  const subset = new Map();
  const disjoint = new Set();
  const some = new Set();
  const most = new Set();

  const setSubset = (left, right) => {
    if (!subset.has(left)) {
      subset.set(left, new Set());
    }
    subset.get(left).add(right);
  };

  const hasSubset = (left, right) => subset.has(left) && subset.get(left).has(right);
  const setDisjoint = (left, right) => disjoint.add(createPairKey(left, right));
  const hasDisjoint = (left, right) => disjoint.has(createPairKey(left, right));
  const setSome = (left, right) => some.add(createPairKey(left, right));
  const hasSome = (left, right) => some.has(createPairKey(left, right));
  const setMost = (left, right) => most.add(`${left}::${right}`);
  const hasMost = (left, right) => most.has(`${left}::${right}`);
  const label = (term) => mapping[term] || term;

  terms.forEach((term) => setSubset(term, term));

  rules.forEach(([operator, left, right]) => {
    if (operator === "all") {
      setSubset(left, right);
    } else if (operator === "no") {
      setDisjoint(left, right);
    } else if (operator === "some") {
      setSome(left, right);
    } else if (operator === "most") {
      setMost(left, right);
      setSome(left, right);
    }
  });

  let changed = true;
  while (changed) {
    changed = false;

    terms.forEach((left) => {
      terms.forEach((middle) => {
        terms.forEach((right) => {
          if (hasSubset(left, middle) && hasSubset(middle, right) && !hasSubset(left, right)) {
            setSubset(left, right);
            changed = true;
          }
        });
      });
    });

    terms.forEach((left) => {
      terms.forEach((right) => {
        if (hasDisjoint(left, right)) {
          terms.forEach((candidate) => {
            if (hasSubset(candidate, left) && !hasDisjoint(candidate, right)) {
              setDisjoint(candidate, right);
              changed = true;
            }
            if (hasSubset(candidate, right) && !hasDisjoint(left, candidate)) {
              setDisjoint(left, candidate);
              changed = true;
            }
          });
        }
      });
    });

    Array.from(some).forEach((pair) => {
      const [left, right] = pair.split("::");
      terms.forEach((candidate) => {
        if (hasSubset(left, candidate) && !hasSome(candidate, right)) {
          setSome(candidate, right);
          changed = true;
        }
        if (hasSubset(right, candidate) && !hasSome(left, candidate)) {
          setSome(left, candidate);
          changed = true;
        }
      });
    });

    Array.from(most).forEach((pair) => {
      const [left, right] = pair.split("::");
      terms.forEach((candidate) => {
        if (hasSubset(right, candidate) && !hasMost(left, candidate)) {
          setMost(left, candidate);
          changed = true;
        }
      });
    });
  }

  const [operator, left, right] = statementRule;

  if (operator === "all") {
    if (hasSubset(left, right)) {
      return {
        answer: true,
        rationale: `${label(left)} is fully contained within ${label(right)}, so the statement is YES.`
      };
    }
    if (hasDisjoint(left, right)) {
      return {
        answer: false,
        rationale: `${label(left)} and ${label(right)} are disjoint, so “All ${label(left)} are ${label(right)}” must be NO.`
      };
    }
    return {
      answer: false,
      rationale: `There is not enough information to prove that every ${label(left)} belongs to ${label(right)}, so under UCAT rules the answer is NO.`
    };
  }

  if (operator === "no") {
    if (hasDisjoint(left, right)) {
      return {
        answer: true,
        rationale: `${label(left)} and ${label(right)} have no overlap, so the statement is YES.`
      };
    }
    if (hasSome(left, right)) {
      return {
        answer: false,
        rationale: `There is confirmed overlap between ${label(left)} and ${label(right)}, so the statement must be NO.`
      };
    }
    return {
      answer: false,
      rationale: `The premises do not prove that ${label(left)} and ${label(right)} are completely separate, so under UCAT rules the answer is NO.`
    };
  }

  if (operator === "some") {
    if (hasSome(left, right)) {
      return {
        answer: true,
        rationale: `The premises establish at least one overlap between ${label(left)} and ${label(right)}, so the statement is YES.`
      };
    }
    if (hasDisjoint(left, right)) {
      return {
        answer: false,
        rationale: `${label(left)} and ${label(right)} are disjoint, so “Some ${label(left)} are ${label(right)}” must be NO.`
      };
    }
    return {
      answer: false,
      rationale: `The premises never guarantee any overlap between ${label(left)} and ${label(right)}, so under UCAT rules the answer is NO.`
    };
  }

  if (operator === "most") {
    if (hasMost(left, right)) {
      return {
        answer: true,
        rationale: `The “most” relationship carries through the rule chain, so the statement is YES.`
      };
    }
    if (hasDisjoint(left, right)) {
      return {
        answer: false,
        rationale: `${label(left)} and ${label(right)} are disjoint, so a “most” overlap is impossible and the answer is NO.`
      };
    }
    return {
      answer: false,
      rationale: `The premises do not prove that most ${label(left)} belong to ${label(right)}, so under UCAT rules the answer is NO.`
    };
  }

  return {
    answer: false,
    rationale: `The premises do not establish this relationship with certainty, so under UCAT rules the answer is NO.`
  };
}

class DmChecklistGenerator {
  constructor({ medicalMode }) {
    this.medicalMode = medicalMode;
  }

  generateSession(count = DM_SESSION_LENGTH) {
    const weekKey = this.getWeekKey();
    const seenMap = this.loadSeenMap();
    const seenThisWeek = new Set(seenMap[weekKey] || []);
    const candidates = shuffle(logicLibrary);
    const unseen = candidates.filter((template) => !seenThisWeek.has(template.id));
    const selected = (unseen.length >= count ? unseen : candidates).slice(0, count);

    seenMap[weekKey] = [...new Set([...(seenMap[weekKey] || []), ...selected.map((template) => template.id)])];
    this.saveSeenMap(seenMap);

    return selected.map((template) => this.formatTemplate(template));
  }

  getWeekKey(date = new Date()) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
    return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
  }

  loadSeenMap() {
    try {
      return JSON.parse(localStorage.getItem(DM_SEEN_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  saveSeenMap(map) {
    localStorage.setItem(DM_SEEN_KEY, JSON.stringify(map));
  }

  createTermMapping() {
    const pool = this.medicalMode ? MEDICAL_DICTIONARY : SIMPLE_DM_TERMS;
    const terms = shuffle(pool).slice(0, 5);
    return {
      A: terms[0],
      B: terms[1],
      C: terms[2],
      D: terms[3],
      E: terms[4]
    };
  }

  formatRule([operator, left, right], mapping) {
    const from = mapping[left];
    const to = mapping[right];

    if (operator === "all") {
      return `All members of the ${from} group are members of the ${to} group.`;
    }
    if (operator === "some") {
      return `Some members of the ${from} group are members of the ${to} group.`;
    }
    if (operator === "no") {
      return `No members of the ${from} group are members of the ${to} group.`;
    }
    if (operator === "most") {
      return `Most members of the ${from} group are members of the ${to} group.`;
    }
    return `Only members of the ${from} group are members of the ${to} group.`;
  }

  formatTemplate(template) {
    const mapping = this.createTermMapping();
    const statements = shuffle(template.statements.map((statement) => {
      const evaluation = evaluateLogic(template.rules, statement.rule, mapping);
      return {
        text: this.formatRule(statement.rule, mapping),
        answer: evaluation.answer,
        rule: statement.rule,
        rationale: evaluation.rationale
      };
    }));

    return {
      mode: this.medicalMode ? "medical" : "simple",
      structure: template.title,
      premise: template.rules.map((rule) => this.formatRule(rule, mapping)).join(" "),
      statements,
      rules: template.rules,
      mapping,
      templateId: template.id
    };
  }
}

const sjtContexts = [
  { label: "the emergency department", timing: "during a busy evening handover" },
  { label: "general practice", timing: "during a fully booked morning clinic" },
  { label: "medical school", timing: "during a teaching session with patient contact" },
  { label: "a nursing home", timing: "during a short-staffed afternoon shift" }
];

const sjtCharacters = [
  "Dr Smith, a foundation doctor",
  "a fellow student",
  "a senior consultant",
  "a receptionist",
  "the ward pharmacist",
  "a healthcare assistant"
];

const sjtThemes = {
  Autonomy: [
    {
      id: "patient-refuses-consent",
      title: "Patient Refuses Consent",
      scenarioTemplate: "While in {setting} {timing}, {character} tells you that a patient has clearly refused a recommended procedure, but the team is tempted to continue persuading them because the test would be useful.",
      rationale: "This tests Autonomy - a competent patient's informed choice must be respected even when clinicians disagree with it.",
      appropriateness: {
        ideal: "Check that the patient has understood the information, respect the refusal, and escalate to the supervising clinician so the decision is documented properly.",
        reasonable: "Ask whether the patient would like a calmer follow-up discussion with a senior clinician before any further decisions are made.",
        mild: "Say nothing for now because the team probably knows the patient best.",
        severe: "Help the team continue toward the procedure without focusing on consent because the investigation seems beneficial."
      },
      importance: {
        ideal: "Whether the patient has capacity and has made an informed decision.",
        secondary: "Whether the refusal has been communicated clearly to the responsible clinician.",
        mild: "Whether the conversation might delay the clinic list.",
        severe: "Whether it would be easier for staff if the patient simply agreed."
      }
    },
    {
      id: "confidential-update",
      title: "Confidential Update Request",
      scenarioTemplate: "In {setting} {timing}, {character} is being pressed by a worried relative for confidential information about a patient's diagnosis even though the patient's wishes are unclear.",
      rationale: "This tests Autonomy - patients control who receives their personal information unless there is a lawful reason to override that.",
      appropriateness: {
        ideal: "Explain that confidential information cannot be shared without permission and help arrange a conversation that respects the patient's wishes.",
        reasonable: "Check whether the patient has already given consent for information sharing before saying anything further.",
        mild: "Offer a vague hint because the relative seems genuinely upset.",
        severe: "Give the relative a full update because they appear closely involved in the patient's care."
      },
      importance: {
        ideal: "Whether the patient has consented to information being shared.",
        secondary: "How to maintain confidentiality while still responding politely to the relative.",
        mild: "Whether refusing to answer might make the relative annoyed.",
        severe: "Whether giving a quick update would save time for the team."
      }
    },
    {
      id: "student-observer",
      title: "Student Observation",
      scenarioTemplate: "At {setting} {timing}, {character} wants a student to observe a sensitive conversation with a patient, but the patient has not yet been asked.",
      rationale: "This tests Autonomy - patients should be able to decide who is present during their care without pressure.",
      appropriateness: {
        ideal: "Ask the patient privately first and make clear that declining will not affect their care.",
        reasonable: "Check with the supervising clinician about the best time to seek the patient's permission respectfully.",
        mild: "Assume the patient will not mind because students are common in healthcare settings.",
        severe: "Bring the student in immediately and decide afterwards whether the patient seemed comfortable."
      },
      importance: {
        ideal: "Whether the patient has been given a genuine opportunity to consent or refuse.",
        secondary: "How to ask in a way that avoids making the patient feel pressured.",
        mild: "Whether the student needs to complete a placement requirement today.",
        severe: "Whether it would be inconvenient to pause before the discussion begins."
      }
    },
    {
      id: "patient-recording",
      title: "Recording a Consultation",
      scenarioTemplate: "During work in {setting} {timing}, {character} tells you that a patient wants to record part of a consultation because they are worried they will forget the advice.",
      rationale: "This tests Autonomy - patients may need support to understand and retain information in order to make informed decisions.",
      appropriateness: {
        ideal: "Respond respectfully, check local policy if needed, and involve the clinician so the request is handled transparently.",
        reasonable: "Explore whether written information or a summary might also help the patient remember the discussion accurately.",
        mild: "Refuse immediately because recordings can be awkward for staff.",
        severe: "Ignore the request and continue the consultation as though it was never raised."
      },
      importance: {
        ideal: "Whether the patient can access information in a way that supports informed decision-making.",
        secondary: "How to manage the request transparently and within local policy.",
        mild: "Whether the request might slightly slow down the clinic.",
        severe: "Whether the easiest option is to shut the request down without discussion."
      }
    },
    {
      id: "leaving-before-review",
      title: "Leaving Before Review",
      scenarioTemplate: "While in {setting} {timing}, {character} mentions that a patient wants to leave before review because they are frustrated by delays and feel no one is listening.",
      rationale: "This tests Autonomy - patients can make choices about their care, but they should do so with a clear understanding of the risks.",
      appropriateness: {
        ideal: "Explore the patient's concerns, explain the risks of leaving, and alert the responsible clinician so the decision can be managed safely.",
        reasonable: "Ask whether a brief update from the clinical team would help the patient make an informed choice about staying.",
        mild: "Tell the patient to stay because the team has already spent time on them.",
        severe: "Let the patient walk out without informing anyone because it is their choice."
      },
      importance: {
        ideal: "Whether the patient understands the risks and alternatives before leaving.",
        secondary: "How quickly the responsible clinician can review or document the situation.",
        mild: "Whether the department will look less busy if the patient leaves.",
        severe: "Whether it is easier for staff if the matter is ignored."
      }
    }
  ],
  Beneficence: [
    {
      id: "missed-result",
      title: "Missed Abnormal Result",
      scenarioTemplate: "In {setting} {timing}, {character} notices a significant abnormal result that has not yet been acted on and may affect a patient's treatment today.",
      rationale: "This tests Beneficence - clinicians should act positively to help patients and make sure important concerns are addressed promptly.",
      appropriateness: {
        ideal: "Escalate the result promptly to the responsible clinician and help make sure it is reviewed before the patient moves on.",
        reasonable: "Check the notes and gather the relevant details so the concern can be handed over clearly and efficiently.",
        mild: "Assume a senior doctor will probably notice it later.",
        severe: "Ignore the result because raising it might interrupt a busy ward round."
      },
      importance: {
        ideal: "Whether the patient may be harmed if the result is not reviewed promptly.",
        secondary: "How to communicate the concern clearly to the clinician in charge.",
        mild: "Whether speaking up might feel awkward in front of seniors.",
        severe: "Whether delaying the issue would keep the workflow smoother."
      }
    },
    {
      id: "distressed-patient",
      title: "Distressed Patient",
      scenarioTemplate: "At {setting} {timing}, {character} is dealing with a patient who is becoming increasingly distressed and says they no longer understand what is happening.",
      rationale: "This tests Beneficence - patients benefit when clinicians respond supportively and help them understand what is happening.",
      appropriateness: {
        ideal: "Acknowledge the distress, offer a calm update if appropriate, and arrange timely clinical review.",
        reasonable: "Check what information the patient has already received so the next explanation is consistent and useful.",
        mild: "Tell the patient to wait quietly because everyone is busy.",
        severe: "Avoid the patient completely because you might say the wrong thing."
      },
      importance: {
        ideal: "Whether the patient needs timely explanation and review to reduce distress safely.",
        secondary: "How to give information that is accurate and consistent with the care plan.",
        mild: "Whether engaging with the patient could slow the team down.",
        severe: "Whether it would be easier if someone else noticed the problem instead."
      }
    },
    {
      id: "wellbeing-hint",
      title: "Hint of Poor Wellbeing",
      scenarioTemplate: "During work in {setting} {timing}, {character} hears a patient hint that things at home feel unmanageable but then quickly changes the subject.",
      rationale: "This tests Beneficence - subtle concerns still deserve supportive follow-up when a patient may need help.",
      appropriateness: {
        ideal: "Take the concern seriously, respond supportively, and escalate so the patient can be assessed further.",
        reasonable: "Invite the patient to say a little more if they feel comfortable while making sure support is available.",
        mild: "Leave the topic alone because the patient did not explicitly ask for help.",
        severe: "Redirect the patient sharply to save time and avoid a difficult conversation."
      },
      importance: {
        ideal: "Whether the patient may need timely support even though the concern was mentioned briefly.",
        secondary: "How to create a safe opportunity for the patient to speak more openly.",
        mild: "Whether asking follow-up questions might make the clinic run late.",
        severe: "Whether it is simpler to pretend the comment was never made."
      }
    },
    {
      id: "communication-barrier",
      title: "Communication Barrier",
      scenarioTemplate: "While in {setting} {timing}, {character} realises that a patient is nodding politely but appears confused by the explanation they have been given.",
      rationale: "This tests Beneficence - helping patients genuinely understand their care is part of acting in their best interests.",
      appropriateness: {
        ideal: "Raise the concern sensitively and help arrange a clearer explanation or appropriate support.",
        reasonable: "Check whether written information, translation, or a quieter conversation would help communication.",
        mild: "Assume the patient understands because they have not disagreed.",
        severe: "Repeat the same explanation more quickly and move on."
      },
      importance: {
        ideal: "Whether the patient truly understands the information they need to make decisions.",
        secondary: "What practical support would improve communication most effectively.",
        mild: "Whether the conversation is becoming repetitive for staff.",
        severe: "Whether the team can avoid spending more time on the issue."
      }
    },
    {
      id: "follow-up-gap",
      title: "Follow-up Gap",
      scenarioTemplate: "At {setting} {timing}, {character} notices that a patient may be discharged without a key follow-up arrangement being clearly in place.",
      rationale: "This tests Beneficence - good care includes making sure the next steps are safe and genuinely helpful for the patient.",
      appropriateness: {
        ideal: "Raise the concern with the responsible clinician so the discharge plan can be checked before the patient leaves.",
        reasonable: "Review the written plan first so you can identify exactly what may be missing.",
        mild: "Mention it later if there happens to be time.",
        severe: "Say nothing because discharge planning is someone else's responsibility."
      },
      importance: {
        ideal: "Whether the patient may come to harm if follow-up or support is missing.",
        secondary: "How to clarify the gap so the right clinician can address it quickly.",
        mild: "Whether bringing it up might inconvenience the team.",
        severe: "Whether keeping quiet would avoid extra work before discharge."
      }
    }
  ],
  "Non-maleficence": [
    {
      id: "intoxicated-peer",
      title: "Impaired Colleague",
      scenarioTemplate: "In {setting} {timing}, {character} appears intoxicated or otherwise impaired but is still expected to take part in patient-related work.",
      rationale: "This tests Non-maleficence - patient safety comes before avoiding embarrassment or protecting a colleague from scrutiny.",
      appropriateness: {
        ideal: "Escalate the concern immediately and make sure the person is kept away from direct patient care until a senior intervenes.",
        reasonable: "Speak to the person privately while arranging prompt senior support so the risk can be managed safely.",
        mild: "Wait to see whether anyone else notices because you do not want to embarrass them.",
        severe: "Help them continue working and agree to keep the issue secret."
      },
      importance: {
        ideal: "The immediate risk to patient safety if the person continues working.",
        secondary: "How quickly an appropriate senior can intervene and manage the situation.",
        mild: "Whether raising the concern could make the team atmosphere awkward.",
        severe: "Whether protecting the colleague's reputation would be easier than reporting the issue."
      }
    },
    {
      id: "prescribing-error",
      title: "Possible Prescribing Error",
      scenarioTemplate: "While in {setting} {timing}, {character} notices a prescription or dose that looks unusually unsafe for the patient involved.",
      rationale: "This tests Non-maleficence - possible harm should be addressed before treatment continues.",
      appropriateness: {
        ideal: "Pause the process and escalate the concern immediately so the prescription can be checked before anything is given.",
        reasonable: "Review the chart and relevant guidance promptly so the concern can be communicated clearly.",
        mild: "Assume the signed prescription must already be correct.",
        severe: "Proceed with the medication anyway because the team is under pressure."
      },
      importance: {
        ideal: "Whether the patient could be harmed if the prescription is wrong.",
        secondary: "How to verify and communicate the concern rapidly and accurately.",
        mild: "Whether challenging the prescription might irritate a senior colleague.",
        severe: "Whether keeping the drug round moving is easier than stopping to check."
      }
    },
    {
      id: "identity-mismatch",
      title: "Identity Mismatch",
      scenarioTemplate: "At {setting} {timing}, {character} spots a mismatch between a patient's identity details and a label or form that is about to be used.",
      rationale: "This tests Non-maleficence - even small identification errors can lead to serious harm if ignored.",
      appropriateness: {
        ideal: "Stop the process and raise the mismatch immediately so identity can be confirmed before anything continues.",
        reasonable: "Check the documentation carefully so you can explain exactly where the discrepancy appears to be.",
        mild: "Carry on because the names are similar and the service is running late.",
        severe: "Ignore the discrepancy unless someone else points it out first."
      },
      importance: {
        ideal: "Whether proceeding without checking identity could expose the patient to harm.",
        secondary: "How to identify the exact source of the mismatch so it can be corrected quickly.",
        mild: "Whether stopping now might slow the clinic or ward round.",
        severe: "Whether it is easier to hope that the paperwork is close enough."
      }
    },
    {
      id: "infection-control",
      title: "Infection Control Lapse",
      scenarioTemplate: "During work in {setting} {timing}, {character} moves between patients without following expected infection control precautions.",
      rationale: "This tests Non-maleficence - preventable risks should be addressed promptly to avoid harming patients.",
      appropriateness: {
        ideal: "Address the risk promptly and appropriately, escalating if necessary so the lapse does not continue.",
        reasonable: "Remind the person courteously of the required precautions if it is appropriate for you to do so.",
        mild: "Say nothing because the person may not appreciate being corrected.",
        severe: "Decide it is acceptable as long as no patient appears unwell immediately afterwards."
      },
      importance: {
        ideal: "Whether patients may be exposed to avoidable infection risk if the lapse continues.",
        secondary: "How to intervene quickly without losing sight of the immediate safety issue.",
        mild: "Whether the person might feel embarrassed if challenged.",
        severe: "Whether ignoring the lapse would avoid an awkward interaction."
      }
    },
    {
      id: "deteriorating-patient",
      title: "Deteriorating Patient",
      scenarioTemplate: "In {setting} {timing}, {character} notices that a patient seems more unwell than before, but the planned review has not yet happened.",
      rationale: "This tests Non-maleficence - worsening clinical risk should be escalated promptly rather than watched passively.",
      appropriateness: {
        ideal: "Escalate the change promptly so the patient can be reassessed before further deterioration occurs.",
        reasonable: "Document the changes clearly while finding the appropriate clinician to review the patient.",
        mild: "Wait a little longer to see whether the patient settles on their own.",
        severe: "Avoid interrupting anyone because the team already looks busy."
      },
      importance: {
        ideal: "Whether the patient's condition may be worsening in a way that needs urgent review.",
        secondary: "How to communicate the change clearly so the right clinician responds quickly.",
        mild: "Whether escalating now might disrupt a busy team.",
        severe: "Whether it is easier to delay action until someone else becomes concerned."
      }
    }
  ],
  Justice: [
    {
      id: "fair-prioritisation",
      title: "Fair Prioritisation",
      scenarioTemplate: "At {setting} {timing}, {character} is under pressure because one demanding person wants to be seen first while another quieter patient may have greater clinical need.",
      rationale: "This tests Justice - resources and attention should be allocated fairly and according to need, not volume or status.",
      appropriateness: {
        ideal: "Support prioritisation based on clinical need and fairness rather than on who is most vocal.",
        reasonable: "Explain delays transparently and help ensure both people are reassessed if their condition may have changed.",
        mild: "Move the louder person forward mainly to reduce complaints.",
        severe: "Ignore the quieter person because they are not actively objecting."
      },
      importance: {
        ideal: "Which person has the greatest clinical need rather than who is complaining the most.",
        secondary: "How to communicate decisions fairly and transparently to those affected.",
        mild: "Whether the waiting area would feel calmer if the loudest person was satisfied first.",
        severe: "Whether avoiding a complaint matters more than fair access to care."
      }
    },
    {
      id: "interpreter-access",
      title: "Interpreter Access",
      scenarioTemplate: "While in {setting} {timing}, {character} suggests relying entirely on a relative to interpret for a patient because arranging formal language support may take longer.",
      rationale: "This tests Justice - patients should have fair access to communication support so they can engage equally in their care.",
      appropriateness: {
        ideal: "Raise the need for appropriate communication support so the patient can participate properly in decisions about their care.",
        reasonable: "Check whether an approved interpreter can be arranged while involving the relative only if the patient wants that.",
        mild: "Rely on the relative because it seems quicker and the service is busy.",
        severe: "Carry on without checking whether the patient truly understands."
      },
      importance: {
        ideal: "Whether the patient has equitable access to information and decision-making support.",
        secondary: "How to arrange practical communication support without unnecessary delay.",
        mild: "Whether formal support might slow the clinic down.",
        severe: "Whether convenience for staff matters more than equal access."
      }
    },
    {
      id: "resource-allocation",
      title: "Limited Resource Allocation",
      scenarioTemplate: "In {setting} {timing}, {character} is involved in deciding how to use a single urgent slot or limited resource that could benefit more than one patient.",
      rationale: "This tests Justice - limited resources should be distributed using fair and clinically relevant criteria.",
      appropriateness: {
        ideal: "Escalate the issue so the decision is made using transparent clinical priority rather than convenience.",
        reasonable: "Make sure the relevant information about each patient is available to support a fair decision.",
        mild: "Give the slot to whoever has been waiting longest regardless of urgency.",
        severe: "Offer the resource to whichever patient seems easiest to manage."
      },
      importance: {
        ideal: "Which option is fairest when judged against clinical need and transparent criteria.",
        secondary: "Whether the decision can be explained clearly to the people affected.",
        mild: "Whether choosing the quickest option would reduce administrative hassle.",
        severe: "Whether staff convenience should drive the decision."
      }
    },
    {
      id: "favouritism",
      title: "Favouritism Pressure",
      scenarioTemplate: "At {setting} {timing}, {character} suggests making an exception for someone they know personally even though others are waiting under the same rules.",
      rationale: "This tests Justice - policies should usually be applied consistently unless there is a clear and legitimate reason not to.",
      appropriateness: {
        ideal: "Support applying the usual policy consistently unless there is a genuine clinical reason to do otherwise.",
        reasonable: "Ask a senior member of staff to review the situation if there may be a justified exception.",
        mild: "Allow the exception because it may keep the person happy.",
        severe: "Encourage more personal exceptions so difficult conversations can be avoided."
      },
      importance: {
        ideal: "Whether others in the same situation would be treated under the same standard.",
        secondary: "Whether any genuine clinical reason exists to justify an exception.",
        mild: "Whether saying no might feel uncomfortable socially.",
        severe: "Whether personal connections should influence access to care."
      }
    },
    {
      id: "student-opportunity",
      title: "Unequal Learning Opportunity",
      scenarioTemplate: "During work in {setting} {timing}, {character} keeps directing useful learning opportunities to the same small group while others are repeatedly overlooked.",
      rationale: "This tests Justice - fairness also applies to opportunities, supervision, and access within professional environments.",
      appropriateness: {
        ideal: "Raise the fairness concern appropriately so opportunities can be distributed more consistently.",
        reasonable: "Gather clear examples before discussing the pattern with the person responsible or an appropriate supervisor.",
        mild: "Ignore the issue because favouritism can happen in busy teams.",
        severe: "Try to secure advantage for yourself by joining in with the unfair pattern."
      },
      importance: {
        ideal: "Whether opportunities are being distributed fairly rather than according to preference or familiarity.",
        secondary: "How to raise the concern constructively with appropriate evidence.",
        mild: "Whether speaking up might make the atmosphere awkward.",
        severe: "Whether it is better to benefit from the unfairness than challenge it."
      }
    }
  ]
};

function fillTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] || "");
}

function buildSjtScenarioLibrary() {
  const scenarios = [];

  Object.entries(sjtThemes).forEach(([pillar, conflicts]) => {
    conflicts.forEach((conflict) => {
      sjtContexts.forEach((context) => {
        sjtCharacters.forEach((character) => {
          scenarios.push({
            pillar,
            title: conflict.title,
            conflictId: conflict.id,
            scenario: fillTemplate(conflict.scenarioTemplate, {
              setting: context.label,
              timing: context.timing,
              character
            }),
            rationale: conflict.rationale,
            appropriateness: conflict.appropriateness,
            importance: conflict.importance
          });
        });
      });
    });
  });

  return scenarios;
}

const sjtScenarios = buildSjtScenarioLibrary();

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
    sessionQueue: [],
    index: 0,
    answers: [],
    startedAt: 0,
    questionStartedAt: 0,
    readingStartedAt: 0,
    vrReadSeconds: 0,
    vrReadingFinished: false,
    qrHasMistake: false,
    locked: false,
    autoAdvanceId: null,
    liveTimerId: null
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

function setExerciseTimerLabel(text) {
  const timer = qs("#exerciseTimer");
  if (timer) {
    timer.textContent = text;
  }
}

function clearLiveTimer() {
  if (state.session.liveTimerId) {
    clearInterval(state.session.liveTimerId);
    state.session.liveTimerId = null;
  }
}

function startReadingTimer() {
  clearLiveTimer();
  state.session.readingStartedAt = Date.now();
  setExerciseTimerLabel("Reading 0m 00s");
  state.session.liveTimerId = window.setInterval(() => {
    const elapsedSeconds = Math.max(0, Math.round((Date.now() - state.session.readingStartedAt) / 1000));
    setExerciseTimerLabel(`Reading ${secondsToLabel(elapsedSeconds)}`);
  }, 1000);
}

function stopReadingTimer() {
  if (!state.session.readingStartedAt) {
    clearLiveTimer();
    setExerciseTimerLabel("Read to start timer");
    return 0;
  }

  const elapsedSeconds = Math.max(1, Math.round((Date.now() - state.session.readingStartedAt) / 1000));
  clearLiveTimer();
  setExerciseTimerLabel(`Read ${secondsToLabel(elapsedSeconds)}`);
  state.session.readingStartedAt = 0;
  return elapsedSeconds;
}

function escapeHtml(text) {
  const element = document.createElement("div");
  element.textContent = text;
  return element.innerHTML;
}

function renderPassageMarkup(text) {
  if (!state.settings.enableHighlighting) {
    return escapeHtml(text);
  }

  return text.split(/\s+/).map((word, index) => (
    `<span class="passage-word" data-word-index="${index}">${escapeHtml(word)}</span>`
  )).join(" ");
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

function buildVrSessionQuestions() {
  return sampleCount(questionLibrary, 11).map((set) => ({
    ...set,
    mode: "vr",
    words: countWords(set.passage),
    selectedAnswers: Array(set.questions.length).fill(null)
  }));
}

function buildDmSessionQuestions() {
  const generator = new DmChecklistGenerator({ medicalMode: state.settings.medicalMode });
  return generator.generateSession(DM_SESSION_LENGTH).map((question) => ({
    ...question,
    selectedAnswers: Array(question.statements.length).fill(null),
    review: null
  }));
}

function buildQrSessionQuestions() {
  return Array.from({ length: SESSION_LENGTH }, () => sampleOne([
    createPercentageQuestion,
    createReciprocalQuestion,
    createCurrencyQuestion
  ])());
}

function buildSjtSessionQuestions() {
  return sampleCount(sjtScenarios, SESSION_LENGTH).map((scenario) => {
    const promptType = Math.random() > 0.5 ? "appropriateness" : "importance";
    const source = promptType === "appropriateness" ? scenario.appropriateness : scenario.importance;
    const indexedResponses = [
      { response: source.ideal, correct: true },
      { response: source.reasonable || source.secondary, correct: false },
      { response: source.mild, correct: false },
      { response: source.severe, correct: false }
    ];
    const shuffledResponses = shuffle(indexedResponses);

    return {
      pillar: scenario.pillar,
      title: scenario.title,
      scenario: scenario.scenario,
      promptType,
      promptLabel: promptType === "appropriateness" ? "Appropriateness" : "Importance",
      prompt: promptType === "appropriateness"
        ? "Which response is the most appropriate?"
        : "Which factor is the most important to prioritise?",
      responses: shuffledResponses.map((item) => item.response),
      answerIndex: shuffledResponses.findIndex((item) => item.correct),
      rationale: scenario.rationale
    };
  });
}

function startSession(mode) {
  clearAutoAdvance();
  clearLiveTimer();
  state.session = createEmptySession();
  state.session.mode = mode;
  state.session.startedAt = Date.now();

  if (mode === "vr") {
    state.session.sessionQueue = buildVrSessionQuestions();
  } else if (mode === "dm") {
    state.session.sessionQueue = buildDmSessionQuestions();
  } else if (mode === "qr") {
    state.session.sessionQueue = buildQrSessionQuestions();
  } else if (mode === "sjt") {
    state.session.sessionQueue = buildSjtSessionQuestions();
  }

  state.session.questions = [...state.session.sessionQueue];

  setScreen("exercise");
  renderCurrentExercise();
}

function renderCurrentExercise() {
  const question = state.session.questions[state.session.index];
  state.session.questionStartedAt = Date.now();
  state.session.readingStartedAt = 0;
  state.session.vrReadSeconds = 0;
  state.session.vrReadingFinished = false;
  state.session.qrHasMistake = false;
  state.session.locked = false;
  clearLiveTimer();
  setExerciseFeedback("");

  qs("#exerciseModeLabel").textContent = state.session.mode.toUpperCase();
  qs("#exerciseCounter").textContent = currentCounterText();
  qs("#exerciseBadge").textContent = currentBadgeText(question);
  qs("#exerciseTitle").textContent = currentTitleText(question);
  qs("#exerciseEyebrow").textContent = currentEyebrowText();
  qs("#exerciseContent").className = `exercise-content ${currentLayoutClass()}`;
  setExerciseTimerLabel(state.session.mode === "vr" || state.session.mode === "dm" ? "Read to start timer" : "Session active");

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

function currentCounterText() {
  if (state.session.mode === "dm" || state.session.mode === "vr") {
    return `Set ${state.session.index + 1} of ${state.session.questions.length}`;
  }
  return `Question ${state.session.index + 1} of ${state.session.questions.length}`;
}

function currentLayoutClass() {
  if (state.session.mode === "vr") {
    return "layout-vr";
  }
  if (state.session.mode === "dm") {
    return "layout-dm";
  }
  if (state.session.mode === "sjt") {
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
    return question.structure || "Syllogism";
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
    return question.mode === "medical" ? "Medical Checklist" : "Logic Checklist";
  }
  if (state.session.mode === "qr") {
    return "Type the correct value";
  }
  return question.promptLabel || question.pillar;
}

function renderVrQuestion(question) {
  qs("#exerciseContent").innerHTML = `
    <div class="dm-checklist">
      <div class="metric-chip-row">
        <div class="metric-chip">${question.words} words</div>
        <div class="metric-chip">Questions-first mode</div>
      </div>
      <div class="statement-list">
        ${question.questions.map((item, index) => `
          <article class="statement-row">
            <div class="statement-row-header">
              <span class="statement-index">Statement ${index + 1}</span>
            </div>
            <p class="statement-copy">${item.text}</p>
            <div class="triple-toggle">
              <button class="toggle-button" data-question-index="${index}" data-answer-value="True" type="button">TRUE</button>
              <button class="toggle-button" data-question-index="${index}" data-answer-value="False" type="button">FALSE</button>
              <button class="toggle-button" data-question-index="${index}" data-answer-value="Can't Tell" type="button">CAN'T TELL</button>
            </div>
          </article>
        `).join("")}
      </div>
      <div class="passage-shell">
        <div id="vrPassageOverlay" class="passage-overlay">
          <button id="readVrPassageButton" class="primary-button full-width-button" type="button">Show Passage</button>
        </div>
        <article id="vrPassage" class="passage ${state.settings.enableHighlighting ? "passage-highlight-enabled" : ""}">${renderPassageMarkup(question.passage)}</article>
      </div>
      <button id="vrSubmitButton" class="primary-button full-width-button submit-set-button" type="button" disabled>Submit Set</button>
    </div>
  `;
  setExerciseFeedback("Scan the statements first. Tap Show Passage when you want the timer to begin.");

  const updateVrSelectionUi = () => {
    qsa(".toggle-button").forEach((button) => {
      const questionIndex = Number(button.dataset.questionIndex);
      const selectedValue = question.selectedAnswers[questionIndex];
      button.classList.toggle("is-selected-neutral", selectedValue === button.dataset.answerValue);
    });

    const allAnswered = question.selectedAnswers.every((answer) => Boolean(answer));
    qs("#vrSubmitButton").disabled = !allAnswered || !state.session.vrReadingFinished;
  };

  qs("#readVrPassageButton").addEventListener("click", () => {
    state.session.vrReadingFinished = true;
    qs("#vrPassageOverlay").classList.add("hidden");
    startReadingTimer();
    updateVrSelectionUi();
    setExerciseFeedback("Passage revealed. Answer the statements, then submit the set.");
  });

  qsa(".toggle-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.session.locked) {
        return;
      }
      const questionIndex = Number(button.dataset.questionIndex);
      question.selectedAnswers[questionIndex] = button.dataset.answerValue;
      updateVrSelectionUi();
    });
  });

  qs("#vrSubmitButton").addEventListener("click", () => {
    if (state.session.locked || qs("#vrSubmitButton").disabled) {
      return;
    }

    state.session.locked = true;
    const readSeconds = stopReadingTimer();
    const correctCount = question.questions.filter((item, index) => item.answer === question.selectedAnswers[index]).length;
    const wpm = Math.round((question.words / Math.max(1, readSeconds)) * 60);

    state.session.answers.push({
      correct: correctCount === question.questions.length,
      correctCount,
      totalStatements: question.questions.length,
      wpm,
      readSeconds
    });

    setExerciseFeedback(
      `${correctCount}/${question.questions.length} correct • ${wpm} WPM`,
      correctCount === question.questions.length ? "success" : "error"
    );
    queueNextOrFinish(1200);
  });

  if (state.settings.enableHighlighting) {
    qsa("#vrPassage .passage-word").forEach((word) => {
      word.addEventListener("click", () => {
        word.classList.toggle("highlighted");
      });
    });
  }

  updateVrSelectionUi();
}

function renderDmQuestion(question) {
  const getDmButtonMarkup = (index, value, label) => {
    const selectedValue = question.selectedAnswers[index];
    const review = question.review;
    const isSelected = selectedValue === value;
    const expectedValue = question.statements[index].answer;
    const isExpected = expectedValue === value;
    const classes = ["toggle-button"];

    if (!review) {
      if (value === true && isSelected) {
        classes.push("is-selected-yes");
      }
      if (value === false && isSelected) {
        classes.push("is-selected-no");
      }
    } else {
      if (isSelected && review.results[index].correct) {
        classes.push("is-review-correct");
      } else if (isSelected && !review.results[index].correct) {
        classes.push("is-review-wrong");
      } else if (!isSelected && isExpected && !review.results[index].correct) {
        classes.push("is-review-answer");
      }
    }

    let marker = "";
    if (review && isSelected) {
      marker = review.results[index].correct ? '<span class="toggle-marker">✓</span>' : '<span class="toggle-marker">✕</span>';
    }

    return `
      <button
        class="${classes.join(" ")}"
        data-statement-index="${index}"
        data-toggle-value="${value ? "yes" : "no"}"
        type="button"
        ${review ? "disabled" : ""}
      >
        ${label}${marker}
      </button>
    `;
  };

  qs("#exerciseContent").innerHTML = `
    <div class="dm-checklist">
      <div class="passage-shell is-inline">
        <article id="dmPassage" class="premise-box">${question.premise}</article>
      </div>
      <div class="statement-list">
        ${question.statements.map((statement, index) => `
          <article class="statement-row ${question.review ? (question.review.results[index].correct ? "is-correct" : "is-incorrect") : ""}">
            <div class="statement-row-header">
              <span class="statement-index">Statement ${index + 1}</span>
            </div>
            <p class="statement-copy">${statement.text}</p>
            <div class="toggle-group">
              ${getDmButtonMarkup(index, true, "YES")}
              ${getDmButtonMarkup(index, false, "NO")}
            </div>
          </article>
        `).join("")}
      </div>
      ${question.review ? `
        <div class="logic-breakdown">
          <p class="logic-breakdown-title">Logic Breakdown</p>
          <p>${question.review.breakdown}</p>
          <p><strong>Score:</strong> ${question.review.scoreLabel}</p>
        </div>
      ` : ""}
      <button id="dmSubmitButton" class="primary-button full-width-button submit-set-button ${question.review ? "hidden" : ""}" type="button" disabled>Submit Set</button>
      <button id="dmContinueButton" class="primary-button full-width-button ${question.review ? "" : "hidden"}" type="button">Continue to Next Set</button>
    </div>
  `;
  setExerciseFeedback(question.review ? `Score: ${question.review.scoreLabel}` : "Read the extract at the top, then evaluate all five statements.");

  const updateDmSelectionUi = () => {
    qsa(".toggle-button").forEach((button) => {
      if (question.review) {
        return;
      }
      const statementIndex = Number(button.dataset.statementIndex);
      const isYes = button.dataset.toggleValue === "yes";
      const selectedValue = question.selectedAnswers[statementIndex];
      button.classList.toggle("is-selected-yes", isYes && selectedValue === true);
      button.classList.toggle("is-selected-no", !isYes && selectedValue === false);
    });

    qs("#dmSubmitButton").disabled = question.selectedAnswers.some((answer) => answer === null) || !state.session.vrReadingFinished;
  };

  if (!question.review && !state.session.vrReadingFinished) {
    state.session.vrReadingFinished = true;
    startReadingTimer();
    setExerciseFeedback("Evaluate all five statements, then submit the set.");
  }

  qsa(".toggle-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.session.locked) {
        return;
      }
      const statementIndex = Number(button.dataset.statementIndex);
      question.selectedAnswers[statementIndex] = button.dataset.toggleValue === "yes";
      updateDmSelectionUi();
    });
  });

  qs("#dmSubmitButton").addEventListener("click", () => {
    if (state.session.locked || question.selectedAnswers.some((answer) => answer === null)) {
      return;
    }

    state.session.locked = true;
    const readSeconds = stopReadingTimer();
    const results = question.statements.map((statement, index) => ({
      expected: statement.answer,
      selected: question.selectedAnswers[index],
      correct: statement.answer === question.selectedAnswers[index],
      rationale: statement.rationale
    }));
    const correctCount = results.filter((item) => item.correct).length;
    const points = correctCount === 5 ? 2 : correctCount === 4 ? 1 : 0;
    const wpm = Math.round((countWords(question.premise) / Math.max(1, readSeconds)) * 60);
    const trickyIndex = results.findIndex((item) => !item.correct);
    const breakdownIndex = trickyIndex >= 0 ? trickyIndex : results.findIndex((item) => item.expected === false);
    const scoreLabel = points === 2 ? "2/2 (Perfect)" : points === 1 ? "1/2 (Partial)" : "0/2";

    question.review = {
      results,
      correctCount,
      points,
      wpm,
      scoreLabel,
      breakdown: `Statement ${breakdownIndex + 1} is ${question.statements[breakdownIndex].answer ? "YES" : "NO"} because ${question.statements[breakdownIndex].rationale.charAt(0).toLowerCase()}${question.statements[breakdownIndex].rationale.slice(1)}`
    };

    state.session.answers.push({
      correct: correctCount === 5,
      correctCount,
      points,
      totalStatements: question.statements.length,
      wpm,
      readSeconds
    });

    setExerciseFeedback(
      `Score: ${question.review.scoreLabel} • ${correctCount}/5 correct • ${wpm} WPM`,
      points > 0 ? "success" : "error"
    );
    renderDmQuestion(question);
  });

  const continueButton = qs("#dmContinueButton");
  if (continueButton) {
    continueButton.addEventListener("click", () => {
      state.session.locked = false;
      continueToNextSet();
    });
  }

  updateDmSelectionUi();
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
      <article class="prompt-box"><strong>${question.prompt}</strong></article>
      <div class="answer-grid">
        ${question.responses.map((response, index) => `
          <button class="answer-button" data-answer-index="${index}" type="button">${String.fromCharCode(65 + index)}) ${response}</button>
        `).join("")}
      </div>
    </div>
  `;
  setExerciseFeedback(question.prompt);

  qsa(".answer-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.session.locked) {
        return;
      }
      state.session.locked = true;
      const selectedIndex = Number(button.dataset.answerIndex);
      const correct = selectedIndex === question.answerIndex;
      state.session.answers.push({ correct });
      const correctLabel = String.fromCharCode(65 + question.answerIndex);
      const rationale = `${question.rationale} This scenario tests ${question.pillar}.`;
      setExerciseFeedback(
        correct
          ? `Correct. ${rationale}`
          : `Incorrect. Best choice: ${correctLabel}. ${rationale}`,
        correct ? "success" : "error"
      );
      queueNextOrFinish(1800);
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

function continueToNextSet() {
  state.session.index += 1;
  if (state.session.index >= state.session.questions.length) {
    finishSession();
    return;
  }
  renderCurrentExercise();
}

function finishSession() {
  clearAutoAdvance();
  clearLiveTimer();
  const totalSeconds = Math.max(1, Math.round((Date.now() - state.session.startedAt) / 1000));
  const isDm = state.session.mode === "dm";
  const isVr = state.session.mode === "vr";
  const dmPoints = isDm ? state.session.answers.reduce((sum, item) => sum + (item.points || 0), 0) : null;
  const dmMaxPoints = isDm ? state.session.questions.length * 2 : null;
  const dmCorrectStatements = isDm ? state.session.answers.reduce((sum, item) => sum + (item.correctCount || 0), 0) : null;
  const dmTotalStatements = isDm ? state.session.questions.length * 5 : null;
  const vrCorrectStatements = isVr ? state.session.answers.reduce((sum, item) => sum + (item.correctCount || 0), 0) : null;
  const vrTotalStatements = isVr ? state.session.questions.reduce((sum, item) => sum + item.questions.length, 0) : null;
  const accuracy = isDm
    ? Math.round(((dmPoints || 0) / Math.max(1, dmMaxPoints || 1)) * 100)
    : isVr
      ? Math.round(((vrCorrectStatements || 0) / Math.max(1, vrTotalStatements || 1)) * 100)
      : Math.round((state.session.answers.filter((item) => item.correct).length / state.session.questions.length) * 100);
  const summary = {
    mode: state.session.mode,
    date: new Date().toISOString(),
    totalQuestions: state.session.questions.length,
    accuracy,
    timeSeconds: totalSeconds,
    avgWpm: (state.session.mode === "vr" || state.session.mode === "dm") ? Math.round(average(state.session.answers.map((item) => item.wpm || 0))) : null,
    officialPoints: dmPoints,
    maxPoints: dmMaxPoints,
    statementAccuracy: isDm ? Math.round(((dmCorrectStatements || 0) / Math.max(1, dmTotalStatements || 1)) * 100) : null
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
    <div class="prompt-box">${summary.mode === "dm" ? `Sets completed: ${summary.totalQuestions}` : `Questions completed: ${summary.totalQuestions}`}</div>
    <div class="prompt-box">${summary.mode === "vr" ? `Average reading speed: ${summary.avgWpm} WPM` : summary.mode === "dm" ? `Official DM score: ${summary.officialPoints}/${summary.maxPoints} points • Statement accuracy: ${summary.statementAccuracy}% • Average reading speed: ${summary.avgWpm} WPM` : "WPM is tracked for Verbal Reasoning and Decision Making passage sets."}</div>
  `;
  setScreen("results");
}

function resetSessionAndHome() {
  clearAutoAdvance();
  clearLiveTimer();
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
  qs("#dmSummaryMeta").textContent = dmLast ? `Latest: ${dmLast.officialPoints || 0}/${dmLast.maxPoints || 0} points` : "No sessions yet";

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
    ...state.data.dmSessions.map((item) => ["DM", item.date, item.accuracy || "", item.timeSeconds || "", "", item.officialPoints != null ? `${item.officialPoints}/${item.maxPoints}` : (item.modeLabel || "")]),
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
  const highlightToggle = qs("#highlightToggle");
  const themeButtons = qsa("[data-theme-option]");
  persistToggle.checked = state.settings.rememberMedicalMode;
  medicalToggle.checked = state.settings.medicalMode;
  highlightToggle.checked = state.settings.enableHighlighting;
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

  highlightToggle.addEventListener("change", () => {
    state.settings.enableHighlighting = highlightToggle.checked;
    saveSettings();
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
