import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetCreatedEventPayload = {
  aggregateId: string;
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
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId || payload.aggregateId,
      eventType: "PoetCreated",
      payload: payload,
      occurredAt: occurredAt,
      aggregateOffset: aggregateOffset ?? undefined,
      globalOffset: globalOffset ?? undefined,
    });
    this.payload = payload;
  }
}
