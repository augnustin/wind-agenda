import { Request, Response, NextFunction } from "express";
import { isLatitude, isLongitude } from "./geo";
import type { QueryParams, ParsedQueryParams } from "./types";

const parseQueryParams = ({ lat, lng, refresh, min, strong, max }: QueryParams): ParsedQueryParams => {
  return {
    coords: {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    },
    forceRefresh: refresh !== undefined,
    preferences: {
      minWindSpeed: parseInt(min) || 15,
      strongWindSpeed: parseInt(strong) || 25,
      maxWindSpeed: parseInt(max) || 50,
    },
  };
};

export const queryParamsCheck = (req: Request, res: Response, next: NextFunction) => {
  const parsedQueryParams = parseQueryParams(req.query);
  if (!isLatitude(parsedQueryParams.coords.lat) && !isLongitude(parsedQueryParams.coords.lat)) {
    return res.status(400).send("lat & lng query parameters missing or malformed");
  }
  res.locals = parsedQueryParams;
  next();
};
