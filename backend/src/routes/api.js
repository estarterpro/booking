const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Import controllers
const authController = require("../controllers/authController");
const clientController = require("../controllers/clientController");
const driverController = require("../controllers/driverController");
const rateController = require("../controllers/rateController");
const reservationController = require("../controllers/reservationController");
const serviceOrderController = require("../controllers/serviceOrderController");
const locationController = require("../controllers/locationController");
const vehicleController = require("../controllers/vehicleController");
const searchController = require("../controllers/searchController");
const mapboxTestController = require("../controllers/mapboxTestController");
const paymentController = require('../controllers/paymentController');

// Auth routes
router.post("/login", authController.login);

// Mapbox test route
router.post("/test/mapbox", mapboxTestController.testMapboxDistance);

// Search route - new endpoint for the initial search
router.post("/search", searchController.searchTransport);

// Client routes
router.post("/clientes", clientController.createOrUpdateClient);
router.get("/clientes", clientController.getClients);

// Driver routes
router.post("/conductores", driverController.createDriver);
router.get("/conductores", driverController.getDrivers);
router.patch(
  "/conductores/:id/estado",
  auth,
  driverController.updateDriverStatus
);

// Rate routes
router.post("/tarifas", rateController.createRate);
router.get("/tarifas", rateController.getRates);
router.patch("/tarifas", rateController.updateRate);  //auth, rateController.updateRate);
router.delete("/tarifas/:id", auth, rateController.deleteRate);

// Reservation routes
router.post("/reservas", reservationController.createReservation);
router.get("/reservas", reservationController.getReservations);
router.patch(
  "/reservas/:id",
  auth,
  reservationController.updateReservationStatus
);

// Service Order routes
router.post("/ordenes-servicio", serviceOrderController.createServiceOrder);
router.get("/ordenes-servicio", serviceOrderController.getServiceOrders);

// Location routes
router.post("/ubicaciones", locationController.createLocation);
router.get("/ubicaciones", locationController.getLocations);
router.patch("/ubicaciones/:id", auth, locationController.updateLocation);
router.delete("/ubicaciones/:id", auth, locationController.deleteLocation);

// Vehicle routes
router.post("/vehiculos", vehicleController.createVehicle);
router.get("/vehiculos", vehicleController.getVehicles);
router.patch("/vehiculos/:id", auth, vehicleController.updateVehicle);
router.delete("/vehiculos/:id", auth, vehicleController.deleteVehicle);

// Rutas de pago
router.post('/payments/signature', paymentController.generateWompiSignature);
router.post('/payments/webhook', paymentController.handleWompiWebhook);
router.get('/payments/transactions/:transactionId', paymentController.getTransactionStatus);

module.exports = router;
