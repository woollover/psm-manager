import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetDeletedEventPayload = {
  mcId: string;
  occurredAt: Date;
};

export class PoetDeletedEvent extends PSMEvent {
  constructor(payload: PoetDeletedEventPayload) {
    super(payload.occurredAt);
    this.payload = payload;
  }
}
