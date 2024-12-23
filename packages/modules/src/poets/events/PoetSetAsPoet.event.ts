import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetSetAsPoetEventPayload = {
  aggregateId: string;
};

export class PoetSetAsPoetEvent extends PSMEvent {
  constructor({
    payload,
    occurredAt,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetSetAsPoetEventPayload;
    occurredAt: Date;
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId ?? payload.aggregateId,
      aggregateOffset: aggregateOffset ?? 1,
      eventType: "PoetSetAsPoet",
      payload: {},
      occurredAt: occurredAt,
      globalOffset: globalOffset ?? undefined,
    });
    this.payload = payload;
  }
}
