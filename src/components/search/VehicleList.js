import React from "react";
import { Grid } from "@mui/material";
import VehicleCard from "./VehicleCard";

function VehicleList({ vehicles, onVehicleSelect }) {
  return (
    <Grid container spacing={3}>
      {vehicles.map((vehicle) => (
        <Grid item xs={12} md={6} key={vehicle.vehiculo_id}>
          <VehicleCard
            vehicle={vehicle}
            onSelect={() => onVehicleSelect(vehicle)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default VehicleList;
