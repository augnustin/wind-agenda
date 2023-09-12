import { getMSInterval } from "./calendar";

export const meterPerSecondToKnots = (msSpeed: number): number => msSpeed * 1.9438445; // TODO: find a better formula

export const extractWindIntervals = (weatherData, { min, max }, minIntervalLength) => {
  return weatherData
    .filter(({ wind }) => wind >= min && wind <= max)
    .reduce((result, hour) => {
      const previousGroups = result.slice(0, -1);
      const lastGroup = result.at(-1) || [];
      const lastHour = lastGroup.at(-1);
      if (lastHour && getMSInterval(lastHour.time, hour.time) > 3600 * 1000) {
        return [...result, [hour]];
      } else {
        return [...previousGroups, [...lastGroup, hour]];
      }
    }, [])
    .filter((v: []) => v.length >= minIntervalLength);
};
