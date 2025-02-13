import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import {
  AirlineSeatReclineNormal,
  Luggage,
  AttachMoney,
} from "@mui/icons-material";
import { formatCurrency } from "../../utils/formatUtils";

function VehicleCard({ vehicle, onSelect }) {
  const {
    tipo,
    cant_maxima_personas,
    cant_maxima_maletas,
    image_url,
    tarifa_total,
  } = vehicle;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {tipo}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AirlineSeatReclineNormal />
            <Typography>{cant_maxima_personas} pasajeros</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Luggage />
            <Typography>{cant_maxima_maletas} maletas</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        {image_url && (
          <CardMedia
            component="img"
            height=""
            image={image_url}
            alt={tipo}
            sx={{ objectFit: "cover" }}
          />
        )}
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AttachMoney />
          <Typography variant="h4" color="primary">
            {formatCurrency(tarifa_total)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onSelect}
        >
          Seleccionar
        </Button>
      </CardActions>
    </Card>
  );
}

export default VehicleCard;
