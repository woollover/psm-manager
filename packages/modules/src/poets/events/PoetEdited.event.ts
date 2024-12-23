import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetEditedEventPayload = {
  aggregateId: string;
  name: string | undefined;
  email: string | undefined;
  instagram_handle: string | undefined;
};

export class PoetEditedEvent extends PSMEvent {
  constructor({
    payload,
    occurredAt,
    aggregateId,
    aggregateOffset,
    globalOffset,
  }: {
    payload: PoetEditedEventPayload;
    occurredAt: Date;
    aggregateId?: string | undefined;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
  }) {
    super({
      aggregateId: aggregateId || payload.aggregateId,
      eventType: "PoetEdited",
      payload: payload,
      occurredAt: occurredAt,
      aggregateOffset: aggregateOffset ?? undefined,
      globalOffset: globalOffset ?? undefined,
    });
    this.payload = payload;
  }
}
