import type { Coords, StormglassData, WeatherDatum } from "./types";
import { DAY } from "./constants";
import { read, write, lastModifiedAt } from "./cache";
import { meterPerSecondToKnots } from "./geo";
import { getMSInterval } from "./calendar";

const { STORMGLASS_API_URL, STORMGLASS_API_KEY } = process.env;

const coordsToCacheFileName = (coords: Coords): string =>
  `lat${(coords.lat * 100).toFixed(0)}lng${(coords.lng * 100).toFixed(0)}`;

const doFetchStormglassAPI = async (coords: Coords): Promise<StormglassData> => {
  const API_PARAMS = ["windSpeed", "windDirection", "gust"];

  try {
    const response = await fetch(
      `${STORMGLASS_API_URL}?lat=${coords.lat}&lng=${coords.lng}&params=${API_PARAMS.join(",")}`,
      {
        headers: {
          Authorization: STORMGLASS_API_KEY,
        },
      }
    );
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

const formatStormglassAPI = (result: StormglassData): WeatherDatum[] => {
  return result.hours.map(({ time, windSpeed: { sg: msWindSpeed }, windDirection: { sg: direction } }) => ({
    time: new Date(time),
    wind: meterPerSecondToKnots(msWindSpeed),
    direction,
  }));
};

export const fetchStormglassAPIWithCache = async (coords: Coords, forceRefresh = false): Promise<StormglassData> => {
  const lastModified = await lastModifiedAt(coordsToCacheFileName(coords));
  if (forceRefresh || !lastModified || getMSInterval(lastModified) > DAY) {
    console.info(new Date(), "New API call");
    return await doFetchStormglassAPI(coords);
  }
  console.info(new Date(), "Using cache");
  return (await read(coordsToCacheFileName(coords))) as StormglassData;
};

export const fetchFormattedStormglassAPI = async (coords: Coords, forceRefresh: boolean): Promise<WeatherDatum[]> => {
  return formatStormglassAPI(await fetchStormglassAPIWithCache(coords, forceRefresh));
};
