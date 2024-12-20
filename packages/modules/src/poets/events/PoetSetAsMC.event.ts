import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetSetAsMCEventPayload = {
  aggregateId: string;
};

export class PoetSetAsMCEvent extends PSMEvent {
  constructor(payload: PoetSetAsMCEventPayload, occurredAt: Date) {
    super({
      aggregateId: payload.aggregateId,
      eventType: "PoetSetAsMC",
      payload: {},
      occurredAt: occurredAt,
      aggregateOffset: 1,
    });
    this.payload = payload;
  }
}
