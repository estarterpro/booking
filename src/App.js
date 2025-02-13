import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import { ErrorProvider } from "./context/ErrorContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import RouteSelection from "./pages/RouteSelection";
import SearchResults from "./pages/SearchResults";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <Layout>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<RouteSelection />} />
              <Route path="/results" element={<SearchResults />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </Layout>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
