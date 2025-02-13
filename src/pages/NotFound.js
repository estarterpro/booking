import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Error as ErrorIcon } from '@mui/icons-material';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <ErrorIcon
          sx={{
            fontSize: 100,
            color: 'primary.main',
            mb: 4,
          }}
        />

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 500,
            color: 'text.primary',
            mb: 2,
          }}
        >
          Página No Encontrada
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 600 }}
        >
          Lo sentimos, la página que estás buscando no existe. Verifica la URL o
          regresa al inicio para continuar con tu reserva de transporte.
        </Typography>

        {/* Sugerencias de Url, se deja pendiente la implementación de estos links 
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            URLs sugeridas:
          </Typography>
          <Typography component="div" sx={{ mb: 1 }}>
            <code>booking.estarter.co/</code> - Página principal
          </Typography>
          <Typography component="div" sx={{ mb: 1 }}>
            <code>booking.estarter.co/results</code> - Resultados de búsqueda
          </Typography>
          <Typography component="div">
            <code>booking.estarter.co/confirmation</code> - Confirmación de reserva
          </Typography>
        </Box>
*/}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/')}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: (theme) => theme.shadows[4],
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Volver al Inicio
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
