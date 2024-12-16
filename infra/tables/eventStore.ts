export const eventStoreTable = new sst.aws.Dynamo("EventStore", {
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

/**
 * @usage if you want to read all the streams of new events recorded,
 * add this
 *  table.subscribe("NAME_OF_FUNC", "PATH_TO_FUNC");
 */
