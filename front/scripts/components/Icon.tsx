import L from "leaflet";

const WindsurfIcon = new L.Icon({
  iconUrl: require("../../assets/img/windsurfing.png"),
  iconRetinaUrl: require("../../assets/img/windsurfing.png"),
  iconAnchor: [0, 75],
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(75, 75),
});

export { WindsurfIcon };
