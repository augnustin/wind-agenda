import { useState, useEffect } from "react";
import Map from "./Map";
import Slider from "./Slider";

const HOST_NAME = window.location.origin;
const GRUISSAN_COORDS = [43.09, 3.12];
const DEFAULT_WIND_STRENGTHS = [15, 25, 50];

const App = () => {
  const [coords, setCoords] = useState(GRUISSAN_COORDS);
  const [min, setMin] = useState(DEFAULT_WIND_STRENGTHS[0]);
  const [strong, setStrong] = useState(DEFAULT_WIND_STRENGTHS[1]);
  const [max, setMax] = useState(DEFAULT_WIND_STRENGTHS[2]);
  const [isCopied, setIsCopied] = useState(false);
  const setValue = [setMin, setStrong, setMax];
  const [lat, lng] = coords;

  const url = `${HOST_NAME}/cal?lat=${lat}&lng=${lng}&min=${min}&strong=${strong}&max=${max}`;

  const onRangeChange = (newValue) => {
    newValue.forEach((v, i) => {
      setValue[i](v);
    });
  };

  useEffect(() => {
    setIsCopied(false);
  }, [coords, min, strong, max]);

  return (
    <div>
      <p>
        <strong>1. Positionne l'icône sur ton spot</strong>
      </p>
      <div className="my-4">
        <Map coords={coords} setCoords={setCoords} initialZoom={13} />
      </div>
      <p>
        <strong>2. Ajuste la fenêtre de vent qui t'intéresse (en nœuds)</strong>
      </p>
      <div className="my-5">
        <Slider value={[min, strong, max]} min={0} max={75} onChange={onRangeChange} />
      </div>
      <p>
        <strong>3. Copie/colle le lien ci-dessous dans ton agenda</strong>
      </p>
      <div className="input-group">
        <input
          className="form-control form-control-lg"
          id="output"
          value={url}
          readOnly
          onClick={(event) => event.target.select()}
        ></input>
        <button
          className="input-group-text"
          title="Copier dans le presse-papier"
          onClick={() => {
            navigator.clipboard.writeText(document.getElementById("output").value);
            setIsCopied(true);
          }}
        >
          {isCopied ? (
            <span>
              <i className="bi-check"></i>
              &nbsp;Copié
            </span>
          ) : (
            <span>
              <i className="bi-clipboard"></i>
              &nbsp;Copier
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default App;
