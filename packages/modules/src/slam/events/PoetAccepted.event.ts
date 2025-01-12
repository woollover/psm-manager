import { PSMEvent } from "@psm/core";

export interface PoetAccetedEventPayload {
  poetId: string;
}

export class PoetAcceptedEvent extends PSMEvent<
  PoetAccetedEventPayload,
  "PoetAccepted"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetAccetedEventPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "PoetAccepted",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}
