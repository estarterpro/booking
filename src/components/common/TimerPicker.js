import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
  OutlinedInput,
} from "@mui/material";

export const CustomTimePicker = ({ label, value, onChange, required }) => {
  const getInitialTime = () => {
    if (!value) return { hour: "00", minute: "00" };
    if (value instanceof Date) {
      return {
        hour: value.getHours().toString().padStart(2, "0"),
        minute: value.getMinutes().toString().padStart(2, "0"),
      };
    }
    const [hour, minute] = value.split(":");
    return { hour: hour || "00", minute: minute || "00" };
  };

  const { hour, minute } = getInitialTime();

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const minutes = Array.from({ length: 6 }, (_, i) =>
    (i * 10).toString().padStart(2, "0")
  );

  const handleChange = (type) => (event) => {
    const newHour = type === "hour" ? event.target.value : hour;
    const newMinute = type === "minute" ? event.target.value : minute;

    const date = new Date();
    date.setHours(parseInt(newHour, 10));
    date.setMinutes(parseInt(newMinute, 10));

    onChange(date);
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      sx={{
        padding: 1.5,
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "12px",
        display: "flex",
        gap: 1,
        position: "relative",
      }}
    >
      {/* Etiqueta con ícono */}
      <Typography
        variant="caption"
        sx={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: -12,
          left: 8,
          backgroundColor: "white",
          padding: "0 4px",
          color: "text.secondary",
        }}
      >
        {label} {required && "*"}
      </Typography>

      {/* Contenido principal */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          marginLeft: -1.2,
          marginRight: -1.2,
          marginBottom: -1.2,
        }}
      >
        <FormControl
          size="small"
          sx={{
            flex: 1,
            marginLeft: 0,
            marginRight: -0.2,
          }}
        >
          <InputLabel>Hora</InputLabel>
          <Select
            value={hour}
            onChange={handleChange("hour")}
            input={<OutlinedInput label="Hora" />}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            {hours.map((h) => (
              <MenuItem key={h} value={h}>
                {h}h
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            marginLeft: -0.8,
            marginRight: -0.8,
          }}
        >
          :
        </Typography>

        <FormControl
          size="small"
          sx={{ flex: 1, marginLeft: -0.2, marginRight: 0 }}
        >
          <InputLabel>Min</InputLabel>
          <Select
            value={minute}
            onChange={handleChange("minute")}
            input={<OutlinedInput label="Min" />}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            {minutes.map((m) => (
              <MenuItem key={m} value={m}>
                {m}m
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </FormControl>
  );
};
