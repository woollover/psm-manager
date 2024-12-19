import { randomUUID } from "crypto";

export class PSMEvent {
  protected payload: Record<string, any>;
  protected event_id: string;
  protected aggregateId: string;
  protected version: number;
  protected timestamp: number;
  protected eventType: string;
  protected occurredAt: string;
  constructor({
    aggregateId,
    version,
    eventType,
    payload,
    occurredAt,
  }: {
    aggregateId: string;
    version: number | undefined;
    eventType: string;
    payload: Record<string, any>;
    occurredAt: Date; // iso string
  }) {
    this.event_id = `evt-${randomUUID()}`;
    this.aggregateId = aggregateId;
    this.version = version || 1;
    this.timestamp = occurredAt.getTime();
    this.eventType = eventType;
    this.occurredAt = occurredAt.toISOString();
    this.payload = payload;
  }

  get getPayload(): any {
    return this.payload;
  }
  get getVersion(): number {
    return this.version;
  }

  get getTimestamp(): number {
    return this.timestamp;
  }
  get getEventType(): string {
    return this.eventType;
  }

  get getAggregateId(): string {
    return this.aggregateId;
  }
}
