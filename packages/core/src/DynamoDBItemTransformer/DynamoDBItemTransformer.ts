export class DynamoDBItemTransformer {
  // Converts a class instance to a plain object
  static toItem<T extends new (...args: any[]) => any>(
    instance: InstanceType<T>
  ): Record<string, any> {
    const attributes = Object.entries(instance);

    return attributes.reduce<Record<string, any>>((item, [key, value]) => {
      item[key] = this.transformValue(value);
      return item;
    }, {});
  }

  // Converts a plain object to an instance of the specified class
  static fromItem<T extends new (...args: any[]) => any>(
    cls: T,
    item: Record<string, any>
  ): InstanceType<T> {
    const instance = new cls(); // Create a new instance of the class
    Object.entries(item).forEach(([key, value]) => {
      if (key in instance) {
        (instance as any)[key] = value; // Assign the value to the instance property
      }
    });
    return instance;
  }

  // Helper to recursively transform values to DynamoDB-compatible format
  private static transformValue(value: unknown): any {
    if (value === null || value === undefined) {
      throw new Error("Null or undefined values cannot be stored in DynamoDB");
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.transformValue(item));
    }

    if (typeof value === "object") {
      return Object.entries(value).reduce<Record<string, any>>(
        (acc, [key, val]) => {
          acc[key] = this.transformValue(val);
          return acc;
        },
        {}
      );
    }

    throw new Error(`Unsupported data type: ${typeof value}`);
  }
}
