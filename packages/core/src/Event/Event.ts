import { randomUUID } from "crypto";

export abstract class PSMEvent {
  protected payload: any;
  protected event_id: string;
  constructor(public readonly occurredAt: Date) {
    this.event_id = randomUUID();
  }

  get getPayload(): any {
    return this.payload;
  }
}
