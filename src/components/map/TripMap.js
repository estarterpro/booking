import React, { useEffect, useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import { Box, CircularProgress } from "@mui/material";
import { MAPBOX_ACCESS_TOKEN } from "../../config/constants";
import MapMarker from "./MapMaker";
import RouteLayer from "./RouteLayer";
import hereService from "../../services/hereService";
import "mapbox-gl/dist/mapbox-gl.css";

const TripMap = ({ origin, destination }) => {
  const [viewState, setViewState] = useState({
    longitude: -74.0721,
    latitude: 4.711,
    zoom: 11,
  });
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMapData = async () => {
      if (!origin || !destination) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Obtener coordenadas
        const originCoords = await hereService.geocodeAddress(origin);
        const destCoords = await hereService.geocodeAddress(destination);

        setOriginCoords(originCoords);
        setDestinationCoords(destCoords);

        // Obtener ruta
        const routeData = await hereService.getRoute(
          originCoords,
          destCoords
        );
        setRouteGeometry(routeData.geometry);

        // Calcular el centro y zoom
        const coordinates = routeData.geometry.coordinates;
        const bounds = coordinates.reduce(
          (bounds, coord) => ({
            minLng: Math.min(bounds.minLng, coord[0]),
            maxLng: Math.max(bounds.maxLng, coord[0]),
            minLat: Math.min(bounds.minLat, coord[1]),
            maxLat: Math.max(bounds.maxLat, coord[1]),
          }),
          {
            minLng: coordinates[0][0],
            maxLng: coordinates[0][0],
            minLat: coordinates[0][1],
            maxLat: coordinates[0][1],
          }
        );

        setViewState({
          longitude: (bounds.minLng + bounds.maxLng) / 2,
          latitude: (bounds.minLat + bounds.maxLat) / 2,
          zoom: 10,
          padding: 40,
        });
      } catch (error) {
        console.error("Error loading map data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, [origin, destination]);

  if (loading) {
    return (
      <Box
        sx={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
          borderRadius: 1,
          color: "error.main",
        }}
      >
        Error: {error}
      </Box>
    );
  }

  return (
    <Box sx={{ height: 400, borderRadius: 1, overflow: "hidden" }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        <NavigationControl position="top-right" />

        {originCoords && (
          <MapMarker coordinates={[originCoords.lng, originCoords.lat]} color="#1976d2" />
        )}

        {destinationCoords && (
          <MapMarker coordinates={[destinationCoords.lng, destinationCoords.lat]} color="#dc004e" />
        )}

        {routeGeometry && <RouteLayer routeGeometry={routeGeometry} />}
      </Map>
    </Box>
  );
};
export default TripMap;
