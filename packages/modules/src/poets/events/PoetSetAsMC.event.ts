import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetSetAsMCEventPayload = {
  aggregateId: string;
};

export class PoetSetAsMCEvent extends PSMEvent {
  constructor({
    payload,
    occurredAt,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetSetAsMCEventPayload;
    occurredAt: Date;
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId ?? payload.aggregateId,
      aggregateOffset: aggregateOffset ?? 1,
      eventType: "PoetSetAsMC",
      payload: {},
      occurredAt: occurredAt,
      globalOffset: globalOffset ?? undefined,
    });
    this.payload = payload;
  }
}
