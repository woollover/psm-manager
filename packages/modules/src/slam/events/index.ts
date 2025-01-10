import { Slam } from "../aggregates/Slam";
import { CallClosedEvent } from "./CallClosed.event";
import { CallOpenedEvent } from "./CallOpened.event";
import { MCAssignedEvent } from "./MCAssigned.event";
import { MCUnassignedEvent } from "./MCUnassigned.event";
import { PoetAcceptedEvent } from "./PoetAccepted.event";
import { PoetCandidatedEvent } from "./PoetCandidated.event";
import { PoetRejectedEvent } from "./PoetRejected.event";
import { SlamCreatedEvent } from "./SlamCreated.event";
import { SlamDeletedEvent } from "./SlamDeleted.event";
import { SlamEditedEvent } from "./SlamEdited.event";
import { SLamEndedEvent } from "./SlamEnded.event";
import { SlamStartedEvent } from "./SlamStarted.event";

export const SlamEventList = [
  "SlamCreated",
  "SlamEdited",
  "SlamDeleted",
  "MCAssigned",
  "MCRemoved",
  "PoetCandidated",
  "SlamCallOpened",
  "SlamCallClosed",
  "PoetAccepted",
  "PoetRejected",
  "PoetRemoved",
  "SlamStarted",
  "SlamEnded",
] as const;

// union of all event classes in the domain
export type SlamEvent =
  | SlamCreatedEvent
  | SlamDeletedEvent
  | SlamEditedEvent
  | MCAssignedEvent
  | MCUnassignedEvent
  | CallOpenedEvent
  | CallClosedEvent
  | PoetCandidatedEvent
  | PoetAcceptedEvent
  | PoetRejectedEvent
  | SlamStartedEvent
  | SLamEndedEvent;

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
