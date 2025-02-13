import React, { createContext, useContext, useState, useCallback } from "react";
import ErrorSnackbar from "../components/common/ErrorSnackbar";

const ErrorContext = createContext(null);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = useCallback((message, severity = "error") => {
    setError({ message, severity });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      <ErrorSnackbar
        open={!!error}
        message={error?.message}
        severity={error?.severity}
        onClose={clearError}
      />
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
