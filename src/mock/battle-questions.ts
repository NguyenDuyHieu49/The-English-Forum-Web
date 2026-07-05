import type { BattleQuestion, QuestionCategory, QuestionDifficulty } from "@/types/battle-arena";
import {
  GRAMMAR_QUESTIONS,
  LISTENING_QUESTIONS,
  WORD_HUNTER_PAIRS,
  SENTENCE_PUZZLES,
  shuffle,
} from "@/mock/arena-games";

const IDIOMS = [
  { id: "i1", text: "What does 'break the ice' mean?", choices: [{ id: "a", text: "Start a conversation" }, { id: "b", text: "Break something" }, { id: "c", text: "Feel cold" }, { id: "d", text: "Stop talking" }], correctId: "a" },
  { id: "i2", text: "What does 'piece of cake' mean?", choices: [{ id: "a", text: "Very easy" }, { id: "b", text: "A dessert" }, { id: "c", text: "Very hard" }, { id: "d", text: "A gift" }], correctId: "a" },
  { id: "i3", text: "What does 'hit the books' mean?", choices: [{ id: "a", text: "Study hard" }, { id: "b", text: "Fight someone" }, { id: "c", text: "Throw books" }, { id: "d", text: "Buy books" }], correctId: "a" },
  { id: "i4", text: "What does 'under the weather' mean?", choices: [{ id: "a", text: "Feeling sick" }, { id: "b", text: "Outside" }, { id: "c", text: "Happy" }, { id: "d", text: "Raining" }], correctId: "a" },
  { id: "i5", text: "What does 'spill the beans' mean?", choices: [{ id: "a", text: "Reveal a secret" }, { id: "b", text: "Cook food" }, { id: "c", text: "Make a mess" }, { id: "d", text: "Plant seeds" }], correctId: "a" },
  { id: "i6", text: "What does 'cost an arm and a leg' mean?", choices: [{ id: "a", text: "Very expensive" }, { id: "b", text: "Injury" }, { id: "c", text: "Free" }, { id: "d", text: "Cheap" }], correctId: "a" },
];

const SYNONYMS = [
  { id: "sy1", text: "Find a synonym for 'happy'", choices: [{ id: "a", text: "Joyful" }, { id: "b", text: "Angry" }, { id: "c", text: "Tired" }, { id: "d", text: "Slow" }], correctId: "a" },
  { id: "sy2", text: "Find a synonym for 'big'", choices: [{ id: "a", text: "Large" }, { id: "b", text: "Tiny" }, { id: "c", text: "Fast" }, { id: "d", text: "Old" }], correctId: "a" },
  { id: "sy3", text: "Find a synonym for 'smart'", choices: [{ id: "a", text: "Intelligent" }, { id: "b", text: "Lazy" }, { id: "c", text: "Loud" }, { id: "d", text: "Weak" }], correctId: "a" },
  { id: "sy4", text: "Find a synonym for 'begin'", choices: [{ id: "a", text: "Start" }, { id: "b", text: "End" }, { id: "c", text: "Stop" }, { id: "d", text: "Wait" }], correctId: "a" },
  { id: "sy5", text: "Find a synonym for 'beautiful'", choices: [{ id: "a", text: "Gorgeous" }, { id: "b", text: "Ugly" }, { id: "c", text: "Plain" }, { id: "d", text: "Dark" }], correctId: "a" },
  { id: "sy6", text: "Find a synonym for 'quick'", choices: [{ id: "a", text: "Rapid" }, { id: "b", text: "Slow" }, { id: "c", text: "Heavy" }, { id: "d", text: "Late" }], correctId: "a" },
];

const READING = [
  { id: "r1", text: "Tom goes to school every day. He likes math. What subject does Tom like?", choices: [{ id: "a", text: "Math" }, { id: "b", text: "Science" }, { id: "c", text: "History" }, { id: "d", text: "Art" }], correctId: "a" },
  { id: "r2", text: "The cat sat on the mat. Where was the cat?", choices: [{ id: "a", text: "On the mat" }, { id: "b", text: "On the bed" }, { id: "c", text: "In the garden" }, { id: "d", text: "Under the table" }], correctId: "a" },
  { id: "r3", text: "Sarah bought three apples and two oranges. How many fruits did she buy?", choices: [{ id: "a", text: "5" }, { id: "b", text: "3" }, { id: "c", text: "2" }, { id: "d", text: "6" }], correctId: "a" },
  { id: "r4", text: "The library opens at 8 AM and closes at 6 PM. How many hours is it open?", choices: [{ id: "a", text: "10 hours" }, { id: "b", text: "8 hours" }, { id: "c", text: "6 hours" }, { id: "d", text: "12 hours" }], correctId: "a" },
];

const PRONUNCIATION = [
  { id: "p1", text: "Which word has a silent 'b'?", choices: [{ id: "a", text: "Debt" }, { id: "b", text: "Best" }, { id: "c", text: "Book" }, { id: "d", text: "Ball" }], correctId: "a" },
  { id: "p2", text: "How is 'though' pronounced?", choices: [{ id: "a", text: "/ðoʊ/" }, { id: "b", text: "/θʌf/" }, { id: "c", text: "/tuː/" }, { id: "d", text: "/θɔːt/" }], correctId: "a" },
  { id: "p3", text: "Which word rhymes with 'night'?", choices: [{ id: "a", text: "Light" }, { id: "b", text: "Net" }, { id: "c", text: "Note" }, { id: "d", text: "Nut" }], correctId: "a" },
  { id: "p4", text: "Which has the stress on the first syllable?", choices: [{ id: "a", text: "HAPpy" }, { id: "b", text: "deCIDE" }, { id: "c", text: "beGIN" }, { id: "d", text: "aGREE" }], correctId: "a" },
];

function diffFromNumber(n: number): QuestionDifficulty {
  if (n <= 2) return "beginner";
  if (n <= 3) return "intermediate";
  return "advanced";
}

function buildPool(): BattleQuestion[] {
  const pool: BattleQuestion[] = [];

  WORD_HUNTER_PAIRS.forEach((w) => {
    pool.push({
      id: `vocab-${w.id}`,
      category: "vocabulary",
      difficulty: "beginner",
      text: `What is the meaning of "${w.word}"?`,
      choices: shuffle([
        { id: "a", text: w.meaning },
        ...w.distractors.slice(0, 3).map((d, i) => ({ id: String.fromCharCode(98 + i), text: d })),
      ]),
      correctId: "a",
      timeLimitMs: 12000,
    });
  });

  GRAMMAR_QUESTIONS.forEach((g) => {
    pool.push({
      id: `grammar-${g.id}`,
      category: "grammar",
      difficulty: diffFromNumber(g.difficulty),
      text: g.text,
      choices: g.choices,
      correctId: g.correctId,
      timeLimitMs: 15000,
    });
  });

  LISTENING_QUESTIONS.forEach((l) => {
    pool.push({
      id: `listen-${l.id}`,
      category: "listening",
      difficulty: "intermediate",
      text: "Listen and choose the correct sentence:",
      audioText: l.text,
      choices: l.choices,
      correctId: l.correctId,
      timeLimitMs: 15000,
    });
  });

  SENTENCE_PUZZLES.forEach((s) => {
    pool.push({
      id: `sentence-${s.id}`,
      category: "sentence",
      difficulty: s.difficulty === "easy" ? "beginner" : s.difficulty === "medium" ? "intermediate" : "advanced",
      text: `Arrange into a correct sentence: ${shuffle([...s.words]).join(" / ")}`,
      choices: [
        { id: "a", text: s.correct },
        { id: "b", text: shuffle([...s.words]).join(" ") },
        { id: "c", text: shuffle([...s.words]).join(" ") },
        { id: "d", text: shuffle([...s.words]).join(" ") },
      ],
      correctId: "a",
      timeLimitMs: 18000,
    });
  });

  IDIOMS.forEach((q) => {
    pool.push({ id: `idiom-${q.id}`, category: "idioms", difficulty: "intermediate", text: q.text, choices: q.choices, correctId: q.correctId, timeLimitMs: 12000 });
  });

  SYNONYMS.forEach((q) => {
    pool.push({ id: `syn-${q.id}`, category: "synonyms", difficulty: "beginner", text: q.text, choices: q.choices, correctId: q.correctId, timeLimitMs: 10000 });
  });

  READING.forEach((q) => {
    pool.push({ id: `read-${q.id}`, category: "reading", difficulty: "beginner", text: q.text, choices: q.choices, correctId: q.correctId, timeLimitMs: 15000 });
  });

  PRONUNCIATION.forEach((q) => {
    pool.push({ id: `pron-${q.id}`, category: "pronunciation", difficulty: "intermediate", text: q.text, choices: q.choices, correctId: q.correctId, timeLimitMs: 12000 });
  });

  return pool;
}

export const BATTLE_QUESTION_POOL = buildPool();

export function selectBattleQuestions(
  count: number,
  recentIds: string[] = [],
  rankTier?: string
): BattleQuestion[] {
  const recentSet = new Set(recentIds.slice(-30));
  let available = BATTLE_QUESTION_POOL.filter((q) => !recentSet.has(q.id));

  if (rankTier === "bronze" || rankTier === "silver") {
    available = available.filter((q) => q.difficulty !== "advanced");
  } else if (rankTier === "gold" || rankTier === "platinum") {
    available = available.filter((q) => q.difficulty !== "beginner" || Math.random() > 0.5);
  }

  const categories: QuestionCategory[] = [
    "vocabulary", "grammar", "listening", "sentence", "idioms", "synonyms", "reading", "pronunciation",
  ];

  const selected: BattleQuestion[] = [];
  const usedCategories = new Set<QuestionCategory>();

  for (let i = 0; i < count && available.length > 0; i++) {
    const cat = categories[i % categories.length];
    const catPool = available.filter((q) => q.category === cat && !usedCategories.has(q.category));
    const pick = catPool.length > 0
      ? catPool[Math.floor(Math.random() * catPool.length)]
      : available[Math.floor(Math.random() * available.length)];

    selected.push({ ...pick, choices: shuffle([...pick.choices]) });
    usedCategories.add(pick.category);
    available = available.filter((q) => q.id !== pick.id);
  }

  return selected;
}

export function validateAnswer(questionId: string, choiceId: string): boolean {
  const q = BATTLE_QUESTION_POOL.find((x) => x.id === questionId);
  return q?.correctId === choiceId;
}

export function getQuestionById(id: string): BattleQuestion | undefined {
  return BATTLE_QUESTION_POOL.find((q) => q.id === id);
}
