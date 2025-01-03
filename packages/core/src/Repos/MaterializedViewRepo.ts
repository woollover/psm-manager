import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
/**
 * The repository takes the materialized view interface as type arg
 * This is initialized with a viewKey that is the pk of the DynamoDB table
 * It takes the materialized view from a projector and saves it
 *
 */

export class MaterializedViewRepository<MVInterface> {
  #tablename: string;
  #client: DynamoDBDocument;
  #materializedView: MVInterface | null = null;
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

  public get materializedView(): MVInterface | null {
    return this.#materializedView;
  }

  async load(): Promise<MVInterface | null> {
    if (this.#materializedView) {
      return this.#materializedView;
    }
    const result = await this.#client.get({
      TableName: this.#tablename,
      Key: { viewKey: this.#viewKey },
    });
    this.#materializedView =
      (result.Item?.materializedView as MVInterface) || null;

    console.log("🔥 Materialized View", this.#materializedView);
    return this.#materializedView;
  }

  async save(mv: MVInterface) {
    this.#materializedView = mv;
    await this.#client.put({
      TableName: this.#tablename,
      Item: {
        viewKey: this.#viewKey,
        materializedView: mv,
      },
    });
  }
}
