import { PSMEvent } from "@psm/core";

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
  }
}

declare module "@psm/core" {
  interface EventRegistry {
    PoetCreated: PoetCreatedEventPayload;
  }
}
