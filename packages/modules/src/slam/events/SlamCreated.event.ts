import { PSMEvent } from "@psm/core/Event/Event";

export interface SlamCreatedPayload {
  regionalId: string;
  nation: string;
  city: string;
  venue: string;
  day: number; // validatei is a correct day max 31 min 1
  year: number; // validate is not in the past
  monthIndex: number; // 0-jan >> 11-dec
}

export class SlamCreatedEvent extends PSMEvent<
  SlamCreatedPayload,
  "SlamCreated"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: SlamCreatedPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "SlamCreated",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}
