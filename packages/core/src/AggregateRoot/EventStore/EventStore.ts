import {
  DynamoDBDocument,
  QueryCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

export interface Event {
  aggregateId: string;
  version: number;
  eventType: string;
  payload: Record<string, any>;
  timestamp: string;
}

export class EventStore {
  private tableName: string;
  private client: DynamoDBDocument;

  constructor(tableName: string, client: DynamoDBDocument) {
    this.tableName = tableName;
    this.client = client;
  }

  /**
   * Save a new event to the store
   * @param event The event to store
   */
  async saveEvent(event: Event): Promise<void> {
    const nextVersion = await this.getNextVersion(event.aggregateId);
    event.version = nextVersion;
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        aggregateId: event.aggregateId,
        version: event.version,
        eventType: event.eventType,
        payload: event.payload,
        timestamp: event.timestamp,
      },
      ConditionExpression:
        "attribute_not_exists(aggregateId) AND attribute_not_exists(version)",
    });

    let retries = 3;
    while (retries > 0) {
      try {
        await this.client.send(command);
        console.log("Event saved successfully", {
          aggregateId: event.aggregateId,
          version: event.version,
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
            aggregateId: event.aggregateId,
            version: event.version,
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
  async getEvents(aggregateId: string): Promise<Event[]> {
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
        return {
          aggregateId: item.aggregateId ?? "",
          version: item.version ?? 0,
          eventType: item.eventType ?? "UnknownEvent",
          payload: item.payload ?? {},
          timestamp: item.timestamp ?? new Date().toISOString(),
        };
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
