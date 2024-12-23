import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetDeletedEventPayload = {
  aggregateId: string;
};

export class PoetDeletedEvent extends PSMEvent {
  constructor({
    payload,
    occurredAt,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetDeletedEventPayload;
    occurredAt: Date;
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId ?? payload.aggregateId,
      aggregateOffset: aggregateOffset ?? 1,
      eventType: "PoetDeleted",
      payload: payload,
      occurredAt: occurredAt,
      globalOffset: globalOffset ?? undefined,
    });
    this.payload = payload;
  }
}
