import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Box, Typography } from "@mui/material";
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  LocalTaxi as LocalTaxiIcon,
  Restaurant as RestaurantIcon,
  Nightlife as NightlifeIcon,
  ShoppingCart as ShoppingCartIcon,
  Attractions as AttractionsIcon,
  Business as BusinessIcon,
  LocalHospital as LocalHospitalIcon,
  School as SchoolIcon,
  SportsSoccer as SportsSoccerIcon,
  DirectionsCar as DirectionsCarIcon,
  Streetview as StreetviewIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import { searchLocation } from "../../services/hereService";

function LocationInput({ label, value, onChange }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions([]);
      return undefined;
    }

    const fetchOptions = async () => {
      setLoading(true);
      try {
        const results = await searchLocation(inputValue);
        if (active) {
          setOptions(results);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchOptions, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

const getIcon = (category) => {
  switch (category) {
    case 'airport':
      return <FlightIcon sx={{ color: "primary.main" }} />;
    case 'transport':
      return <LocalTaxiIcon sx={{ color: "primary.main" }} />;
    case 'hotel':
      return <HotelIcon sx={{ color: "secondary.main" }} />;
    case 'restaurant':
      return <RestaurantIcon sx={{ color: "error.main" }} />;
    case 'entertainment':
      return <NightlifeIcon sx={{ color: "purple.main" }} />;
    case 'shopping':
      return <ShoppingCartIcon sx={{ color: "success.main" }} />;
    case 'poi':
      return <AttractionsIcon sx={{ color: "info.main" }} />;
    case 'business':
      return <BusinessIcon sx={{ color: "warning.main" }} />;
    case 'health':
      return <LocalHospitalIcon sx={{ color: "error.main" }} />;
    case 'education':
      return <SchoolIcon sx={{ color: "info.main" }} />;
    case 'sports':
      return <SportsSoccerIcon sx={{ color: "success.main" }} />;
    case 'parking':
      return <DirectionsCarIcon sx={{ color: "grey.main" }} />;
    case 'street':
      return <StreetviewIcon sx={{ color: "text.primary" }} />;
    default:
      return <LocationOnIcon sx={{ color: "text.secondary" }} />;
  }
};

  const renderOption = (props, option) => {
    const { key, ...otherProps } = props;

    return (
      <Box
        key={key}
        {...otherProps}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          py: 1,
        }}
      >
        {getIcon(option.category)}
        <Box>
          <Typography variant="body2">{option.place_name}</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            {option.address?.label || ""}
          </Typography>
        </Box>
      </Box>
    );
  };

  const handleChange = (event, newValue) => {
    if (newValue && typeof newValue === 'object') {
      // Si el valor seleccionado es un objeto (una opción de la lista)
      const selectedValue = {
        ...newValue,
        // Usar la dirección completa como valor principal si está disponible
        place_name: newValue.address?.label || newValue.place_name,
        // Mantener la información original
        original_name: newValue.place_name
      };
      onChange(selectedValue);
    } else {
      // Si es una entrada manual o null
      onChange(newValue);
    }
  };

  return (
    <Autocomplete
      freeSolo
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      loading={loading}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        // Mostrar la dirección completa en el input si está disponible
        return option?.address?.label || option?.place_name || option?.text || "";
      }}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option.place_name === value.place_name || 
               option.address?.label === value.place_name;
      }}
      filterOptions={(x) => x} // Desactivar filtrado interno
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required
          fullWidth
          InputProps={{
            ...params.InputProps,
            autoComplete: 'off'
          }}
        />
      )}
      ListboxProps={{
        sx: {
          maxHeight: '50vh'
        }
      }}
      noOptionsText="No se encontraron resultados"
      loadingText="Buscando..."
    />
  );
}

export default LocationInput;
