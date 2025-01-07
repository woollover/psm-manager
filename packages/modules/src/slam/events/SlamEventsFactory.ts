import { SlamEventPayload, SlamEventPayloadUnion, SlamEventType } from ".";
import { EventInput } from "@psm/core/Event/Event";
import { randomUUID } from "crypto";
import { SlamCreatedEvent } from "./SlamCreated.event";
import { SlamDeletedEvent } from "./SlamDeleted.event";

type SlamEventInput = EventInput & { payload: SlamEventPayloadUnion };

export class SlamEventFactory {
  static createEvent(eventType: SlamEventType, eventInput: SlamEventInput) {
    const baseEventData = {
      timestamp: eventInput.timestamp || new Date().getTime(),
      aggregateId: eventInput.aggregateId ?? "evt-" + randomUUID(),
      aggregateOffset: eventInput.aggregateOffset || 0,
      globalOffset: eventInput.globalOffset || 0,
    };

    let payloadBody =
      typeof eventInput.payload === "string"
        ? JSON.parse(eventInput.payload)
        : eventInput.payload;

    switch (eventType) {
      case "SlamCreated":
        const payload = payloadBody as SlamEventPayload<"SlamCreated">;
        return new SlamCreatedEvent({
          ...baseEventData,
          payload: {
            name: payload.name,
            regionalId: payload.regionalId,
            countryId: payload.countryId,
            city: payload.city,
            venue: payload.venue,
            timestamp: payload.timestamp,
          },
        });

      case "SlamDeleted":
        const slamDeletedPayload =
          payloadBody as SlamEventPayload<"SlamDeleted">;
        return new SlamDeletedEvent({
          ...baseEventData,
          payload: slamDeletedPayload,
        });

      default:
        throw new Error(`Event not found: ${eventType}`);
    }
  }
}
