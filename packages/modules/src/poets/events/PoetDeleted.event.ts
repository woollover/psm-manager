import { PSMEvent } from "@psm/core";

export interface PoetDeletedEventPayload {
  aggregateId: string;
}

export class PoetDeletedEvent extends PSMEvent<
  PoetDeletedEventPayload,
  "PoetDeleted"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetDeletedEventPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId ?? payload.aggregateId,
      aggregateOffset: aggregateOffset,
      eventType: "PoetDeleted",
      payload: payload,
      timestamp: timestamp,
      globalOffset: globalOffset,
    });
  }
}

declare module "@psm/core" {
  interface EventRegistry {
    PoetDeleted: PoetDeletedEventPayload;
  }
}
