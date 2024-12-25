import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
/**
 * The repository takes the materialized view class as Generic Param
 *
 *
 */

export class MaterializedViewRepository<MVType> {
  #tablename: string;
  #client: DynamoDBDocument;
  #materializedView: MVType | null = null;
  #viewKey: string;
  #defaultValue: MVType;
  constructor({
    tablename,
    client,
    viewKey,
    defaultValue,
  }: {
    tablename: string;
    client: DynamoDBDocument;
    viewKey: string;
    defaultValue: MVType;
  }) {
    this.#tablename = tablename;
    this.#client = client;
    this.#viewKey = viewKey;
    this.#defaultValue = defaultValue;
  }

  get materializedView(): MVType | null {
    return this.#materializedView;
  }

  async load(): Promise<MVType> {
    if (this.#materializedView) {
      return this.#materializedView;
    }
    const result = await this.#client.get({
      TableName: this.#tablename,
      Key: { viewKey: this.#viewKey },
    });
    this.#materializedView = result.Item?.materializedView as MVType;
    if (!this.#materializedView) {
      this.#materializedView = this.#defaultValue;
    }

    console.log("🔥 Materialized View", this.#materializedView);
    return this.#materializedView;
  }

  async save() {
    if (!this.#materializedView) {
      throw new Error("Materialized view not loaded");
    }
    await this.#client.put({
      TableName: this.#tablename,
      Item: {
        viewKey: this.#viewKey,
        materializedView: this.#materializedView,
      },
    });
  }
}
