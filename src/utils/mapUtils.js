export const calculateBounds = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  return coordinates.reduce(
    (bounds, coord) => ({
      minLng: Math.min(bounds.minLng, coord[0]),
      maxLng: Math.max(bounds.maxLng, coord[0]),
      minLat: Math.min(bounds.minLat, coord[1]),
      maxLat: Math.max(bounds.maxLat, coord[1]),
    }),
    {
      minLng: coordinates[0][0],
      maxLng: coordinates[0][0],
      minLat: coordinates[0][1],
      maxLat: coordinates[0][1],
    }
  );
};

export const calculateViewport = (bounds, padding = 40) => {
  if (!bounds) return null;

  return {
    longitude: (bounds.minLng + bounds.maxLng) / 2,
    latitude: (bounds.minLat + bounds.maxLat) / 2,
    zoom: 11,
    padding: {
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
    },
  };
};
