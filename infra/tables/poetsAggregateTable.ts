export const PoetsAggregateTable = new sst.aws.Dynamo("PoetsAggregateTable", {
  fields: {
    aggregateId: "string",
    version: "number",
    createdAt: "number",
  },
  primaryIndex: { hashKey: "aggregateId", rangeKey: "version" },
  localIndexes: {
    createdAtIndex: { rangeKey: "createdAt" },
  },
  stream: "new-image",
});
