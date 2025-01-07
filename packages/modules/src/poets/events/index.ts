import { PoetCreatedEvent } from "./PoetCreated.event";
import { PoetEditedEvent } from "./PoetEdited.event";
import { PoetDeletedEvent } from "./PoetDeleted.event";
import { PoetSetAsMCEvent } from "./PoetSetAsMC.event";
import { PoetReactivatedEvent } from "./PoetReactivated.event";
import { PoetSetAsPoetEvent } from "./PoetSetAsPoet.event";

export const PoetEventsList = [
  "PoetCreated",
  "PoetEdited",
  "PoetDeleted",
  "PoetSetAsMC",
  "PoetSetAsPoet",
  "PoetReactivated",
] as const;

// union of all event classes in the domain
type PoetEvent =
  | PoetCreatedEvent
  | PoetDeletedEvent
  | PoetEditedEvent
  | PoetSetAsMCEvent
  | PoetSetAsPoetEvent
  | PoetReactivatedEvent;

// typemap of the according payload
type PoetEventPayloadMap = {
  [E in PoetEvent as E["eventType"]]: E["getPayload"];
};

// list of active event type names
type PoetEventType = keyof PoetEventPayloadMap;

// dynamic type of payloads derived from the map.
type PoetEventPayload<E extends PoetEventType> = PoetEventPayloadMap[E];

export {
  PoetCreatedEvent,
  PoetDeletedEvent,
  PoetEditedEvent,
  PoetSetAsMCEvent,
  PoetSetAsPoetEvent,
  PoetReactivatedEvent,
  PoetEventType,
  PoetEventPayload,
  PoetEvent,
};
