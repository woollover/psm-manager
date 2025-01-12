import { PSMEvent } from "@psm/core";

export interface SlamCallOpenedPayload {}

export class CallOpenedEvent extends PSMEvent<
  SlamCallOpenedPayload,
  "CallOpened"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: SlamCallOpenedPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "CallOpened",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}
