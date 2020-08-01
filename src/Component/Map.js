import React from "react";
import { showDataOnMap } from "../Utils/util";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "../CSS/Map.css";
function Map({ countries, casesType, center, zoom }) {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href=" https://github.com/geekcodershivam/">Shivam Mani Tripathi</a> '
        />
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;