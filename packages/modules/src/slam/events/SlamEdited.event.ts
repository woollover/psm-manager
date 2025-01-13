import { CountryId } from "@psm/common";
import { PSMEvent } from "@psm/core";

export interface SlamEditedPayload {
  regionalId?: string;
  countryId?: CountryId;
  city?: string;
  venue?: string;
  dateTime?: number;
  name?: string;
}

export class SlamEditedEvent extends PSMEvent<SlamEditedPayload, "SlamEdited"> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: SlamEditedPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "SlamEdited",
      payload: payload,
      timestamp,
      aggregateOffset,
      globalOffset,
    });
  }
}
