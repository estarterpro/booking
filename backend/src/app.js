const express = require('express');
const cors = require('cors');
//const swaggerUi = require('swagger-ui-express');
//const YAML = require('yamljs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de registro de solicitudes
app.use((req, res, next) => {
  console.log({
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
  });
  next();
});

// Descomenta la línea de abajo si tienes `swagger.yaml` y quieres cargar la documentación
// const swaggerDocument = require('../swagger.yaml'); // o YAML.load('ruta/archivo/swagger.yaml');

// Middleware para la documentación de Swagger
// if (swaggerDocument) {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// }

app.use('/api', require('./routes/api'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

module.exports = app;
