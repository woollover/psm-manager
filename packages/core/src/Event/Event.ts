import { randomUUID } from "crypto";

export class PSMEvent {
  protected payload: Record<string, any>;
  protected event_id: string;
  protected aggregateId: string;
  protected globalOffset: number;
  protected aggregateOffset: number;
  protected timestamp: number;
  protected eventType: string;
  protected version: number = 1;
  protected pivotKey: string = "event";

  constructor({
    aggregateId,
    aggregateOffset,
    globalOffset,
    eventType,
    payload,
    version,
    timestamp,
    eventId,
  }: {
    aggregateId: string;
    aggregateOffset?: number | undefined;
    globalOffset?: number | undefined;
    eventType: string;
    payload: Record<string, any>;
    timestamp?: number | undefined;
    eventId?: string | undefined;
    // fix The timestamp data when pulling events from the event store
    version?: number | undefined;
  }) {
    this.event_id = eventId || `evt-${randomUUID()}`;
    this.aggregateId = aggregateId;
    this.aggregateOffset = aggregateOffset || 1;
    this.globalOffset = globalOffset || 1;
    this.version = version || 1;
    this.timestamp = timestamp || new Date().getTime();
    this.eventType = eventType;
    this.payload = payload;
  }

  get getEventId(): string {
    return this.event_id;
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
