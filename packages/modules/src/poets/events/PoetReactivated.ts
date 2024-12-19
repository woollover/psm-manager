import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetReactivatedEventPayload = {
  poetId: string;
};

export class PoetReactivatedEvent extends PSMEvent {
  constructor(payload: PoetReactivatedEventPayload, occurredAt: Date) {
    super({
      aggregateId: payload.poetId,
      eventType: "PoetReactivated",
      payload: payload,
      occurredAt: occurredAt,
      version: undefined,
    });
    this.payload = payload;
  }
}
