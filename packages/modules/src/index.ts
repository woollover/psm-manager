import { EventRegistry } from "@psm/core";

import { CommandRegistry } from "@psm/core";

export function printEvent<T extends keyof EventRegistry>(
  event: T,
  payload: EventRegistry[T]
) {}

console.log(
  printEvent("PoetCreated", {
    firstName: "",
    lastName: "",
    email: "",
    instagramHandle: "",
    birthDate: "",
  })
);

export function printCommand<T extends keyof CommandRegistry>(
  event: T,
  payload: CommandRegistry[T]
) {}

console.log(
  printCommand("EditPoetCommand", {
    aggregateId: "",
  })
);

function* naturalNumbers() {
  let n = 1;
  while (true) {
    yield n++;
  }
}

const numbers = naturalNumbers();

numbers.next();
numbers.next();
numbers.next();
export class NumbersClass {
  *natural(value: number) {
    let n = 1;
    while (true) {
      yield (n += value);
    }
  }
}

const classNumber = new NumbersClass();
classNumber.natural(10).next();
classNumber.natural(10).next();
classNumber.natural(10).next();
