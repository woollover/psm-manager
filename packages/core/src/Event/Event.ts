import { randomUUID } from "crypto";

export class PSMEvent {
  protected payload: Record<string, any>;
  protected event_id: string;
  protected aggregateId: string;
  protected globalOffset: number;
  protected aggregateOffset: number;
  protected timestamp: number;
  protected eventType: string;
  protected occurredAt: string;
  protected version: number = 1;
  protected pivotKey: string = "event";
  constructor({
    aggregateId,
    aggregateOffset,
    globalOffset,
    eventType,
    payload,
    occurredAt,
    version,
  }: {
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
    eventType: string;
    payload: Record<string, any>;
    occurredAt: Date; // iso string
    version?: number | undefined;
  }) {
    this.event_id = `evt-${randomUUID()}`;
    this.aggregateId = aggregateId;
    this.aggregateOffset = aggregateOffset || 1;
    this.globalOffset = globalOffset || 1;
    this.version = version || 1;
    this.timestamp = occurredAt.getTime();
    this.eventType = eventType;
    this.occurredAt = occurredAt.toISOString();
    this.payload = payload;
  }

  get getPayload(): any {
    return this.payload;
  }
  get getAggregateOffset(): number {
    return this.aggregateOffset;
  }

  get getGlobalOffset(): number {
    return this.globalOffset;
  }

  get getTimestamp(): number {
    return this.timestamp;
  }

  get getEventType(): string {
    return this.eventType;
  }

  get getVersion(): number {
    return this.version;
  }

  get getAggregateId(): string {
    return this.aggregateId;
  }
}
