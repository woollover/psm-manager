import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetSetAsPoetEventPayload = {
  aggregateId: string;
};

export class PoetSetAsPoetEvent extends PSMEvent {
  constructor({
    payload,
    timestamp,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetSetAsPoetEventPayload;
    timestamp: number;
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId ?? payload.aggregateId,
      aggregateOffset: aggregateOffset,
      eventType: "PoetSetAsPoet",
      payload: payload,
      timestamp: timestamp,
      globalOffset: globalOffset,
    });
    this.payload = payload;
  }
}
