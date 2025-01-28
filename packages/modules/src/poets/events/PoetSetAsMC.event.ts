import { PSMEvent } from "@psm/core";

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
  }
}

declare module "@psm/core" {
  interface EventRegistry {
    PoetSetAsMC: PoetSetAsMCEventPayload;
  }
}
