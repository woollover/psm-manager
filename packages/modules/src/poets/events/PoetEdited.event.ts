import { PSMEvent } from "@psm/core";

export interface PoetEditedEventPayload {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  instagramHandle?: string | undefined;
  birthDate?: string | undefined;
}

export class PoetEditedEvent extends PSMEvent<
  PoetEditedEventPayload,
  "PoetEdited"
> {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetEditedEventPayload;
    timestamp: number;
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId!,
      eventType: "PoetEdited",
      payload: payload,
      timestamp: timestamp,
      aggregateOffset: aggregateOffset,
      globalOffset: globalOffset,
    });
  }
}

declare module "@psm/core" {
  interface EventRegistry {
    PoetEdited: PoetEditedEventPayload;
  }
}
