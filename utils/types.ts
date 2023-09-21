import { CARDINAL_SYMBOLS } from "./constants";

export type Coords = {
  lat: number;
  lng: number;
};

export interface UserPreferences {
  minWindSpeed: number;
  strongWindSpeed: number;
  maxWindSpeed: number;
}

export type QueryParams = {
  [P in keyof Coords]: string;
} & {
  refresh?: string;
  min?: string;
  max?: string;
  strong?: string;
};

export type ParsedQueryParams = {
  coords: Coords;
  preferences: UserPreferences;
  forceRefresh: boolean;
};

export type StormglassData = {
  hours: [
    {
      time: string;
      windDirection: {
        sg: number;
        icon?: number;
        noaa?: number;
      };
      windSpeed: {
        sg: number;
        icon?: number;
        noaa?: number;
      };
    }
  ];
};

export type WeatherDatum = {
  time: Date;
  wind: number;
  direction: number;
};

export type CardinalSymbol = (typeof CARDINAL_SYMBOLS)[number];
