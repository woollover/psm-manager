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

  set materializedView(materializedView: MVType) {
    this.#materializedView = materializedView;
  }

  get materializedView(): MVType | null {
    return this.#materializedView;
  }

  async load() {
    const result = await this.#client.get({
      TableName: this.#tablename,
      Key: { id: this.#viewKey },
    });
    this.#materializedView = result.Item as MVType;
  }

  async save() {
    if (!this.materializedView) {
      throw new Error("Materialized view not loaded");
    }
    await this.#client.put({
      TableName: this.#tablename,
      Item: this.materializedView,
    });
  }
}
