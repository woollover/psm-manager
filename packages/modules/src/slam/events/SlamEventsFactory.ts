import { SlamEventPayload, SlamEventType } from ".";
import { EventInput } from "@psm/core/Event/Event";
import { randomUUID } from "crypto";
import { SlamCreatedEvent } from "./SlamCreated.event";

export class SlamEventFactory {
  static createEvent(eventType: SlamEventType, eventInput: EventInput) {
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
            regionalId: payload.regionalId,
            countryId: payload.countryId,
            city: payload.city,
            venue: payload.venue,
            timestamp: payload.timestamp,
          },
        });

      default:
        throw new Error(`Event not found: ${eventType}`);
    }
  }
}
