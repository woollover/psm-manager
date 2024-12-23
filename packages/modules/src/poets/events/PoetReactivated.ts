import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetReactivatedEventPayload = {
  aggregateId: string;
};

export class PoetReactivatedEvent extends PSMEvent {
  constructor({
    payload,
    occurredAt,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetReactivatedEventPayload;
    occurredAt: Date;
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId ?? payload.aggregateId,
      aggregateOffset: aggregateOffset ?? 1,
      eventType: "PoetReactivated",
      payload: payload,
      occurredAt: occurredAt,
      globalOffset: globalOffset ?? undefined,
    });
    this.payload = payload;
  }
}
