import { PSMEvent } from "@psm/core/Event/Event";

export interface PoetSetAsMCEventPayload {
  aggregateId: string;
}

export class PoetSetAsMCEvent extends PSMEvent<
  PoetSetAsMCEventPayload,
  "PoetSetAsMC"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetSetAsMCEventPayload;
    timestamp: number;
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId ?? payload.aggregateId,
      aggregateOffset: aggregateOffset,
      eventType: "PoetSetAsMC",
      payload: payload,
      timestamp: timestamp,
      globalOffset: globalOffset,
    });
    this.payload = payload;
  }
}
