export const EventStoreTable = new sst.aws.Dynamo("EventStore", {
  fields: {
    aggregateId: "string",
    aggregateOffset: "number",
    eventType: "string",
    globalOffset: "number",
    pivotKey: "string",
    timestamp: "number",
  },
  primaryIndex: { hashKey: "aggregateId", rangeKey: "aggregateOffset" },

  globalIndexes: {
    globalOffsetIndex: {
      hashKey: "pivotKey",
      rangeKey: "globalOffset",
      projection: "all",
    },
    eventTypeIndex: {
      hashKey: "eventType",
      projection: "all",
    },
    timestampIndex: {
      hashKey: "pivotKey",
      rangeKey: "timestamp",
      projection: "all",
    },
  },
  stream: "new-image",
});

/**
 * @usage if you want to read all the streams of new events recorded,
 * add this
 *  table.subscribe("NAME_OF_FUNC", "PATH_TO_FUNC");
 */
