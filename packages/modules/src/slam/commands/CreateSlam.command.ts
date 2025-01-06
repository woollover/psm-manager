import { COUNTRY_IDS, CountryId } from "@psm/common/constants/countries";
import { Command } from "@psm/core/Command/Command";

export interface CreateSlamCommandInput {
  regionalId: string;
  countryId: CountryId;
  city: string;
  venue: string;
  day: number; // validate if is a correct day max 31 min 1
  year: number; // validate is not in the past
  monthIndex: number; // 0-jan >> 11-dec
}
export class CreateSlamCommand extends Command<
  CreateSlamCommandInput,
  "CreateSlamCommand"
> {
  validate(input: CreateSlamCommandInput): void | Promise<void> {
    this.validateDate(input)
      .validateCity(input)
      .validateVenue(input)
      .validateRegionalId(input)
      .validateCountryId(input);
  }

  private validateDate(input: CreateSlamCommandInput): CreateSlamCommand {
    const { year, monthIndex, day } = input;
    // Create a Date object with the provided inputs
    const date = new Date(year, monthIndex, day);

    // Check if the Date object is invalid
    if (isNaN(date.getTime())) {
      this.append_error({
        field: "year",
        cue: `Invalid date: ${year}-${monthIndex + 1}-${day}`,
      });
      this.append_error({
        field: "monthIndex",
        cue: `Invalid date: ${year}-${monthIndex + 1}-${day}`,
      });
      this.append_error({
        field: "day",
        cue: `Invalid date: ${year}-${monthIndex + 1}-${day}`,
      });
      // exit, nothing to do here
      return this;
    }

    // Check if the input values match the resulting Date object
    if (date.getFullYear() !== year) {
      this.append_error({
        field: "year",
        cue: `Invalid year: ${year}`,
      });
    }
    if (date.getMonth() !== monthIndex) {
      this.append_error({
        field: "monthIndex",
        cue: `Invalid monthIndex: ${monthIndex}`,
      });
    }

    if (date.getDate() !== day) {
      this.append_error({
        field: "day",
        cue: `Invalid day: ${day}`,
      });
    }

    return this; // Valid date
  }

  private validateCity(input: CreateSlamCommandInput): CreateSlamCommand {
    if (input.city == "" || input.city.length < 3) {
      this.append_error({
        field: "city",
        cue: "City lenght cannot be under 3 chars",
      });
    }
    return this;
  }

  private validateVenue(input: CreateSlamCommandInput): CreateSlamCommand {
    if (input.venue == "" || input.venue.length < 3) {
      this.append_error({
        field: "venue",
        cue: "Venue lenght cannot be under 3 chars",
      });
    }
    return this;
  }

  private validateRegionalId(input: CreateSlamCommandInput): CreateSlamCommand {
    if (input.regionalId == "" || input.regionalId.length < 3) {
      this.append_error({
        field: "regionalId",
        cue: "regionalId lenght cannot be under 3 chars",
      });
    }
    return this;
  }

  private validateCountryId(input: CreateSlamCommandInput): CreateSlamCommand {
    if (!COUNTRY_IDS.includes(input.countryId)) {
      this.append_error({
        field: "countryId",
        cue: `invalid countryId: ${input.countryId}`,
      });
    }
    return this;
  }
}
