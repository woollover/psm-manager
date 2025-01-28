import { PSMEvent } from "@psm/core";

export interface PoetSetAsPoetEventPayload {
  aggregateId: string;
}

export class PoetSetAsPoetEvent extends PSMEvent<
  PoetSetAsPoetEventPayload,
  "PoetSetAsPoet"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetSetAsPoetEventPayload;
    timestamp: number;
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId ?? payload.aggregateId,
      aggregateOffset: aggregateOffset,
      eventType: "PoetSetAsPoet",
      payload: payload,
      timestamp: timestamp,
      globalOffset: globalOffset,
    });
  }
}

declare module "@psm/core" {
  interface EventRegistry {
    PoetSetAsPoet: PoetSetAsPoetEventPayload;
  }
}
