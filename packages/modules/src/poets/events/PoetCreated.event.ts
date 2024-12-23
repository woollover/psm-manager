import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetCreatedEventPayload = {
  name: string;
  email: string;
};

export class PoetCreatedEvent extends PSMEvent {
  constructor({
    payload,
    occurredAt,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetCreatedEventPayload;
    occurredAt: Date;
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId,
      eventType: "PoetCreated",
      payload: payload,
      occurredAt: occurredAt,
      aggregateOffset: aggregateOffset ?? undefined,
      globalOffset: globalOffset ?? undefined,
    });
    this.payload = payload;
  }
}
