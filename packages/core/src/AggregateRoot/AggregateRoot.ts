import { Command } from "../Command/Command";
import { PSMEvent } from "../Event/Event";

export abstract class AggregateRoot {
  private readonly _uncommittedEvents: PSMEvent<any, string>[] = [];
  protected _version: number = 1;
  protected _aggregateOffset: number = 0;

  constructor(public readonly id: string) {}

  // Apply an event and mutate state
  protected apply(event: PSMEvent<any, string>): void {
    this.mutate(event);
    this._aggregateOffset++;
    this._uncommittedEvents.push(event);
  }

  // Abstract method to handle event mutation
  protected abstract mutate(event: PSMEvent<any, string>): void;

  abstract applyCommand(command: Command<any, string>): Promise<void>;

  // Retrieve uncommitted events
  public get uncommittedEvents(): PSMEvent<any, string>[] {
    return [...this._uncommittedEvents]; // it's a new array bcs the uncommittedEvents is readonly and immutable
  }

  // Clear uncommitted events after persistence
  public clearUncommittedEvents(): void {
    this._uncommittedEvents.length = 0;
  }

  // Rehydrate aggregate from persisted events
  public loadFromHistory(events: PSMEvent<any, string>[]): void {
    for (const event of events) {
      this.mutate(event);
      this._aggregateOffset++;
    }
  }

  public get offset(): number {
    return this._aggregateOffset;
  }
}
