import { SlamEventPayload, SlamEventPayloadUnion, SlamEventType } from ".";
import { EventData } from "@psm/core";
import { randomUUID } from "crypto";
import { SlamCreatedEvent } from "./SlamCreated.event";
import { SlamDeletedEvent } from "./SlamDeleted.event";
import { SlamEditedEvent } from "./SlamEdited.event";
import { MCAssignedEvent } from "./MCAssigned.event";
import { MCUnassignedEvent } from "./MCUnassigned.event";
import { CallOpenedEvent } from "./CallOpened.event";
import { PoetCandidatedEvent } from "./PoetCandidated.event";
import { CallClosedEvent } from "./CallClosed.event";
import { PoetAcceptedEvent } from "./PoetAccepted.event";
import { PoetRejectedEvent } from "./PoetRejected.event";

type SlamEventData = EventData & { payload: SlamEventPayloadUnion };

export class SlamEventFactory {
  static createEvent(eventType: SlamEventType, eventData: SlamEventData) {
    const baseEventData = {
      timestamp: eventData.timestamp || new Date().getTime(),
      aggregateId: eventData.aggregateId ?? "evt-" + randomUUID(),
      aggregateOffset: eventData.aggregateOffset || 0,
      globalOffset: eventData.globalOffset || 0,
    };

    let payloadBody =
      typeof eventData.payload === "string"
        ? JSON.parse(eventData.payload)
        : eventData.payload;

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
            dateTime: payload.dateTime,
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

      case "PoetAccepted":
        const poetAcceptedPayload =
          payloadBody as SlamEventPayload<"PoetAccepted">;
        return new PoetAcceptedEvent({
          ...baseEventData,
          payload: poetAcceptedPayload,
        });

      case "PoetRejected":
        const poetRejectedPayload =
          payloadBody as SlamEventPayload<"PoetRejected">;
        return new PoetRejectedEvent({
          ...baseEventData,
          payload: poetRejectedPayload,
        });

      default:
        throw new Error(`Event not found: ${eventType}`);
    }
  }
}
