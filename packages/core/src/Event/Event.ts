export abstract class PSMEvent {
  protected payload: any;
  constructor(public readonly occurredAt: Date) {}

  get getPayload(): any {
    return this.payload;
  }
}
