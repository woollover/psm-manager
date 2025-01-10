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
import { EventData } from "@psm/core/Event/Event";

export class PoetsEventFactory {
  static createEvent(eventType: PoetEventType, eventData: EventData) {
    const baseEventData = {
      timestamp: eventData.timestamp || new Date().getTime(),
      aggregateId: eventData.aggregateId ?? "evt-" + randomUUID(),
      aggregateOffset: eventData.aggregateOffset || 0,
      globalOffset: eventData.globalOffset || 0,
    };

    // console.log("📥 Base Event Data", baseEventData);
    // console.log("📥 Event Type", eventType);
    // console.log("📥 Event Input", eventInput);
    const payload =
      typeof eventData.payload === "string"
        ? JSON.parse(eventData.payload)
        : eventData.payload;

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
            instagramHandle: payload.instagramHandle,
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
