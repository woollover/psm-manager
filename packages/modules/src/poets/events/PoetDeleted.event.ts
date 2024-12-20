import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetDeletedEventPayload = {
  poetId: string;
};

export class PoetDeletedEvent extends PSMEvent {
  constructor(payload: PoetDeletedEventPayload, occurredAt: Date) {
    super({
      aggregateId: payload.poetId,
      aggregateOffset: 1,
      eventType: "PoetDeleted",
      payload: payload,
      occurredAt: occurredAt,
    });
    this.payload = payload;
  }
}
