import { randomUUID } from "crypto";

export interface EventInput {
  payload: Record<string, any>;
  timestamp?: number;
  aggregateId?: string;
  aggregateOffset?: number;
  globalOffset?: number;
}

export class PSMEvent<PayloadType, EventType extends string> {
  public readonly payload: PayloadType;
  protected eventId: string;
  protected aggregateId: string;
  protected globalOffset: number;
  protected aggregateOffset: number;
  protected timestamp: number;
  readonly eventType: EventType;
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
    eventType: EventType;
    payload: PayloadType;
    timestamp?: number | undefined;
    eventId?: string | undefined;
    // fix The timestamp data when pulling events from the event store
    version?: number | undefined;
  }) {
    this.eventId = eventId || `evt-${randomUUID()}`;
    this.aggregateId = aggregateId;
    this.aggregateOffset = aggregateOffset || 1;
    this.globalOffset = globalOffset || 1;
    this.version = version || 1;
    this.timestamp = timestamp || new Date().getTime();
    this.eventType = eventType;
    this.payload = payload as PayloadType;
  }

  get getEventId(): string {
    return this.eventId;
  }

  get getPayload(): PayloadType {
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
