import SunCalc from "suncalc";

import { CIRCLE_360, CARDINAL_POINTS, CARDINAL_SYMBOLS, HOUR, MIN_CONSECUTIVE_HOURS } from "./constants";
import type { Coords, CardinalPoint, CardinalSymbol, WeatherDatum } from "./types";

import { getMSInterval } from "./calendar";

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

export const directionToCardinalPoint = (direction: number): CardinalPoint => {
  const index =
    Math.round(((direction %= CIRCLE_360) < 0 ? direction + 360 : direction) / CIRCLE_360 / CARDINAL_POINTS.length) %
    CARDINAL_POINTS.length;
  return CARDINAL_POINTS[index];
};

export const directionToCardinalSymbol = (direction: number): CardinalSymbol => {
  const index =
    Math.round(
      ((direction %= CIRCLE_360) < 0 ? direction + CIRCLE_360 : direction) / CIRCLE_360 / CARDINAL_SYMBOLS.length
    ) % CARDINAL_SYMBOLS.length;
  return CARDINAL_SYMBOLS[index];
};

export const extractWindIntervals = (
  weatherData: WeatherDatum[],
  { lat, lng }: Coords,
  { min, max }: { min: number; max: number }
): WeatherDatum[][] => {
  return weatherData
    .filter(({ wind, time }) => {
      const { sunrise, sunset } = SunCalc.getTimes(time, lat, lng);

      return time > sunrise && time < sunset && wind >= min && wind <= max;
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
