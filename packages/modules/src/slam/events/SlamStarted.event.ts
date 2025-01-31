import { PSMEvent } from "@psm/core";

export interface SlamStartedEventPayload {}

export class SlamStartedEvent extends PSMEvent<
  SlamStartedEventPayload,
  "SlamStarted"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: SlamStartedEventPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "SlamStarted",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}

declare module "@psm/core" {
  interface EventRegistry {
    SlamStartedEvent: SlamStartedEventPayload;
  }
}
