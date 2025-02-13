import { useState, useEffect } from "react";
import mapboxService from "../services/mapboxService";

export const useMapbox = (origin, destination) => {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRouteData = async () => {
      if (!origin || !destination) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Geocodificar direcciones si es necesario
        const originData =
          typeof origin === "string"
            ? await mapboxService.geocodeAddress(origin)
            : origin;

        const destinationData =
          typeof destination === "string"
            ? await mapboxService.geocodeAddress(destination)
            : destination;

        // Obtener datos de la ruta
        const route = await mapboxService.getRoute(originData, destinationData);

        setRouteData({
          origin: originData,
          destination: destinationData,
          route,
        });
      } catch (err) {
        console.error("Error loading route data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRouteData();
  }, [origin, destination]);

  return { routeData, loading, error };
};

export default useMapbox;
