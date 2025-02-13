import React from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from '@mui/material';

function TripTypeSelect({ value, onChange }) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Tipo de viaje</FormLabel>
      <RadioGroup
        row
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  );
}

export default TripTypeSelect;