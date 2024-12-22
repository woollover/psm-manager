export const MaterializedViewsTable = new sst.aws.Dynamo(
  "MaterializedViewsTable",
  {
    fields: {
      viewKey: "string",
    },
    primaryIndex: { hashKey: "viewKey" },
  }
);
