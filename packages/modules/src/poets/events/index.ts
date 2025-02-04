import { PoetCreatedEvent } from "./PoetCreated.event";
import { PoetEditedEvent } from "./PoetEdited.event";
import { PoetDeletedEvent } from "./PoetDeleted.event";
import { PoetSetAsMCEvent } from "./PoetSetAsMC.event";
import { PoetReactivatedEvent } from "./PoetReactivated.event";
import { PoetSetAsPoetEvent } from "./PoetSetAsPoet.event";


// union of all event classes in the domain
export type PoetEvent =
  | PoetCreatedEvent
  | PoetDeletedEvent
  | PoetEditedEvent
  | PoetSetAsMCEvent
  | PoetSetAsPoetEvent
  | PoetReactivatedEvent;

// typemap of the according payload
export type PoetEventPayloadMap = {
  [E in PoetEvent as E["eventType"]]: E["getPayload"];
};

// list of active event type names
export type PoetEventType = keyof PoetEventPayloadMap;

// dynamic type of payloads derived from the map.
export type PoetEventPayload<E extends PoetEventType> = PoetEventPayloadMap[E];

export {
  PoetCreatedEvent,
  PoetDeletedEvent,
  PoetEditedEvent,
  PoetSetAsMCEvent,
  PoetSetAsPoetEvent,
  PoetReactivatedEvent,
};
