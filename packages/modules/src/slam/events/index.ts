import { SlamCreatedEvent } from "./SlamCreated.event";
import { SlamDeletedEvent } from "./SlamDeleted.event";

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

// union of all event classes in the domain
export type SlamEvent = SlamCreatedEvent | SlamDeletedEvent;

// typemap of the according payload
export type SlamEventPayloadMap = {
  [E in SlamEvent as E["eventType"]]: E["getPayload"];
};

// list of active event type names
export type SlamEventType = keyof SlamEventPayloadMap;

// dynamic type of payloads derived from the map.
export type SlamEventPayload<E extends SlamEventType> = SlamEventPayloadMap[E];
