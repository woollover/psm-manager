import { PSMEvent } from "../Event/Event";
import { EventStore } from "../EventStore";

export abstract class Projector<
  EventUnion extends PSMEvent<any, string>,
  MaterializedViewClass
> {
  protected events: Array<EventUnion> = [];
  protected eventStore: EventStore;
  public _materializedView: MaterializedViewClass;

  constructor(eventStore: EventStore, materializedView: MaterializedViewClass) {
    this.eventStore = eventStore;
    this._materializedView = materializedView;
  }

  get materializedView() {
    return this._materializedView;
  }

  set materializedView(mv: MaterializedViewClass) {
    this._materializedView = mv;
  }

  abstract project(event: EventUnion): void;

  abstract recreateProjection<T extends EventUnion["eventType"]>({
    originEventType,
  }: {
    originEventType: T;
  }): void;
}
