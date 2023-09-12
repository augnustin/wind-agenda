import { read, write, lastModifiedAt } from "./cache";
import type { Coords } from "./geo";
import { meterPerSecondToKnots } from "./weather";
import { getMSInterval } from "./calendar";

type StormglassData = {};

type WeatherDatum = {
  time: Date;
  wind: number;
};

const { STORMGLASS_API_URL, STORMGLASS_API_KEY } = process.env;

const coordsToCacheFileName = (coords: Coords): string => `lat${coords.lat.toFixed(2)}lng${coords.lng.toFixed(2)}`;

const doFetchStormglassAPI = async (coords: Coords) => {
  const API_PARAMS = "windSpeed";

  try {
    const response = await fetch(`${STORMGLASS_API_URL}?lat=${coords.lat}&lng=${coords.lng}&params=${API_PARAMS}`, {
      headers: {
        Authorization: STORMGLASS_API_KEY,
      },
    });
    const result = await response.json();
    try {
      await write(coordsToCacheFileName(coords), result);
    } catch (err) {
      console.error("Could not save to cache");
      console.error(err);
      console.error("Continuing anyway");
    } finally {
      return result;
    }
  } catch (err) {
    console.error("Could not fetch Stormglass API");
    console.error(err);
  }
};

const formatStormglassAPI = (result): WeatherDatum[] => {
  console.log(result);
  return result.hours.map(({ time, windSpeed: { sg } }) => ({
    time: new Date(time),
    wind: meterPerSecondToKnots(sg),
  }));
};

export const fetchStormglassAPIWithCache = async (coords: Coords, forceRefresh = false) => {
  const lastModified = await lastModifiedAt(coordsToCacheFileName(coords));
  if (forceRefresh || !lastModified || getMSInterval(lastModified) > 3600 * 1000 * 24) {
    return await doFetchStormglassAPI(coords);
  }
  return await read(coordsToCacheFileName(coords));
};

export const fetchFormattedStormglassAPI = async (coords: Coords, forceRefresh: boolean) => {
  return formatStormglassAPI(await fetchStormglassAPIWithCache(coords, forceRefresh));
};
