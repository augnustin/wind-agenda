const loadMap = () => {
  const defaultCoords = [43.11, 3.132];
  const map = L.map("map").setView(defaultCoords, 13);

  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery ©     <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18,
  }).addTo(map);

  const marker = new L.marker(defaultCoords, { draggable: "true" });
  marker.on("dragend", function (event) {
    var marker = event.target;
    var position = marker.getLatLng();
    marker.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: "true" });
    map.panTo(new L.LatLng(position.lat, position.lng));
  });
  map.addLayer(marker);

  map.on("click", (e) => {
    marker.setLatLng(e.latlng, { draggable: "true" });
  });
};

window.addEventListener("DOMContentLoaded", (event) => {
  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      offset: 74,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(document.querySelectorAll("#navbarResponsive .nav-link"));
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  loadMap();
});
