import { PoetCreatedEvent } from "./PoetCreated.event";
import { PoetEditedEvent } from "./PoetEdited.event";
import { PoetDeletedEvent } from "./PoetDeleted.event";

type MCEvent = PoetCreatedEvent | PoetDeletedEvent | PoetEditedEvent;

export {
  PoetCreatedEvent as MCCreatedEvent,
  PoetEditedEvent as MCEditedEvent,
  PoetDeletedEvent as MCDeletedEvent,
  MCEvent,
};
