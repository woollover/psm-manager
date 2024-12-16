export abstract class AggregateRoot<TId> {
  private readonly _uncommittedEvents: Event[] = [];
  protected _version: number = 0;

  constructor(public readonly id: TId) {}

  // Apply an event and mutate state
  protected apply(event: Event): void {
    this._version++;
    this.mutate(event);
    this._uncommittedEvents.push(event);
  }

  // Abstract method to handle event mutation
  protected abstract mutate(event: Event): void;

  // Retrieve uncommitted events
  public getUncommittedEvents(): Event[] {
    return [...this._uncommittedEvents]; // it's a new array bcs the uncommittedEvents is readonly and immutable
  }

  // Clear uncommitted events after persistence
  public clearUncommittedEvents(): void {
    this._uncommittedEvents.length = 0;
  }

  // Rehydrate aggregate from persisted events
  public loadFromHistory(events: Event[]): void {
    for (const event of events) {
      this.mutate(event);
      this._version++;
    }
  }

  public get version(): number {
    return this._version;
  }
}
