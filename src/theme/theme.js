import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff', // Tono de azul más moderno y brillante
      light: '#4dabf5',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c757d', // Gris neutro para elementos secundarios
      light: '#9da5b0',
      dark: '#495057',
      contrastText: '#ffffff',
    },
    red: {
      main: '#dc004e', // Rojo más vibrante
      light: '#e87980',
      dark: '#c82333',
      contrastText: '#ffffff',
    },
    green: {
      main: '#28a745', // Verde más vibrante
      light: '#63c682',
      dark: '#1e7e34',
      contrastText: '#ffffff',
    },

    background: {
      default: '', // Fondo ligeramente más claro
      paper: '#ffffff',
    },
    text: {
      primary: '#212529', // Color de texto más oscuro para mejor legibilidad
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.05em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.04em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.03em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontFamily: '"Inter", sans-serif',
    },
  },
  shape: {
    borderRadius: 12, // Mantener bordes redondeados consistentes
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
        },
        contained: {
          backgroundColor: '#007bff',
          color: 'white',
          '&:hover': {
            backgroundColor: '#0056b3',
          },
        },
        outlined: {
          borderColor: 'rgba(0,123,255,0.5)',
          '&:hover': {
            borderColor: '#007bff',
            backgroundColor: 'rgba(0,123,255,0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.23)',
            },
            '&:hover fieldset': {
              borderColor: '#007bff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007bff',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-outlined': {
            transform: 'translate(14px, 14px) scale(1)',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -6px) scale(0.75)',
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          padding: '14px 16px',
        },
      },
    },
  },
});

export default theme;