import { PSMEvent } from "@psm/core";

export interface PoetCandidatedEventPayload {
  poetId: string;
}

export class PoetCandidatedEvent extends PSMEvent<
  PoetCandidatedEventPayload,
  "PoetCandidated"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetCandidatedEventPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "PoetCandidated",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}
