import React from "react";
import { Layer, Source } from "react-map-gl";

const RouteLayer = ({ routeGeometry }) => {
  if (!routeGeometry) return null;

  return (
    <Source
      id="route"
      type="geojson"
      data={{
        type: "Feature",
        properties: {},
        geometry: routeGeometry,
      }}
    >
      <Layer
        id="route"
        type="line"
        paint={{
          "line-color": "#1976d2",
          "line-width": 4,
          "line-opacity": 0.75,
        }}
      />
    </Source>
  );
};

export default RouteLayer;
