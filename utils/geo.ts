import SunCalc from "suncalc";

import { CIRCLE_360, CARDINAL_SYMBOLS, HOUR, MIN_CONSECUTIVE_HOURS } from "./constants";
import type { Coords, CardinalSymbol, UserPreferences, WeatherDatum } from "./types";

import { getMSInterval, isBefore, isAfter } from "./calendar";
import { circularIndex } from "./array";

export const meterPerSecondToKnots = (msSpeed: number): number => msSpeed * 1.9438445; // TODO?: find a better formula

export const isLatitude = (lat: number): boolean => {
  return isFinite(lat) && Math.abs(lat) <= CIRCLE_360 / 4;
};

export const isLongitude = (lng: number): boolean => {
  return isFinite(lng) && Math.abs(lng) <= CIRCLE_360 / 2;
};

export const roundCoords = ({ lat, lng }: Coords): Coords => {
  return {
    lat: Math.round(lat * 100) / 100,
    lng: Math.round(lng * 100) / 100,
  };
};

export const directionToCardinalSymbol = (direction: number): CardinalSymbol =>
  circularIndex(CARDINAL_SYMBOLS, CIRCLE_360, direction);

export const extractWindIntervals = (
  weatherData: WeatherDatum[],
  { lat, lng }: Coords,
  { minWindSpeed, maxWindSpeed }: UserPreferences
): WeatherDatum[][] => {
  return weatherData
    .filter(({ wind, time }) => {
      const { sunrise, sunset } = SunCalc.getTimes(time, lat, lng);
      return isAfter(time, sunrise) && isBefore(time, sunset) && wind >= minWindSpeed && wind <= maxWindSpeed;
    })
    .reduce((result, hour) => {
      const previousGroups = result.slice(0, -1);
      const lastGroup = result.at(-1) || [];
      const lastHour = lastGroup.at(-1);
      if (lastHour && getMSInterval(lastHour.time, hour.time) > HOUR) {
        return [...result, [hour]];
      } else {
        return [...previousGroups, [...lastGroup, hour]];
      }
    }, [])
    .filter((v: []) => v.length >= MIN_CONSECUTIVE_HOURS);
};
