import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import RouteSelectionForm from "../components/forms/RouteSelectionForm";
import { useError } from "../context/ErrorContext";

function RouteSelection() {
  const { showError } = useError();

  const handleFormError = (error) => {
    if (error.includes("coordenadas")) {
      showError(
        "No se pudo calcular la distancia del trayecto. Por favor, verifica los puntos de origen y destino.",
        "warning"
      ); 
    } else if (error.includes("ubicación")) {
      showError(
        "En este momento no estamos disponibles en la ubicación seleccionada. Por favor, intenta con otra ubicación.",
        "warning"
      );
    } else {
      showError(
        "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente."
      );
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Reserva tu transporte
      </Typography>
      <Card>
        <CardContent>
          <RouteSelectionForm onError={handleFormError} />
        </CardContent>
      </Card>
    </>
  );
}

export default RouteSelection;
