import { useState, useEffect } from "react";
import Map from "./Map";
import Slider from "./Slider";
import HelpModal from "./HelpModal";

const HOST_NAME = window.location.origin;
const GRUISSAN_COORDS = [43.09, 3.12];
const DEFAULT_WIND_STRENGTHS = [15, 25, 50];

const App = () => {
  const [coords, setCoords] = useState(GRUISSAN_COORDS);
  const [min, setMin] = useState(DEFAULT_WIND_STRENGTHS[0]);
  const [strong, setStrong] = useState(DEFAULT_WIND_STRENGTHS[1]);
  const [max, setMax] = useState(DEFAULT_WIND_STRENGTHS[2]);
  const [isCopied, setIsCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const setValue = [setMin, setStrong, setMax];
  const [lat, lng] = coords;

  const url = `${HOST_NAME}/cal?lat=${lat}&lng=${lng}&min=${min}&strong=${strong}&max=${max}`;

  const onRangeChange = (newValue) => {
    newValue.forEach((v, i) => {
      setValue[i](v);
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText((document.getElementById("output") as HTMLInputElement).value);
    setIsCopied(true);
  };

  useEffect(() => {
    setIsCopied(false);
  }, [coords, min, strong, max]);

  return (
    <div>
      <p>
        <strong>1. Positionnez l'icône sur votre spot</strong>
      </p>
      <div className="my-4">
        <Map coords={coords} setCoords={setCoords} initialZoom={13} />
      </div>
      <p>
        <strong>2. Ajustez la fenêtre de vent qui vous intéresse (en nœuds)</strong>
      </p>
      <div className="my-5">
        <Slider value={[min, strong, max]} min={0} max={75} onChange={onRangeChange} />
      </div>
      <p>
        <strong>3. Copiez/collez le lien ci-dessous dans votre agenda</strong>
      </p>
      <div className="input-group">
        <input
          className="form-control form-control-lg"
          id="output"
          value={url}
          readOnly
          onClick={(event) => event.target.select()}
        ></input>
        <button className="input-group-text" title="Copier dans le presse-papier" onClick={copyToClipboard}>
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
      <div className="text-center my-5">
        <h6 className="mb-4">Bravo, c'est terminé !</h6>
        <button className="btn btn-link" onClick={(e) => setShowHelp(true)}>
          Heu ... Où est-ce que je colle ce lien ?
        </button>
      </div>
      <HelpModal open={showHelp} onClose={(e) => setShowHelp(false)} />
    </div>
  );
};

export default App;
