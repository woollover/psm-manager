export const PoetsAggregateTable = new sst.aws.Dynamo("PoetsAggregateTable", {
  fields: {
    aggregateId: "string",
    aggregateOffset: "number",
    createdAt: "number",
  },
  primaryIndex: { hashKey: "aggregateId", rangeKey: "aggregateOffset" },
  localIndexes: {
    createdAtIndex: { rangeKey: "createdAt" },
  },
  stream: "new-image",
});
