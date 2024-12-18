import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetSetAsMCEventPayload = {
  poetId: string;
  occurredAt: Date;
};

export class PoetSetAsMCEvent extends PSMEvent {
  constructor(payload: PoetSetAsMCEventPayload) {
    super(payload.occurredAt);
    this.payload = payload;
  }
}
