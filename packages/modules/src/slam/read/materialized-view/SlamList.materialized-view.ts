import { KinesisStreamingDestinationOutput } from "@aws-sdk/client-dynamodb";
import { CountryId } from "@psm/common";
import { SlamCreatedEvent } from "src/slam/events/SlamCreated.event";

interface SlamsListData {
  id: string;
  name: string;
  date: string;
  region: string;
  city: string;
  countryId: CountryId;
  started: boolean;
  ended: boolean;
  callOpen: boolean;
  mcs: string[];
  poets: string[];
}

export interface SlamsListMaterializedViewDBShape {
  slams: Map<string, SlamsListData>; // I like maps bcs they can get obj without iterations
}

export class SlamsListMaterializedView {
  #viewKey = "slam-list";
  #data: Map<string, SlamsListData> = new Map();

  constructor(materializedView: SlamsListMaterializedViewDBShape) {
    this.#data = materializedView ? materializedView.slams : new Map();
  }

  createSlam(event: SlamCreatedEvent): SlamsListMaterializedView {
    const slamObj: SlamsListData = {
      id: event.getAggregateId,
      name: event.getPayload.name,
      date: new Date(event.getPayload.dateTime).toISOString(),
      region: event.getPayload.regionalId,
      city: event.getPayload.city,
      countryId: event.getPayload.countryId,
      started: false,
      ended: false,
      callOpen: false,
      mcs: [],
      poets: [],
    };

    this.#data.set(event.getAggregateId, slamObj);

    return this;
  }

  get viewToSave(): SlamsListMaterializedViewDBShape {
    return { slams: this.#data };
  }
}
