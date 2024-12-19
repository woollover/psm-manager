import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetSetAsPoetEventPayload = {
  aggregateId: string;
};

export class PoetSetAsPoetEvent extends PSMEvent {
  constructor(payload: PoetSetAsPoetEventPayload, occurredAt: Date) {
    super({
      aggregateId: payload.aggregateId,
      eventType: "PoetSetAsPoet",
      payload: {},
      occurredAt: occurredAt,
      version: 1,
    });
    this.payload = payload;
  }
}
