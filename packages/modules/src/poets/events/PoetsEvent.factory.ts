import {
  PoetDeletedEvent,
  PoetEditedEvent,
  PoetReactivatedEvent,
  PoetSetAsMCEvent,
  PoetSetAsPoetEvent,
} from ".";
import { PoetCreatedEvent, PoetCreatedEventPayload } from "./PoetCreated.event";
import { EventData, EventRegistry } from "@psm/core";

export class PoetsEventFactory {
  static createEvent<T extends keyof EventRegistry>(
    eventType: T,
    eventData: EventData<EventRegistry[T]>
    //^?
  ) {
    const baseEventData = {
      timestamp: eventData.timestamp || new Date().getTime(),
      aggregateId: eventData.aggregateId,
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
            instagramHandle: payload.instagramHandle,
            birthDate: payload.birthDate,
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
