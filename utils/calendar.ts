import ical from "ical-generator";
import { find as findTZ } from "geo-tz";
import type { Coords, WeatherDatum, UserPreferences } from "./types";
import { CARDINAL_SYMBOLS, STRENGTH_SYMBOLS } from "./constants";
import { directionToCardinalPoint, directionToCardinalSymbol } from "./geo";
import { min, max, avg, mode } from "./array";

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

const generateSymbols = (weatherDataGroup: WeatherDatum[], { strongWindSpeed, maxWindSpeed }): string[] => {
  const [GREEN, ...ABOVE] = STRENGTH_SYMBOLS;

  return weatherDataGroup.map(({ wind, direction }) => {
    const strongWindRatioIndex = Math.floor(
      (ABOVE.length * (wind - strongWindSpeed)) / (maxWindSpeed - strongWindSpeed)
    );
    const strengthSymbol = wind < strongWindSpeed ? GREEN : ABOVE[strongWindRatioIndex];
    const directionSymbol = directionToCardinalSymbol(direction);
    return `${strengthSymbol}${directionSymbol}`;
  });
};

export const generateCalendar = (
  weatherDataGroups: WeatherDatum[][],
  { lat, lng }: Coords,
  preferences: UserPreferences
) => {
  const cal = ical({ name: "Prévisions de vent", timezone: findTZ(lat, lng).at(0) });

  weatherDataGroups.forEach((weatherDataGroup) => {
    const start = weatherDataGroup.at(0).time;
    const end = addHour(weatherDataGroup.at(-1).time);
    const winds = weatherDataGroup.map(({ wind }) => wind);
    const directions = weatherDataGroup.map(({ direction }) => directionToCardinalPoint(direction));
    const minWind = min(winds);
    const maxWind = max(winds);
    const avgWind = avg(winds);
    const mostFrequentDirection = mode(directions);

    cal.createEvent({
      start,
      end,
      summary: avgWind >= preferences.strongWindSpeed ? "🌬️🌬️ Ça souffle fort !!" : "🌬️ Ça souffle !",
      description: `Entre ${minWind.toFixed(0)} et ${maxWind.toFixed(0)} nœuds établis, ${avgWind.toFixed(
        0
      )} nœuds direction ${mostFrequentDirection} en moyenne.
      \n\n
      Évolution : ${generateSymbols(weatherDataGroup, preferences).join("")}
      \n\n
      Détails: https://www.windy.com/${lat}/${lng}?arome,${getDate(start)},${lat},${lng},11`,
    });
  });

  return cal;
};
