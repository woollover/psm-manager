export const SlamEventList = [
  "SlamCreated",
  "SlamEdited",
  "SlamDeleted",
  "MCAssigned",
  "MCRemoved",
  "PoetCandidated",
  "SlamCallOpened",
  "SlamCallClosed",
  "SlamStarted",
  "SlamEnded",
] as const;

export type SlamEventType = (typeof SlamEventList)[number];
