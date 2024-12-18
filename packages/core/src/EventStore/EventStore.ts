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

  async saveEvents(events: PSMEvent[]): Promise<void> {
    for (const event of events) {
      await this.saveEvent(event);
    }
  }
  /**
   * Save a new event to the store
   * @param event The event to store
   */
  async saveEvent(event: PSMEvent): Promise<void> {
    const nextVersion = await this.getNextVersion(event.getAggregateId);
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        aggregateId: event.getAggregateId,
        version: nextVersion,
        eventType: event.getEventType,
        payload: event.getPayload,
        timestamp: event.getTimestamp,
      },
      ConditionExpression:
        "attribute_not_exists(aggregateId) AND attribute_not_exists(version)",
    });

    let retries = 3;
    while (retries > 0) {
      try {
        await this.client.send(command);
        console.log("💾 Event saved successfully", {
          aggregateId: event.getAggregateId,
          version: event.getVersion,
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
            version: event.getVersion,
            error,
          });
          throw error;
        }
      }
    }
  }

  /**
   * Retrieve all events for a specific aggregate
   * @param aggregateId The ID of the aggregate
   */
  async getEvents(aggregateId: string): Promise<PSMEvent[]> {
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
        return new PSMEvent({
          aggregateId: item.aggregateId ?? "",
          version: item.version ?? 0,
          eventType: item.eventType ?? "UnknownEvent",
          payload: item.payload ?? {},
          occurredAt: new Date(item.timestamp ?? new Date().toISOString()),
        });
      }) || []
    );
  }

  async getNextVersion(aggregateId: string): Promise<number> {
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
    const lastVersion = response.Items?.[0]?.version ?? 0;
    return lastVersion + 1;
  }
}
