const { getMapboxToken, getHereMapsToken } = require('./tokenManager');

const MAPBOX_ACCESS_TOKEN = getMapboxToken();
const HERE_MAPS_API_KEY = getHereMapsToken();

module.exports = { MAPBOX_ACCESS_TOKEN, HERE_MAPS_API_KEY };
