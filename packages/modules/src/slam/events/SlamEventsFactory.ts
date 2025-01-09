import { SlamEventPayload, SlamEventPayloadUnion, SlamEventType } from ".";
import { EventInput } from "@psm/core/Event/Event";
import { randomUUID } from "crypto";
import { SlamCreatedEvent } from "./SlamCreated.event";
import { SlamDeletedEvent } from "./SlamDeleted.event";
import { SlamEditedEvent } from "./SlamEdited.event";
import { MCAssignedEvent } from "./MCAssigned.event";
import { MCUnassignedEvent } from "./MCUnassigned.event";
import { CallOpenedEvent } from "./CallOpened.event";
import { PoetCandidatedEvent } from "./PoetCandidated.event";
import { CallClosedEvent } from "./CallClosed.event";

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

      case "SlamEdited":
        const slamEditedPayload = payloadBody as SlamEventPayload<"SlamEdited">;
        return new SlamEditedEvent({
          ...baseEventData,
          payload: slamEditedPayload,
        });
      case "MCAssigned":
        const mcAssignedPayload = payloadBody as SlamEventPayload<"MCAssigned">;
        return new MCAssignedEvent({
          ...baseEventData,
          payload: mcAssignedPayload,
        });

      case "MCUnassigned":
        const mcUnassignedPayload =
          payloadBody as SlamEventPayload<"MCUnassigned">;
        return new MCUnassignedEvent({
          ...baseEventData,
          payload: mcUnassignedPayload,
        });
      case "CallOpened":
        const callOpenedPayload = payloadBody as SlamEventPayload<"CallOpened">;
        return new CallOpenedEvent({
          ...baseEventData,
          payload: callOpenedPayload,
        });

      case "CallClosed":
        const callClosedPayload = payloadBody as SlamEventPayload<"CallClosed">;
        return new CallClosedEvent({
          ...baseEventData,
          payload: callClosedPayload,
        });

      case "PoetCandidated":
        const poetCandidatedPayload =
          payloadBody as SlamEventPayload<"PoetCandidated">;
        return new PoetCandidatedEvent({
          ...baseEventData,
          payload: poetCandidatedPayload,
        });

      default:
        throw new Error(`Event not found: ${eventType}`);
    }
  }
}
