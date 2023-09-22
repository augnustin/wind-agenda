import { useState } from "react";
import Map from "./Map";
import MultiRange from "./MultiRange/MultiRange";

const HOST_NAME = "https://wind-calendar.augustin-riedinger.fr";
const GRUISSAN_COORDS = [43.09, 3.12];
const DEFAULT_WIND_STRENGTHS = [15, 25, 50];

const App = () => {
  const [coords, setCoords] = useState(GRUISSAN_COORDS);
  const [min, setMin] = useState(DEFAULT_WIND_STRENGTHS[0]);
  const [strong, setStrong] = useState(DEFAULT_WIND_STRENGTHS[1]);
  const [max, setMax] = useState(DEFAULT_WIND_STRENGTHS[2]);
  const [lat, lng] = coords;

  const url = `${HOST_NAME}/cal?lat=${lat}&lng=${lng}&min=${min}&strong=${strong}&max=${max}`;

  const onRangeChange = ({ min, max }) => {
    setMin(min);
    setMax(max);
  };

  return (
    <div>
      <p>
        <strong>1. Place your spot on the map</strong>
      </p>
      <div className="my-4">
        <Map coords={coords} setCoords={setCoords} initialZoom={13} />
      </div>
      <div className="my-5">
        <MultiRange min={min} max={max} onChange={(e) => onRangeChange(e)} />
      </div>
      <input className="form-control form-control-lg" value={url} readOnly></input>
    </div>
  );
};

export default App;
