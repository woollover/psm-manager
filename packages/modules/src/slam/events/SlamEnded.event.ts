import { PSMEvent } from "@psm/core";

export interface SlamEndedPayload {}

export class SlamEndedEvent extends PSMEvent<SlamEndedPayload, "SlamEnded"> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: SlamEndedPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "SlamEnded",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}
