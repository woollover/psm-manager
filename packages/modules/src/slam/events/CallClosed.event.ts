import { PSMEvent } from "@psm/core/Event/Event";

export interface SlamCallClosedPayload {}

export class CallClosedEvent extends PSMEvent<
  SlamCallClosedPayload,
  "CallClosed"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: SlamCallClosedPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "CallClosed",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}
