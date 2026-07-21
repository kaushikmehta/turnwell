import { RATINGS } from "./constants";

export const isScene = (it) => it && (it.type === "scene" || !!it.steps);
export const isDeck = (it) => it && (it.type === "deck" || !!it.cards);

/* Fisher-Yates. `array.sort(() => Math.random() - 0.5)` is a well-known
   anti-pattern — a random comparator violates sort's transitivity
   assumption and produces a biased shuffle, not a uniform one. */
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const ratingByKey = (k, ratings = RATINGS) => ratings.find((r) => r.key === k);

export const cueLabels = (personal) =>
  personal
    ? ["Sentence starter", "Fill in the blank", "One more clue"]
    : ["Sentence starter", "Fill in the blank", "First-sound cue"];

export const supportWord = (avg) => {
  if (avg <= 0.4) return "None";
  if (avg <= 1.2) return "Light";
  if (avg <= 2.2) return "Moderate";
  if (avg <= 3.2) return "Heavy";
  return "Building";
};
