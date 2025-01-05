import { PSMEvent } from "@psm/core/Event/Event";

export interface PoetCreatedEventPayload {
  firstName: string;
  lastName: string;
  email: string;
  instagramHandle: string;
  birthDate: string;
}

export class PoetCreatedEvent extends PSMEvent<
  PoetCreatedEventPayload,
  "PoetCreated"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetCreatedEventPayload;
    timestamp: number;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "PoetCreated",
      payload: payload,
      timestamp: timestamp,
      aggregateOffset: aggregateOffset,
      globalOffset: globalOffset,
    });
    this.payload = payload;
  }
}
