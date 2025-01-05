import { PoetEventType } from "src/poets/events";
import { SlamEventType } from ".";
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

    const payload =
      typeof eventInput.payload === "string"
        ? JSON.parse(eventInput.payload)
        : eventInput.payload;

    switch (eventType) {
      case "SlamCreated":
        return new SlamCreatedEvent({
          ...baseEventData,
          payload: {
            regionalId: payload.regionalId,
            nation: "",
            city: "",
            venue: "",
            day: 0,
            year: 0,
            monthIndex: 0,
          },
        });
    }
  }
}
