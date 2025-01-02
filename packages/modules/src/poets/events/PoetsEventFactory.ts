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
  timestamp?: number;
  aggregateId?: string;
  aggregateOffset?: number;
  globalOffset?: number;
}

export class PoetsEventFactory {
  static createEvent(eventType: PoetEventType, eventInput: EventInput) {
    const baseEventData = {
      timestamp: eventInput.timestamp || new Date().getTime(),
      aggregateId: eventInput.aggregateId ?? "evt-" + randomUUID(),
      aggregateOffset: eventInput.aggregateOffset || 0,
      globalOffset: eventInput.globalOffset || 0,
    };

    console.log("📥 Base Event Data", baseEventData);
    console.log("📥 Event Type", eventType);
    console.log("📥 Event Input", eventInput);
    const payload =
      typeof eventInput.payload === "string"
        ? JSON.parse(eventInput.payload)
        : eventInput.payload;
    console.log("📥 Payload", payload);
    switch (eventType) {
      case "PoetCreated":
        return new PoetCreatedEvent({
          payload: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            birthDate: payload.birthDate,
            instagramHandle: payload.instagramHandle,
          },
          ...baseEventData,
        });

      case "PoetEdited":
        return new PoetEditedEvent({
          payload: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            instagram_handle: payload.instagram_handle,
          },
          ...baseEventData,
        });

      case "PoetDeleted":
        return new PoetDeletedEvent({
          payload: {
            aggregateId: payload.aggregateId,
          },
          ...baseEventData,
        });

      case "PoetSetAsMC":
        return new PoetSetAsMCEvent({
          payload: {
            aggregateId: payload.aggregateId,
          },
          ...baseEventData,
        });

      case "PoetSetAsPoet":
        return new PoetSetAsPoetEvent({
          payload: {
            aggregateId: payload.aggregateId,
          },
          ...baseEventData,
        });

      case "PoetReactivated":
        return new PoetReactivatedEvent({
          payload: {
            aggregateId: payload.aggregateId,
          },
          ...baseEventData,
        });

      default:
        throw new Error(`Unknown event type: ${eventType}`);
    }
  }
}
