import express, { Express, Request, Response } from "express";
import cron from "node-cron";

import { queryParamsCheck } from "./utils/middleware";
import { fetchStormglassAPIWithCache, fetchFormattedStormglassAPI } from "./utils/api";
import { generateCalendar } from "./utils/calendar";
import { extractWindIntervals } from "./utils/weather";
import { reset } from "./utils/cache";

const PORT = process.env.PORT || 3000;

const MIN_CONSECUTIVE_HOURS = 4; // Make it dynamic?

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
  res.json(await fetchFormattedStormglassAPI(res.locals.coords, res.locals.refresh));
});

app.get("/raw", queryParamsCheck, async (_req: Request, res: Response) => {
  res.json(await fetchStormglassAPIWithCache(res.locals.coords, res.locals.refresh));
});

app.get("/cal", queryParamsCheck, async (_req: Request, res: Response) => {
  const result = await fetchFormattedStormglassAPI(res.locals.coords, res.locals.refresh);
  const intervals = extractWindIntervals(
    result,
    res.locals.coords,
    { min: res.locals.minWindSpeed, max: res.locals.maxWindSpeed },
    MIN_CONSECUTIVE_HOURS
  );
  const iCal = generateCalendar(intervals, res.locals.coords).toString();
  res.set({ "content-type": "text/calendar; charset=utf-8" }).end(iCal);
});

app.listen(PORT, () => {
  console.log(`Wind calendar listening on port ${PORT}`);
});
