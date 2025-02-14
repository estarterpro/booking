import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDateTime = (date, time) => {
  if (!date || !time) return 'No especificada';
  const combined = new Date(`${date}T${time}`);
  return format(combined, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
};


export const formatTime = (time) => {
  if (!time) return 'No especificado';
  return format(new Date(time), 'HH:mm');
};

export const combineDateAndTime = (date, time) => {
  if (!date || !time) return null;
  const combined = new Date(date);
  const timeDate = new Date(time);
  combined.setHours(timeDate.getHours());
  combined.setMinutes(timeDate.getMinutes());
  return combined;
};