import { randomUUID } from "crypto";
import {
  PoetDeletedEvent,
  PoetEditedEvent,
  PoetEventType,
  PoetReactivatedEvent,
  PoetSetAsMCEvent,
  PoetSetAsPoetEvent,
} from ".";
import { PoetCreatedEvent } from "./PoetCreated.event";

interface EventInput {
  payload: Record<string, any>;
  occurredAt?: Date;
  aggregateId?: string;
  aggregateOffset?: number;
  globalOffset?: number;
}

export class PoetsEventFactory {
  static createEvent(eventType: PoetEventType, eventInput: EventInput) {
    const baseEventData = {
      occurredAt: eventInput.occurredAt || new Date(),
      aggregateId: eventInput.aggregateId ?? "evt-" + randomUUID(),
      aggregateOffset: eventInput.aggregateOffset || 0,
      globalOffset: eventInput.globalOffset || 0,
    };

    switch (eventType) {
      case "PoetCreated":
        return new PoetCreatedEvent({
          payload: {
            name: eventInput.payload.name,
            email: eventInput.payload.email,
          },
          ...baseEventData,
        });

      case "PoetEdited":
        return new PoetEditedEvent({
          payload: {
            name: eventInput.payload.name,
            email: eventInput.payload.email,
            instagram_handle: eventInput.payload.instagram_handle,
          },
          ...baseEventData,
        });

      case "PoetDeleted":
        return new PoetDeletedEvent({
          payload: {
            aggregateId: eventInput.payload.aggregateId,
          },
          ...baseEventData,
        });

      case "PoetSetAsMC":
        return new PoetSetAsMCEvent({
          payload: {
            aggregateId: eventInput.payload.aggregateId,
          },
          ...baseEventData,
        });

      case "PoetSetAsPoet":
        return new PoetSetAsPoetEvent({
          payload: {
            aggregateId: eventInput.payload.aggregateId,
          },
          ...baseEventData,
        });

      case "PoetReactivated":
        return new PoetReactivatedEvent({
          payload: {
            aggregateId: eventInput.payload.aggregateId,
          },
          ...baseEventData,
        });

      default:
        throw new Error(`Unknown event type: ${eventType}`);
    }
  }
}
