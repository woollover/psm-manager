import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetReactivatedEventPayload = {
  aggregateId: string;
};

export class PoetReactivatedEvent extends PSMEvent {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetReactivatedEventPayload;
    timestamp: number;
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId ?? payload.aggregateId,
      aggregateOffset: aggregateOffset,
      eventType: "PoetReactivated",
      payload: payload,
      timestamp: timestamp,
      globalOffset: globalOffset,
    });
    this.payload = payload;
  }
}
