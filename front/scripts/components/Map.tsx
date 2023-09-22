import { MapContainer, TileLayer, Marker } from "react-leaflet";

import DraggableMarker from "./DraggableMarker";
import { WindsurfIcon } from "./Icon";

import "leaflet/dist/leaflet.css";

export default ({ coords, initialZoom, setCoords }) => (
  <div id="map">
    <MapContainer
      center={coords}
      zoom={initialZoom}
      options={
        {
          // Options
          // preferCanvas: false,
          // Control Options
          // attributionControl: true,
          // zoomControl: true,
          // Interaction Options
          // closePopupOnClick: true,
          // zoomSnap: 1,
          // zoomDelta: 1,
          // trackResize: true,
          // boxZoom: true,
          // doubleClickZoom: true,
          // dragging: true,
          // Map State Options
          // crs:
          // center: [51.505, -0.09],
          // zoom: 13,
          // minZoom: // Number
          // maxZoom: // Number
          // layers: [],
          // maxBounds: null,
          // rendered:
          // Animation Options
          // zoomAnimation: true,
          // zoomAnimationThreshold: 4,
          // fadeAnimation: true,
          // markerZoomAnimation: true,
          // transform3DLimit:
          // Panning Inertia Options
          // inertia:
          // inertiaDeceleration:
          // inertiaMaxSpeed:
          // easeLinearity:
          // worldCopyJump:
          // maxBoundsViscosity:
          // Keyboard Navigation Options
          // keyboard:
          // keyboardPanDelta:
          // Mouse wheel options
          // scrollWheelZoom:
          // wheelDebounceTime:
          // wheelPxPerZoomLevel:
          // Touch interaction options
          // tapHold:
          // tapTolerance:
          // touchZoom:
          // bounceAtZoomLimits:
        }
      }
    >
      <TileLayer
        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        options={{
          // to use open street maps
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
          // tileSize: 512,
          zoomOffset: -1,
          // crossOrigin: false,
        }}
      />
      <DraggableMarker
        position={coords}
        setPosition={setCoords}
        icon={WindsurfIcon}
        title="Glissez-déposez le personnage sur votre spot"
      />
    </MapContainer>
  </div>
);
