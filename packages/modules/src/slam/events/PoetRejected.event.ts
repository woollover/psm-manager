import { PSMEvent } from "@psm/core";

export interface PoetRejectedEventPayload {
  poetId: string;
  reason: string;
}

export class PoetRejectedEvent extends PSMEvent<
  PoetRejectedEventPayload,
  "PoetRejected"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetRejectedEventPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "PoetRejected",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}

declare module "@psm/core" {
  interface EventRegistry {
    PoetRejectedEvent: PoetRejectedEventPayload;
  }
}
