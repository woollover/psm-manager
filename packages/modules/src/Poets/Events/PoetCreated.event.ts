import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetCreatedEventPayload = {
  mcId: string;
  name: string;
  email: string;
  occurredAt: Date;
};

export class PoetCreatedEvent extends PSMEvent {
  constructor(payload: PoetCreatedEventPayload) {
    super(payload.occurredAt);
    this.payload = payload;
  }
}
