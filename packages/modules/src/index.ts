import { EventRegistry } from "@psm/core";

import { CommandRegistry } from "@psm/core";

export function printEvent<T extends keyof EventRegistry>(
  event: T,
  payload: EventRegistry[T]
) {}

console.log(printEvent("SlamDeleted", {}));

export function printCommand<T extends keyof CommandRegistry>(
  event: T,
  payload: CommandRegistry[T]
) {}

console.log(printCommand("EditPoetCommand", {
  aggregateId: ""
}));
