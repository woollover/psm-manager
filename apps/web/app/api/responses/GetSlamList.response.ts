import { CountryId } from "@psm/common";

export interface SlamData {
  venue: string;
  name: string;
  dateTime: string;
  isEnded: boolean;
  callOpen: boolean;
}

export interface SlamListReadModelShape {
  data: {
    slams: Array<SlamData>;
    count: number;
    countries: Array<CountryId>;
  };
}
