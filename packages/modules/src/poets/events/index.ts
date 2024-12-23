import { PoetCreatedEvent } from "./PoetCreated.event";
import { PoetEditedEvent } from "./PoetEdited.event";
import { PoetDeletedEvent } from "./PoetDeleted.event";
import { PoetSetAsMCEvent } from "./PoetSetAsMC.event";
import { PoetReactivatedEvent } from "./PoetReactivated";
import { PoetSetAsPoetEvent } from "./PoetSetAsPoet.event";

export const PoetEventsList = [
  "PoetCreated",
  "PoetEdited",
  "PoetDeleted",
  "PoetSetAsMC",
  "PoetSetAsPoet",
  "PoetReactivated",
] as const;

export type PoetEventType = (typeof PoetEventsList)[number];

type PoetEvent =
  | PoetCreatedEvent
  | PoetDeletedEvent
  | PoetEditedEvent
  | PoetSetAsMCEvent
  | PoetSetAsPoetEvent
  | PoetReactivatedEvent;

export {
  PoetCreatedEvent,
  PoetDeletedEvent,
  PoetEditedEvent,
  PoetSetAsMCEvent,
  PoetSetAsPoetEvent,
  PoetReactivatedEvent,
  PoetEvent,
};
