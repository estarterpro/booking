export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validatePassengers = (count) => {
  const num = Number(count);
  return !isNaN(num) && num >= 1 && num <= 10;
};

export const validateDateTimeOrder = (departureDate, departureTime, returnDate, returnTime) => {
  if (!returnDate || !returnTime) return true;
  
  const departure = new Date(departureDate);
  departure.setHours(departureTime.getHours());
  departure.setMinutes(departureTime.getMinutes());
  
  const return_ = new Date(returnDate);
  return_.setHours(returnTime.getHours());
  return_.setMinutes(returnTime.getMinutes());
  
  return return_ > departure;
};