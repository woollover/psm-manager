import { PSMEvent } from "@psm/core";

export interface MCAssignedEventPayload {
  mcId: string;
}

export class MCAssignedEvent extends PSMEvent<
  MCAssignedEventPayload,
  "MCAssigned"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: MCAssignedEventPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "MCAssigned",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}
