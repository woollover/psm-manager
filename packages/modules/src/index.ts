import { PoetEvent } from "./poets/events";
import { SlamEvent } from "./slam/events";

export type PSMAllEvents = SlamEvent | PoetEvent;

export type PSMAllEventNames = PSMAllEvents["eventType"];
