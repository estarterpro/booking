import React from "react";
import { Grid, Card, CardContent, Typography, Radio, Box } from "@mui/material";
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  PhoneAndroid as NequiIcon,
} from "@mui/icons-material";

const paymentMethods = [
  {
    id: "CARD",
    name: "Tarjeta de Crédito/Débito",
    icon: CreditCardIcon,
    description: "Paga de forma segura con tu tarjeta",
  },
  {
    id: "PSE",
    name: "PSE - Débito bancario",
    icon: BankIcon,
    description: "Transfiere desde tu banco",
  },
  {
    id: "NEQUI",
    name: "Nequi",
    icon: NequiIcon,
    description: "Paga con tu cuenta Nequi",
  },
];

function PaymentMethods({ selectedMethod, onMethodSelect }) {
  return (
    <Grid container spacing={2}>
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        return (
          <Grid item xs={12} key={method.id}>
            <Card
              sx={{
                cursor: "pointer",
                border:
                  selectedMethod === method.id
                    ? "2px solid #1976d2"
                    : "1px solid #e0e0e0",
                "&:hover": {
                  borderColor: "#1976d2",
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
              onClick={() => onMethodSelect(method.id)}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Radio
                    checked={selectedMethod === method.id}
                    value={method.id}
                    name="payment-method"
                  />
                  <Icon color="primary" />
                  <Box>
                    <Typography variant="subtitle1">{method.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {method.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default PaymentMethods;
