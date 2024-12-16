import { Resource } from "sst";
import { Example } from "@psm/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
