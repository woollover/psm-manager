import { PSMEvent } from "@psm/core/Event/Event";

export interface SlamStartedPayload {}

export class SlamStartedEvent extends PSMEvent<
  SlamStartedPayload,
  "SlamStarted"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: SlamStartedPayload;
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
