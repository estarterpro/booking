import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../../context/ErrorContext";
import {
  Box,
  Grid,
  Button,
  Paper,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { CustomTimePicker } from "../common/TimerPicker";
import { es } from "date-fns/locale";
import { addDays } from "date-fns";
import { Search as SearchIcon } from "@mui/icons-material";
import LocationInput from "../common/LocationInput";
import PassengerInput from "../common/PassengerInput";
import { searchTransport } from "../../services/api";
import { validateRoute } from "../../config/appConfig";

function RouteSelectionForm({ onError }) {
  const navigate = useNavigate();
  const { showError } = useError();

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    origen: "",
    destino: "",
    fecha_ida: addDays(new Date(), 1),
    hora_ida: (() => {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(Math.ceil(now.getMinutes() / 10) * 10);
      if (now.getMinutes() === 60) {
        now.setMinutes(0);
        now.setHours(now.getHours() + 1);
      }
      return now;
    })(),
    fecha_regreso: null,
    hora_regreso: null,
    cant_personas: 1,
    tipo_servicio: "ida",
  });

  // Efecto para manejar cambios en el tipo de servicio
  useEffect(() => {
    if (formData.tipo_servicio === "ida_y_regreso") {
      setFormData((prev) => ({
        ...prev,
        fecha_regreso: addDays(new Date(), 2),
        hora_regreso: (() => {
          const now = new Date();
          now.setHours(now.getHours() + 1);
          now.setMinutes(Math.ceil(now.getMinutes() / 10) * 10);
          if (now.getMinutes() === 60) {
            now.setMinutes(0);
            now.setHours(now.getHours() + 1);
          }
          return now;
        })(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        fecha_regreso: null,
        hora_regreso: null,
      }));
    }
  }, [formData.tipo_servicio]);

  // Manejador de cambios genérico
  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value || "" }));
  };

  // Validación del formulario
  const validateForm = () => {
    if (!formData.origen || !formData.destino) {
      showError(
        "Por favor, selecciona un origen y destino válidos.",
        "warning"
      );
      return false;
    }

    const routeValidation = validateRoute(formData.origen, formData.destino);
    if (!routeValidation.valid) {
      showError(routeValidation.message, "warning");
      return false;
    }

    if (!formData.fecha_ida || !formData.hora_ida) {
      showError("Por favor, selecciona fecha y hora de ida.", "warning");
      return false;
    }

    if (
      formData.tipo_servicio === "ida_y_regreso" &&
      (!formData.fecha_regreso || !formData.hora_regreso)
    ) {
      showError("Por favor, selecciona fecha y hora de regreso.", "warning");
      return false;
    }

    return true;
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateForm()) {
        return;
      }

      const transformedData = {
        ...formData,
        origen: formData.origen?.place_name || formData.origen || "",
        destino: formData.destino?.place_name || formData.destino || "",
        fecha_ida: formData.fecha_ida
          ? formData.fecha_ida.toISOString().split("T")[0]
          : "",
        hora_ida: formData.hora_ida
          ? formData.hora_ida.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        fecha_regreso: formData.fecha_regreso
          ? formData.fecha_regreso.toISOString().split("T")[0]
          : "",
        hora_regreso: formData.hora_regreso
          ? formData.hora_regreso.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      };

      const response = await searchTransport(transformedData);

      if (!response.data || response.data.length === 0) {
        showError(
          "No se encontraron vehículos disponibles para tu búsqueda.",
          "info"
        );
        return;
      }

      navigate("/results", {
        state: {
          searchResults: response.data,
          formData: transformedData,
        },
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      if (onError) {
        onError(errorMessage);
      } else {
        showError(errorMessage || "Error al buscar transportes disponibles.");
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Paper elevation={2} sx={{ p: 1.5, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container rowSpacing={1.8} columnSpacing={0.3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={formData.tipo_servicio}
                  onChange={(e) =>
                    handleChange("tipo_servicio")(e.target.value)
                  }
                >
                  <FormControlLabel
                    value="ida"
                    control={<Radio />}
                    label="Solo ida"
                  />
                  <FormControlLabel
                    value="ida_y_regreso"
                    control={<Radio />}
                    label="Ida y regreso"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <LocationInput
                label="Origen"
                value={formData.origen}
                onChange={handleChange("origen")}
              />
            </Grid>
            <Grid item xs={12} md={2.8}>
              <LocationInput
                label="Destino"
                value={formData.destino}
                onChange={handleChange("destino")}
              />
            </Grid>

            <Grid item xs={6} md={1.65}>
              <DatePicker
                label="Fecha ida"
                value={formData.fecha_ida}
                onChange={handleChange("fecha_ida")}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} md={1.9}>
              <CustomTimePicker
                label="Hora ida"
                value={formData.hora_ida}
                onChange={handleChange("hora_ida")}
                required={true}
              />
            </Grid>

            <Grid item xs={6} md={1.35}>
              <PassengerInput
                value={formData.cant_personas}
                onChange={handleChange("cant_personas")}
              />
            </Grid>

            <Grid item xs={6} md={1.2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<SearchIcon />}
                sx={{ height: "56px" }}
              >
                Buscar
              </Button>
            </Grid>

            {formData.tipo_servicio === "ida_y_regreso" && (
              <>
                <Grid item xs={6} md={2} mdOffset={6}>
                  <DatePicker
                    label="Fecha regreso"
                    value={formData.fecha_regreso}
                    onChange={handleChange("fecha_regreso")}
                    disablePast
                    minDate={formData.fecha_ida}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={2}>
                  <CustomTimePicker
                    label="Hora regreso"
                    value={formData.hora_regreso}
                    onChange={handleChange("hora_regreso")}
                    required={true}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}

export default RouteSelectionForm;