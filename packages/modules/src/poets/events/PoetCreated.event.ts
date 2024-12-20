import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetCreatedEventPayload = {
  poetId: string;
  name: string;
  email: string;
};

export class PoetCreatedEvent extends PSMEvent {
  constructor(payload: PoetCreatedEventPayload, occurredAt: Date) {
    super({
      aggregateId: payload.poetId,
      eventType: "PoetCreated",
      payload: payload,
      occurredAt: occurredAt,
    });
    this.payload = payload;
  }
}
