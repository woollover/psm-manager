import { PSMEvent } from "../Event/Event";

export abstract class AggregateRoot {
  private readonly _uncommittedEvents: PSMEvent<unknown, any>[] = [];
  protected _version: number = 1;
  protected _aggregateOffset: number = 0;

  constructor(public readonly id: string) {}

  // Apply an event and mutate state
  protected apply(event: PSMEvent<unknown, any>): void {
    this.mutate(event);
    this._aggregateOffset++;
    this._uncommittedEvents.push(event);
  }

  // Abstract method to handle event mutation
  protected abstract mutate(event: PSMEvent<unknown, any>): void;

  // Retrieve uncommitted events
  public get uncommittedEvents(): PSMEvent<unknown, any>[] {
    return [...this._uncommittedEvents]; // it's a new array bcs the uncommittedEvents is readonly and immutable
  }

  // Clear uncommitted events after persistence
  public clearUncommittedEvents(): void {
    this._uncommittedEvents.length = 0;
  }

  // Rehydrate aggregate from persisted events
  public loadFromHistory(events: PSMEvent<unknown, any>[]): void {
    for (const event of events) {
      this.mutate(event);
      this._aggregateOffset++;
    }
  }

  public get offset(): number {
    return this._aggregateOffset;
  }
}
