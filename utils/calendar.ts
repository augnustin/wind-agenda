import ical from "ical-generator";
import type { WeatherDatum } from "./api";
import type { Coords } from "./geo";
import { find } from "geo-tz";

const addHour = (date: Date): Date => {
  const result = date;
  result.setHours(result.getHours() + 1);
  return result;
};

const zeroPad = (num: number, places: number): string => String(num).padStart(places, "0");

const getDate = (date: Date): String =>
  `${date.getFullYear()}${zeroPad(date.getMonth() + 1, 2)}${zeroPad(date.getDate(), 2)}`;

export const getMSInterval = (date1: Date, date2: Date = new Date()) => {
  return date2.getTime() - date1.getTime();
};

export const generateCalendar = (
  weatherDataGroups: WeatherDatum[][],
  { lat, lng }: Coords,
  strongWindSpeed: number
) => {
  const cal = ical({ name: "Prévisions de vent", timezone: find(lat, lng).at(0) });

  weatherDataGroups.forEach((weatherDataGroup) => {
    const start = weatherDataGroup.at(0).time;
    const end = addHour(weatherDataGroup.at(-1).time);
    const winds = weatherDataGroup.map(({ wind }) => wind);
    const maxWind = Math.max(...winds);
    const minWind = Math.min(...winds);
    const avgWind = winds.reduce((total, b, _i, arr) => total + b / arr.length, 0);

    cal.createEvent({
      start,
      end,
      summary: avgWind >= strongWindSpeed ? "🌬️🌬️ Ça souffle fort !!" : "🌬️ Ça souffle !",
      description: `Entre ${minWind.toFixed(0)} et ${maxWind.toFixed(0)} nœuds établis, ${avgWind.toFixed(
        0
      )} nœuds en moyenne.\n\nDétails: https://www.windy.com/${lat}/${lng}?arome,${getDate(start)},${lat},${lng},11`,
    });
  });

  return cal;
};
