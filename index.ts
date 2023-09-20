import express, { Express, Request, Response } from "express";
import cron from "node-cron";

import { queryParamsCheck } from "./utils/middleware";
import { fetchStormglassAPIWithCache, fetchFormattedStormglassAPI } from "./utils/api";
import { generateCalendar } from "./utils/calendar";
import { reset } from "./utils/cache";
import { extractWindIntervals } from "./utils/geo";

const PORT = process.env.PORT || 3000;

cron.schedule("0 0 * * *", async () => {
  console.info("Reseting cache files");
  const deletedFiles = await reset();
  if (deletedFiles.length) {
    console.info(`${deletedFiles} deleted`);
  }
});

const app: Express = express();

app.use(express.static("public"));

app.get("/json", queryParamsCheck, async (_req: Request, res: Response) => {
  res.json(await fetchFormattedStormglassAPI(res.locals.coords, res.locals.forceRefresh));
});

app.get("/raw", queryParamsCheck, async (_req: Request, res: Response) => {
  res.json(await fetchStormglassAPIWithCache(res.locals.coords, res.locals.forceRefresh));
});

app.get("/cal", queryParamsCheck, async (req: Request, res: Response) => {
  const weatherData = await fetchFormattedStormglassAPI(res.locals.coords, res.locals.forceRefresh);
  const weatherDataGroups = extractWindIntervals(weatherData, res.locals.coords, res.locals.preferences);
  const iCal = generateCalendar(weatherDataGroups, res.locals.coords, res.locals.preferences).toString();
  res.set({ "content-type": "text/calendar; charset=utf-8" }).end(iCal);
});

app.listen(PORT, () => {
  console.log(`Wind calendar listening on port ${PORT}`);
});
