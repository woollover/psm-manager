import { PSMEvent } from "@psm/core";

export interface PoetReactivatedEventPayload {
  aggregateId: string;
}

export class PoetReactivatedEvent extends PSMEvent<
  PoetReactivatedEventPayload,
  "PoetReactivated"
> {
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
  }
}

declare module "@psm/core" {
  interface EventRegistry {
    PoetReactivated: PoetReactivatedEventPayload;
  }
}
