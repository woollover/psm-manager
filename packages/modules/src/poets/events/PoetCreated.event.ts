import { PSMEvent } from "../../../../core/src/Event/Event";

export interface PoetCreatedEventPayload {
  name: string;
  email: string;
}

export class PoetCreatedEvent extends PSMEvent {
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
