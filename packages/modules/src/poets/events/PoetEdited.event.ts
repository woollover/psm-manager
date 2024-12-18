import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetEditedEventPayload = {
  poetId: string;
  name: string | undefined;
  email: string | undefined;
  instagram_handle: string | undefined;
};

export class PoetEditedEvent extends PSMEvent {
  constructor(payload: PoetEditedEventPayload, occurredAt: Date) {
    super({
      aggregateId: payload.poetId,
      version: 1,
      eventType: "PoetEdited",
      payload: payload,
      occurredAt: occurredAt,
    });
    this.payload = payload;
  }
}
