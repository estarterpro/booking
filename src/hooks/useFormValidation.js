import { useState, useCallback } from "react";
import { useError } from "../context/ErrorContext";

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const { showError } = useError();

  const validate = useCallback(
    (fieldValues = values) => {
      let tempErrors = {};
      let isValid = true;

      Object.keys(validationRules).forEach((key) => {
        const value = fieldValues[key];
        const rules = validationRules[key];

        if (rules.required && !value) {
          tempErrors[key] = "Este campo es requerido";
          isValid = false;
        } else if (rules.pattern && !rules.pattern.test(value)) {
          tempErrors[key] = rules.message || "Formato inválido";
          isValid = false;
        } else if (rules.custom) {
          const customError = rules.custom(value, fieldValues);
          if (customError) {
            tempErrors[key] = customError;
            isValid = false;
          }
        }
      });

      setErrors(tempErrors);
      return isValid;
    },
    [values, validationRules]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (onSubmit) => {
      try {
        if (validate()) {
          await onSubmit(values);
        } else {
          showError("Por favor, corrige los errores en el formulario");
        }
      } catch (error) {
        showError(error.message || "Error al procesar el formulario");
      }
    },
    [values, validate, showError]
  );

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    validate,
  };
};
