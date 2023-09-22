import { useState, useRef, useMemo, useCallback } from "react";
import { Marker, Popup } from "react-leaflet";

const round = (v: number) => Math.round(v * 100) / 100;

export default function DraggableMarker({ setPosition, ...props }) {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition([round(lat), round(lng)]);
        }
      },
    }),
    []
  );
  return <Marker draggable={true} eventHandlers={eventHandlers} ref={markerRef} {...props}></Marker>;
}
