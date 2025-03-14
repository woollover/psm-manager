import { PSMEvent } from "@psm/core";

export interface SlamDeletedPayload {}

export class SlamDeletedEvent extends PSMEvent<
  SlamDeletedPayload,
  "SlamDeleted"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: SlamDeletedPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "SlamDeleted",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}

declare module "@psm/core" {
  interface EventRegistry {
    SlamDeleted: SlamDeletedPayload;
  }
}
