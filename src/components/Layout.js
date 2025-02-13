import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";

function Layout({ children }) {
  const isEmbedded = window.self !== window.top;

  useEffect(() => {
    if (isEmbedded) {
      const sendHeight = () => {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({ type: 'setHeight', height }, '*');
      };

      // Enviar altura inicial
      sendHeight();

      // Observar cambios en el contenido
      const resizeObserver = new ResizeObserver(() => {
        sendHeight();
      });

      resizeObserver.observe(document.body);

      // Limpiar observer
      return () => resizeObserver.disconnect();
    }
  }, [isEmbedded]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: isEmbedded ? "auto" : "100vh",
        overflow: isEmbedded ? "visible" : "auto",
        ...(isEmbedded && {
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        })
      }}
    >
      {!isEmbedded && (
        <AppBar position="static">
          <Toolbar
            component={Container}
            maxWidth="md"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 1, sm: 0 },
              padding: 0,
            }}
          >
            <Box
              component="img"
              src="https://estarter.co/wp-content/uploads/2021/08/Logo-Estarter-Blanco.png"
              alt="Logo Estarter"
              sx={{
                height: 40,
                marginRight: { sm: 2 },
              }}
            />

            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                textAlign: { xs: "center", sm: "right" },
                whiteSpace: "nowrap",
              }}
            >
              Sistema de Reservas de Transporte
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          minHeight: isEmbedded ? "auto" : "100vh",
          overflow: "visible",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
