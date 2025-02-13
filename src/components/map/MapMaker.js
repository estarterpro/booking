import React from "react";
import { Marker } from "react-map-gl";
import { LocationOn } from "@mui/icons-material";

const MapMarker = ({ coordinates, color = "#1976d2" }) => {
  if (!coordinates || !Array.isArray(coordinates)) {
    return null;
  }

  return (
    <Marker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      anchor="bottom"
    >
      <LocationOn style={{ color, fontSize: 30 }} />
    </Marker>
  );
};

export default MapMarker;
