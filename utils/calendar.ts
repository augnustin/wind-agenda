import ical from "ical-generator";
import type { WeatherDatum } from "./api";
import type { Coords } from "./geo";

const STRONG_WIND_SPEED = 25;

const addHour = (date: Date): Date => {
  const result = date;
  result.setHours(result.getHours() + 1);
  return result;
};

const getDate = (date: Date): String => `${date.getFullYear()}${date.getMonth()}${date.getDay()}12`;

export const getMSInterval = (date1: Date, date2: Date = new Date()) => {
  return date2.getTime() - date1.getTime();
};

export const generateCalendar = (weatherDataGroups: WeatherDatum[][], { lat, lng }: Coords) => {
  const cal = ical({ name: "Prévisions de vent" });

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
      summary: avgWind > STRONG_WIND_SPEED ? "🌬️🌬️ Ça souffle fort !!" : "🌬️ Ça souffle !",
      description: `Entre ${minWind.toFixed(0)} et ${maxWind.toFixed(0)} noeuds établis, ${avgWind.toFixed(
        0
      )} noeuds en moyenne.`,
      url: `https://www.windy.com/${lat}/${lng}?icon,${getDate(start)},${lat},${lng},12`,
    });
  });

  return cal;
};
