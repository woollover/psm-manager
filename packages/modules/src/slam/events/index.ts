import { SlamCreatedEvent } from "./SlamCreated.event";
import { SlamDeletedEvent } from "./SlamDeleted.event";
import { SlamEditedEvent } from "./SlamEdited.event";

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
export type SlamEvent = SlamCreatedEvent | SlamDeletedEvent | SlamEditedEvent;

// typemap of the according payload
type SlamEventPayloadMap = {
  [E in SlamEvent as E["eventType"]]: E["getPayload"];
};

// list of active event type names
export type SlamEventType = keyof SlamEventPayloadMap;

// dynamic type of payloads derived from the map.
export type SlamEventPayload<E extends SlamEventType> = SlamEventPayloadMap[E];

// dynamic union of payloads (it's very helpful in the EventInput discriminated union)
export type SlamEventPayloadUnion =
  SlamEventPayloadMap[keyof SlamEventPayloadMap];
