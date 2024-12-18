import { PoetCreatedEvent } from "./PoetCreated.event";
import { PoetEditedEvent } from "./PoetEdited.event";
import { PoetDeletedEvent } from "./PoetDeleted.event";
import { PoetSetAsMCEvent } from "./PoetSetAsMC.event";

type PoetEvent =
  | PoetCreatedEvent
  | PoetDeletedEvent
  | PoetEditedEvent
  | PoetSetAsMCEvent;

export {
  PoetCreatedEvent,
  PoetDeletedEvent,
  PoetEditedEvent,
  PoetSetAsMCEvent,
  PoetEvent,
};
