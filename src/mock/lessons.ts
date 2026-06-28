import type { Lesson } from "@/types/course";

function lesson(
  id: string,
  courseId: string,
  title: string,
  duration: number,
  completed: boolean,
  description: string,
  content: string
): Lesson {
  return { id, courseId, title, duration, completed, description, content };
}

export const MOCK_LESSONS: Lesson[] = [
  lesson(
    "l1", "c1", "IELTS Overview & Band Descriptors", 25, true,
    "Understand how IELTS scores work across all four skills.",
    "IELTS bands range from 0 to 9 in 0.5 steps. Band 7 typically means you can handle complex language well. Examiners assess fluency, coherence, lexical resource, and grammatical range in Speaking and Writing."
  ),
  lesson(
    "l2", "c1", "Listening: Multiple Choice Strategies", 30, true,
    "Techniques for eliminating wrong answers quickly.",
    "Preview questions before the audio starts. Listen for synonyms — the recording rarely uses the exact words in the options. Underline keywords and watch for distractors that repeat words from the question but change the meaning."
  ),
  lesson(
    "l3", "c1", "Reading: True/False/Not Given", 35, true,
    "Master the most confusing IELTS Reading question type.",
    "TRUE means the statement matches the passage. FALSE means the passage contradicts it. NOT GIVEN means the passage neither confirms nor denies it. Never use outside knowledge — only what is written in the text."
  ),
  lesson(
    "l4", "c1", "Writing Task 1: Describing Trends", 40, true,
    "Write clear overviews and compare data accurately.",
    "Start with a one-sentence overview of the main trend. Group similar data together. Use precise verbs: rise, fall, fluctuate, remain stable. Include figures and time markers to support your description."
  ),
  lesson(
    "l5", "c1", "Writing Task 2: Opinion Essays", 45, false,
    "Structure a band 7+ argumentative essay.",
    "Paragraph 1: paraphrase the prompt and state your opinion clearly. Body paragraphs: one main idea each with explanation and example. Use cohesive devices like 'however', 'furthermore', 'in contrast'. Aim for at least 250 words."
  ),
  lesson(
    "l6", "c1", "Speaking Part 2: Cue Cards", 30, false,
    "Speak for two minutes with confidence and structure.",
    "Use the one minute of preparation to jot down keywords, not full sentences. Cover all bullet points on the card. Tell a short story with a beginning, middle, and end. Keep talking until the examiner stops you."
  ),
  lesson("l7", "c2", "TOEIC Format & Scoring", 20, true, "Learn the structure of the TOEIC Listening & Reading test.", "TOEIC has 200 questions: 100 Listening and 100 Reading in 2 hours. Scores range from 10 to 990. Most employers look for 750+ for professional roles."),
  lesson("l8", "c2", "Part 1: Photographs", 25, true, "Describe photos and choose the best statement.", "Listen for action verbs and prepositions. The correct answer describes what is actually happening, not what might happen or what happened before."),
  lesson("l9", "c2", "Part 5: Incomplete Sentences", 30, false, "Grammar and vocabulary in single-sentence context.", "Check subject–verb agreement, verb tense, and collocations. Read the full sentence with each option before choosing."),
  lesson("l10", "c2", "Part 7: Reading Comprehension", 35, false, "Skim passages and locate answers efficiently.", "Read questions first, then scan for keywords. Double passages require matching information across texts — note dates, names, and numbers."),
  lesson("l11", "c3", "Integrated Writing Task", 40, true, "Combine reading and lecture notes in a summary.", "The lecture usually challenges or supports points from the reading. Show how the speaker responds to each main idea. Use reporting verbs: claims, argues, suggests."),
  lesson("l12", "c3", "Independent Speaking Task", 30, true, "Give a clear opinion with reasons and examples.", "State your preference in the first sentence. Give two reasons with specific examples. Use 45 seconds fully — don't stop too early."),
  lesson("l13", "c3", "Academic Lecture Note-taking", 35, false, "Capture main ideas and supporting details quickly.", "Use abbreviations and symbols. Focus on transitions: first, however, as a result. Main ideas often follow these signal words."),
  lesson("l14", "c4", "Professional Email Writing", 25, true, "Write polite, clear business emails.", "Use a formal greeting and clear subject line. State your purpose in the first paragraph. End with a professional closing and call to action."),
  lesson("l15", "c4", "Leading a Team Meeting", 30, false, "Open, facilitate, and close meetings in English.", "Start with agenda review. Assign action items with owners and deadlines. Summarize decisions before closing."),
  lesson("l16", "c5", "Present Perfect vs Past Simple", 30, true, "Choose the correct tense for finished vs relevant actions.", "Past Simple: specific finished time (yesterday, in 2020). Present Perfect: connection to now, experience, or unfinished period (already, yet, since, for)."),
  lesson("l17", "c5", "First & Second Conditionals", 35, false, "Express real and hypothetical situations.", "First conditional: If + present, will + base verb (real future). Second conditional: If + past simple, would + base verb (unlikely or imaginary)."),
  lesson("l18", "c6", "Connected Speech & Linking", 25, true, "Sound more natural when speaking English.", "Link consonant to vowel sounds across words. Reduce unstressed syllables. Practice common chunks: a lot of, kind of, want to."),
  lesson("l19", "c6", "Small Talk at Work", 20, false, "Start conversations with colleagues confidently.", "Safe topics: weather, weekend plans, work projects. Avoid politics and personal finances. Ask open questions and show genuine interest."),
];

export const MOCK_ACTIVE_LESSON = MOCK_LESSONS.find((l) => l.id === "l5")!;

export function getLessonsByCourse(courseId: string): Lesson[] {
  return MOCK_LESSONS.filter((l) => l.courseId === courseId);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return MOCK_LESSONS.find((l) => l.id === lessonId);
}
