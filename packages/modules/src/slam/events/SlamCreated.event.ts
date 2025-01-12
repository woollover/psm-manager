import { CountryId } from "@psm/common/constants/countries";
import { PSMEvent } from "@psm/core";

export interface SlamCreatedPayload {
  regionalId: string;
  countryId: CountryId;
  city: string;
  venue: string;
  timestamp: number;
  name: string;
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
