import { COUNTRY_IDS, CountryId } from "@psm/common/constants/countries";
import { Command } from "@psm/core/Command/Command";

export interface EditSlamCommandInput {
  regionalId?: string;
  countryId?: CountryId;
  city?: string;
  venue?: string;
  name?: string;
  day?: number; // validate if is a correct day max 31 min 1
  year?: number; // validate is not in the past
  monthIndex?: number; // 0-jan >> 11-dec
}

export class EditSlamCommand extends Command<
  EditSlamCommandInput,
  "EditSlamCommand"
> {
  validate(input: EditSlamCommandInput): void | Promise<void> {
    this.validateDate(input)
      .validateName(input)
      .validateCity(input)
      .validateVenue(input)
      .validateRegionalId(input)
      .validateCountryId(input);
  }

  private validateDate(input: EditSlamCommandInput): EditSlamCommand {
    const { year, monthIndex, day } = input;
    if (!year || !monthIndex || !day) {
      return this;
    }
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

  private validateName(input: EditSlamCommandInput): EditSlamCommand {
    if (!input.name) {
      return this;
    }
    if (input.name == "" || input.name.length < 3) {
      this.append_error({
        field: "name",
        cue: "Slam name lenght cannot be under 3 chars",
      });
    }
    return this;
  }

  private validateCity(input: EditSlamCommandInput): EditSlamCommand {
    if (!input.city) {
      return this;
    }
    if (input.city == "" || input.city.length < 3) {
      this.append_error({
        field: "city",
        cue: "City lenght cannot be under 3 chars",
      });
    }
    return this;
  }

  private validateVenue(input: EditSlamCommandInput): EditSlamCommand {
    if (!input.venue) {
      return this;
    }
    if (input.venue == "" || input.venue.length < 3) {
      this.append_error({
        field: "venue",
        cue: "Venue lenght cannot be under 3 chars",
      });
    }
    return this;
  }

  private validateRegionalId(input: EditSlamCommandInput): EditSlamCommand {
    if (!input.regionalId) {
      return this;
    }
    if (input.regionalId == "" || input.regionalId.length < 3) {
      this.append_error({
        field: "regionalId",
        cue: "regionalId lenght cannot be under 3 chars",
      });
    }
    return this;
  }

  private validateCountryId(input: EditSlamCommandInput): EditSlamCommand {
    if (!input.countryId) {
      return this;
    }
    if (!COUNTRY_IDS.includes(input.countryId)) {
      this.append_error({
        field: "countryId",
        cue: `invalid countryId: ${input.countryId}`,
      });
    }
    return this;
  }
}
