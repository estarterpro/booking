import React from 'react';
import {TextField, IconButton, InputAdornment, Box, Stack} from '@mui/material';
import { Person as PersonIcon,  Add as AddIcon,  Remove as RemoveIcon} from '@mui/icons-material';
import { MIN_PASSENGERS, MAX_PASSENGERS } from '../../config/constants';

function PassengerInput({ value, onChange }) {
  const adjustPassengers = (increment) => {
    const newValue = value + increment;
    if (newValue >= MIN_PASSENGERS && newValue <= MAX_PASSENGERS) {
      onChange(newValue);
    }
  };

  const handleInputChange = (event) => {
    let newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && newValue >= MIN_PASSENGERS && newValue <= MAX_PASSENGERS) {
      onChange(newValue);
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Pasajeros"
        value={value}
        onChange={handleInputChange} 
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Stack direction="column" spacing={-0.5} alignItems="center">

                <IconButton 
                  size="small" 
                  onClick={() => adjustPassengers(1)}
                  disabled={value >= MAX_PASSENGERS}
                >
                  <AddIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => adjustPassengers(-1)}
                  disabled={value <= MIN_PASSENGERS}
                >
                  <RemoveIcon />
                </IconButton>
              </Stack>
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
}

export default PassengerInput;
