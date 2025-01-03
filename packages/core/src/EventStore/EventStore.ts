import {
  DynamoDBDocument,
  QueryCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { PSMEvent } from "../Event/Event";

export class EventStore {
  private tableName: string;
  private client: DynamoDBDocument;

  constructor(tableName: string, client: DynamoDBDocument) {
    this.tableName = tableName;
    this.client = client;
  }

  async saveEvents(events: PSMEvent<unknown, any>[]): Promise<void> {
    for (const event of events) {
      await this.saveEvent(event);
      console.log("EventStore - event saved");
    }
  }
  /**
   * Save a new event to the store
   * @param event The event to store
   */
  async saveEvent(event: PSMEvent<unknown, any>): Promise<void> {
    const aggregateOffset = await this.getNextAggregateOffset(
      event.getAggregateId
    );

    const globalOffset = await this.getNextGlobalOffset();

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        eventId: event.getEventId,
        aggregateId: event.getAggregateId,
        aggregateOffset: aggregateOffset,
        eventType: event.getEventType,
        payload: event.getPayload,
        timestamp: Math.floor(new Date(event.getTimestamp).getTime()), // Convert to Unix timestamp
        globalOffset: globalOffset,
        pivotKey: "event",
      },
      ConditionExpression:
        "attribute_not_exists(aggregateId) AND attribute_not_exists(aggregateOffset)",
    });

    let retries = 3;
    while (retries > 0) {
      try {
        await this.client.send(command);
        console.log("💾 Event saved successfully", {
          aggregateId: event.getAggregateId,
          aggregateOffset: event.getAggregateOffset,
          globalOffset: event.getGlobalOffset,
        });
        return;
      } catch (error) {
        //@ts-expect-error
        if (error.name === "ConditionalCheckFailedException" && retries > 1) {
          console.warn("Retrying saveEvent due to conditional check failure", {
            retriesLeft: retries - 1,
          });
          retries--;
        } else {
          console.error("Failed to save event", {
            aggregateId: event.getAggregateId,
            aggregateOffset: event.getAggregateOffset,
            globalOffset: event.getGlobalOffset,
          });
          throw error;
        }
      }
    }
  }

  /**
   *
   * @param eventType
   * @returns
   */
  async getEventsByType(eventType: string): Promise<PSMEvent<unknown, any>[]> {
    console.log("🚀 Getting events by type", { eventType });
    // eventually check if the request event Type is a mapped type in application
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "eventTypeIndex",
      KeyConditionExpression: "eventType = :type",
      ExpressionAttributeValues: {
        ":type": eventType,
      },
    });
    const response = await this.client.send(command);
    return (
      response.Items?.map((item) => {
        return new PSMEvent({
          eventId: item.eventId ?? undefined,
          aggregateId: item.aggregateId ?? "",
          aggregateOffset: item.aggregateOffset ?? 0,
          eventType: item.eventType ?? "UnknownEvent",
          payload: item.payload ?? {},
          timestamp: item.timestamp ?? new Date().getTime(),
          globalOffset: item.globalOffset ?? 0,
          version: item.version ?? 1,
        });
      }) || []
    );
  }

  /**
   * Retrieve all events for a specific aggregate
   * @param aggregateId The ID of the aggregate
   */
  async getEvents(aggregateId: string): Promise<PSMEvent<unknown, any>[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: "aggregateId = :id",
      ExpressionAttributeValues: {
        ":id": aggregateId,
      },
      ScanIndexForward: true, // Ensure events are ordered by version
    });

    const response = await this.client.send(command);
    return (
      response.Items?.map((item) => {
        // console.log("🚀 Item:", item);
        return new PSMEvent({
          eventId: item.eventId ?? undefined,
          aggregateId: item.aggregateId ?? "",
          aggregateOffset: item.version ?? 0,
          eventType: item.eventType ?? "UnknownEvent",
          payload: item.payload ?? {},
          timestamp: item.timestamp ?? new Date().getTime(),
          globalOffset: item.globalOffset ?? 0,
          version: item.version ?? 1,
        });
      }) || []
    );
  }

  async getNextAggregateOffset(aggregateId: string): Promise<number> {
    console.log("🚀 Getting next aggregate offset", { aggregateId });
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: "aggregateId = :id",
      ExpressionAttributeValues: {
        ":id": aggregateId,
      },
      ScanIndexForward: false, // Get the latest version
      Limit: 1,
    });

    const response = await this.client.send(command);
    const lastOffset = response.Items?.[0]?.aggregateOffset ?? 0;
    return lastOffset + 1;
  }

  private async getNextGlobalOffset(): Promise<number> {
    console.log("🚀 Getting next global offset");
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: "globalOffsetIndex",
        KeyConditionExpression: "pivotKey = :pivotKey",
        ExpressionAttributeValues: {
          ":pivotKey": "event",
        },
        ScanIndexForward: false,
        Limit: 1,
      });

      const response = await this.client.send(command);
      const lastSequence = response.Items?.[0]?.globalOffset ?? 0;
      return lastSequence + 1;
    } catch (error) {
      console.error("Failed to get next global sequence", error);
      return 1; // Start from 1 if no events exist
    }
  }

  async getEventsByGlobalOffset(
    start: number,
    end?: number
  ): Promise<PSMEvent<unknown, any>[]> {
    console.log("🚀 Getting events by global offset", { start, end });

    // Since we can't do BETWEEN on globalOffset directly anymore,
    // we'll need to use a Scan operation or query by eventType
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "globalOffsetIndex",
      KeyConditionExpression: end
        ? "#pk = :event AND #go BETWEEN :start AND :end"
        : "#pk = :event AND #go >= :start",
      ExpressionAttributeNames: {
        "#go": "globalOffset",
        "#pk": "pivotKey",
      },
      ExpressionAttributeValues: {
        ":event": "event",
        ":start": start,
        ...(end ? { ":end": end } : {}),
      },
    });

    const response = await this.client.send(command);
    return (
      response.Items?.map((item) => {
        return new PSMEvent({
          aggregateId: item.aggregateId,
          aggregateOffset: item.aggregateOffset,
          globalOffset: item.globalOffset,
          eventType: item.eventType,
          payload:
            typeof item.payload === "string"
              ? JSON.parse(item.payload)
              : item.payload,
          version: item.version,
          timestamp: item.timestamp,
          eventId: item.eventId,
        });
      }) || []
    );
  }
}
