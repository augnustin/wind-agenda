export type Coords = {
  lat: number;
  lng: number;
};

export const isLatitude = (lat: number): boolean => {
  return isFinite(lat) && Math.abs(lat) <= 90;
};

export const isLongitude = (lng: number): boolean => {
  return isFinite(lng) && Math.abs(lng) <= 180;
};

export const roundCoords = ({ lat, lng }: Coords): Coords => {
  return {
    lat: Math.round(lat * 100) / 100,
    lng: Math.round(lng * 100) / 100,
  };
};
