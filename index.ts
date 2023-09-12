import express, { Express, Request, Response, NextFunction } from "express";

import { queryParamsCheck } from "./utils/middleware";
import { fetchStormglassAPIWithCache, fetchFormattedStormglassAPI } from "./utils/api";
import { generateCalendar } from "./utils/calendar";
import { extractWindIntervals } from "./utils/weather";

const PORT = process.env.PORT || 3000;

const MIN_CONSECUTIVE_HOURS = 3; // Make it dynamic?

const app: Express = express();

app.use(queryParamsCheck);

app.get("/", async (_req: Request, res: Response) => {
  res.json(await fetchFormattedStormglassAPI(res.locals.coords, res.locals.refresh));
});

app.get("/raw", async (_req: Request, res: Response) => {
  res.json(await fetchStormglassAPIWithCache(res.locals.coords, res.locals.refresh));
});

app.get("/cal", async (_req: Request, res: Response) => {
  const result = await fetchFormattedStormglassAPI(res.locals.coords, res.locals.refresh);
  const intervals = extractWindIntervals(
    result,
    { min: res.locals.minWindSpeed, max: res.locals.maxWindSpeed },
    MIN_CONSECUTIVE_HOURS
  );
  // res.json(intervals);
  const iCal = generateCalendar(intervals).toString();
  res.end(iCal);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
