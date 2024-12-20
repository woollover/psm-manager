import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export class MaterializedViewRepository<MVType> {
  #tablename: string;
  #client: DynamoDBDocument;
  #materializedView: MVType | null = null;
  #viewKey: string;
  constructor({
    tablename,
    client,
    viewKey,
  }: {
    tablename: string;
    client: DynamoDBDocument;
    viewKey: string;
  }) {
    this.#tablename = tablename;
    this.#client = client;
    this.#viewKey = viewKey;
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
      Key: { id: this.#viewKey },
    });
    this.#materializedView = result.Item as MVType;
    return this.#materializedView;
  }

  async save() {
    if (!this.#materializedView) {
      throw new Error("Materialized view not loaded");
    }
    await this.#client.put({
      TableName: this.#tablename,
      Item: this.#materializedView,
    });
  }
}
