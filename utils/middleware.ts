import { Request, Response, NextFunction } from "express";
import { isLatitude, isLongitude } from "./geo";
import type { Coords } from "./geo";

type QueryParams = {
  coords: Coords;
  refresh?: boolean;
  minWindSpeed?: number;
  strongWindSpeed?: number;
  maxWindSpeed?: number;
};

const parseQueryParams = ({ lat, lng, refresh, minWindSpeed, strongWindSpeed, maxWindSpeed }): QueryParams => {
  return {
    coords: {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    },
    refresh: refresh !== undefined,
    minWindSpeed: parseInt(minWindSpeed) || 15,
    strongWindSpeed: parseInt(strongWindSpeed) || 25,
    maxWindSpeed: parseInt(maxWindSpeed) || 50,
  };
};

export const queryParamsCheck = (req: Request, res: Response, next: NextFunction) => {
  const parsedQueryParams = parseQueryParams(req.query);
  if (!isLatitude(parsedQueryParams.coords.lat) && !isLongitude(parsedQueryParams.coords.lat)) {
    return res.status(400).send("lat & lng query parameters missing or malformed");
  }
  res.locals = {
    ...res.locals,
    ...parsedQueryParams,
  };
  next();
};
