import { PSMEvent } from "../../../../core/src/Event/Event";

export type PoetEditedEventPayload = {
  poetId: string;
  name: string | undefined;
  email: string | undefined;
  instagram_handle: string | undefined;
  occurredAt: Date;
};

export class PoetEditedEvent extends PSMEvent {
  constructor(payload: PoetEditedEventPayload) {
    super(payload.occurredAt);
    this.payload = payload;
  }
}
