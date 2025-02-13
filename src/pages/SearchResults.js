import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";
import { useError } from "../context/ErrorContext";
import RouteSelectionForm from "../components/forms/RouteSelectionForm";
import VehicleList from "../components/search/VehicleList";
import TripDetails from "../components/search/TripDetails";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showError } = useError();
  const { searchResults, formData } = location.state || {};

  React.useEffect(() => {
    if (!searchResults || !formData) {
      showError(
        "No hay información de búsqueda disponible. Por favor, realiza una nueva búsqueda.",
        "warning"
      );
      navigate("/");
    }
  }, [searchResults, formData, navigate, showError]);

  const handleVehicleSelect = (vehicle) => {
    try {
      navigate("/confirmation", {
        state: {
          vehicle,
          formData,
          searchResults,
        },
      });
    } catch (error) {
      showError(
        "Error al seleccionar el vehículo. Por favor, intenta nuevamente."
      );
    }
  };

  if (!searchResults?.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          No se encontraron vehículos disponibles para tu búsqueda. Por favor,
          modifica los criterios de búsqueda.
        </Typography>
        <RouteSelectionForm />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <RouteSelectionForm />

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <VehicleList
            vehicles={searchResults}
            onVehicleSelect={handleVehicleSelect}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <TripDetails formData={formData} searchResults={searchResults} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SearchResults;
