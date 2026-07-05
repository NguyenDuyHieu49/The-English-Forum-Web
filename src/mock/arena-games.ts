export interface WordPair {
  id: string;
  word: string;
  meaning: string;
  distractors: string[];
}

export interface SentencePuzzle {
  id: string;
  words: string[];
  correct: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface GrammarQuestion {
  id: string;
  text: string;
  choices: { id: string; text: string }[];
  correctId: string;
  difficulty: number;
}

export interface ListeningQuestion {
  id: string;
  text: string;
  choices: { id: string; text: string }[];
  correctId: string;
}

export const WORD_HUNTER_PAIRS: WordPair[] = [
  { id: "w1", word: "achieve", meaning: "to succeed", distractors: ["to fail", "to ignore", "to borrow"] },
  { id: "w2", word: "benefit", meaning: "an advantage", distractors: ["a problem", "a delay", "a mistake"] },
  { id: "w3", word: "consider", meaning: "to think about", distractors: ["to forget", "to destroy", "to sell"] },
  { id: "w4", word: "develop", meaning: "to grow", distractors: ["to shrink", "to hide", "to break"] },
  { id: "w5", word: "efficient", meaning: "productive", distractors: ["lazy", "slow", "weak"] },
  { id: "w6", word: "furthermore", meaning: "in addition", distractors: ["however", "never", "before"] },
  { id: "w7", word: "generous", meaning: "giving freely", distractors: ["selfish", "angry", "quiet"] },
  { id: "w8", word: "hesitate", meaning: "to pause", distractors: ["to rush", "to shout", "to win"] },
  { id: "w9", word: "improve", meaning: "to make better", distractors: ["to worsen", "to copy", "to lose"] },
  { id: "w10", word: "journey", meaning: "a trip", distractors: ["a wall", "a song", "a tool"] },
  { id: "w11", word: "knowledge", meaning: "information learned", distractors: ["a feeling", "a color", "a sound"] },
  { id: "w12", word: "leisure", meaning: "free time", distractors: ["hard work", "danger", "noise"] },
];

export const SENTENCE_PUZZLES: SentencePuzzle[] = [
  { id: "s1", words: ["She", "has", "been", "studying", "English", "for", "three", "years."], correct: "She has been studying English for three years.", difficulty: "easy" },
  { id: "s2", words: ["If", "I", "had", "more", "time,", "I", "would", "travel", "abroad."], correct: "If I had more time, I would travel abroad.", difficulty: "medium" },
  { id: "s3", words: ["The", "report", "was", "submitted", "by", "the", "team", "yesterday."], correct: "The report was submitted by the team yesterday.", difficulty: "medium" },
  { id: "s4", words: ["Not", "only", "did", "he", "pass,", "but", "he", "also", "got", "a", "scholarship."], correct: "Not only did he pass, but he also got a scholarship.", difficulty: "hard" },
  { id: "s5", words: ["Learning", "a", "language", "requires", "patience", "and", "practice."], correct: "Learning a language requires patience and practice.", difficulty: "easy" },
  { id: "s6", words: ["Could", "you", "please", "send", "me", "the", "document?"], correct: "Could you please send me the document?", difficulty: "easy" },
];

export const GRAMMAR_QUESTIONS: GrammarQuestion[] = [
  { id: "g1", text: "She ___ to school every day.", choices: [{ id: "a", text: "go" }, { id: "b", text: "goes" }, { id: "c", text: "going" }, { id: "d", text: "gone" }], correctId: "b", difficulty: 1 },
  { id: "g2", text: "I have ___ finished my homework.", choices: [{ id: "a", text: "yet" }, { id: "b", text: "already" }, { id: "c", text: "since" }, { id: "d", text: "for" }], correctId: "b", difficulty: 2 },
  { id: "g3", text: "If it rains, we ___ stay home.", choices: [{ id: "a", text: "will" }, { id: "b", text: "would" }, { id: "c", text: "had" }, { id: "d", text: "were" }], correctId: "a", difficulty: 2 },
  { id: "g4", text: "The book ___ by millions of readers.", choices: [{ id: "a", text: "reads" }, { id: "b", text: "is read" }, { id: "c", text: "reading" }, { id: "d", text: "read" }], correctId: "b", difficulty: 3 },
  { id: "g5", text: "He speaks English ___ than his brother.", choices: [{ id: "a", text: "good" }, { id: "b", text: "better" }, { id: "c", text: "best" }, { id: "d", text: "well" }], correctId: "b", difficulty: 2 },
  { id: "g6", text: "By next year, I ___ my degree.", choices: [{ id: "a", text: "complete" }, { id: "b", text: "will complete" }, { id: "c", text: "will have completed" }, { id: "d", text: "completed" }], correctId: "c", difficulty: 4 },
  { id: "g7", text: "Neither Tom ___ Jerry was at the party.", choices: [{ id: "a", text: "or" }, { id: "b", text: "nor" }, { id: "c", text: "and" }, { id: "d", text: "but" }], correctId: "b", difficulty: 3 },
  { id: "g8", text: "She suggested ___ to the museum.", choices: [{ id: "a", text: "go" }, { id: "b", text: "going" }, { id: "c", text: "to going" }, { id: "d", text: "gone" }], correctId: "b", difficulty: 3 },
];

export const LISTENING_QUESTIONS: ListeningQuestion[] = [
  { id: "l1", text: "The weather is beautiful today.", choices: [{ id: "a", text: "The weather is beautiful today." }, { id: "b", text: "The weather is terrible today." }, { id: "c", text: "It will rain tomorrow." }, { id: "d", text: "I love winter." }], correctId: "a" },
  { id: "l2", text: "Could you please open the window?", choices: [{ id: "a", text: "Close the door." }, { id: "b", text: "Could you please open the window?" }, { id: "c", text: "Turn off the light." }, { id: "d", text: "Sit down please." }], correctId: "b" },
  { id: "l3", text: "I would like a cup of coffee.", choices: [{ id: "a", text: "I need some water." }, { id: "b", text: "I would like a cup of coffee." }, { id: "c", text: "The food is delicious." }, { id: "d", text: "I am full." }], correctId: "b" },
  { id: "l4", text: "The meeting starts at nine o'clock.", choices: [{ id: "a", text: "The meeting is cancelled." }, { id: "b", text: "We met yesterday." }, { id: "c", text: "The meeting starts at nine o'clock." }, { id: "d", text: "I am late." }], correctId: "c" },
  { id: "l5", text: "Practice makes perfect.", choices: [{ id: "a", text: "Practice makes perfect." }, { id: "b", text: "Never give up." }, { id: "c", text: "Time is money." }, { id: "d", text: "Actions speak louder." }], correctId: "a" },
  { id: "l6", text: "She has been learning English for five years.", choices: [{ id: "a", text: "She speaks French." }, { id: "b", text: "She has been learning English for five years." }, { id: "c", text: "She is a teacher." }, { id: "d", text: "She lives in London." }], correctId: "b" },
];

export const BOSS_QUESTIONS = GRAMMAR_QUESTIONS.slice(0, 8);

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
