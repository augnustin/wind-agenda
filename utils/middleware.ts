import { Request, Response, NextFunction } from "express";
import { roundCoords, isLatitude, isLongitude } from "./geo";
import type { Coords } from "./geo";

type QueryParams = { coords: Coords; refresh?: boolean; minWindSpeed?: number; maxWindSpeed?: number };

const parseQueryParams = (queryParams): QueryParams => {
  return {
    coords: {
      lat: parseFloat(queryParams.lat),
      lng: parseFloat(queryParams.lng),
    },
    refresh: queryParams !== undefined,
    minWindSpeed: parseInt(queryParams.minWindSpeed) || 15,
    maxWindSpeed: parseInt(queryParams.maxWindSpeed) || 50,
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
