import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material';
import { createOrUpdateClient } from '../../services/api';

function PassengerForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    notas_conductor: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }
    
    if (!formData.correo) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        // Guardar o actualizar cliente para remarketing
        await createOrUpdateClient(formData);
        onSubmit(formData);
      } catch (error) {
        console.error('Error saving client data:', error);
        setErrors({ submit: 'Error al guardar los datos. Por favor, intenta nuevamente.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Datos del pasajero
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Nombre completo"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              error={!!errors.nombre}
              helperText={errors.nombre}
              fullWidth
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              value={formData.telefono}
              onChange={handleChange('telefono')}
              error={!!errors.telefono}
              helperText={errors.telefono}
              fullWidth
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Correo electrónico"
              type="email"
              value={formData.correo}
              onChange={handleChange('correo')}
              error={!!errors.correo}
              helperText={errors.correo}
              fullWidth
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Notas para el conductor (opcional)"
              value={formData.notas_conductor}
              onChange={handleChange('notas_conductor')}
              multiline
              rows={4}
              fullWidth
              disabled={loading}
            />
          </Grid>
          
          {errors.submit && (
            <Grid item xs={12}>
              <Typography color="error">{errors.submit}</Typography>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Continuar'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default PassengerForm;