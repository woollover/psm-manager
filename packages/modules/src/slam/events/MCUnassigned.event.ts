import { PSMEvent } from "@psm/core";

export interface MCUnassignedEventPayload {
  mcId: string;
}

export class MCUnassignedEvent extends PSMEvent<
  MCUnassignedEventPayload,
  "MCUnassigned"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: MCUnassignedEventPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "MCUnassigned",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}

declare module "@psm/core" {
  interface EventRegistry {
    MCUnassignedEvent: MCUnassignedEventPayload;
  }
}
