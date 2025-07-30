import { parseISO, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const MOSCOW_TZ = 'Europe/Moscow';

export function formatToMoscowDate(isoDate: string, dateFormat = 'yyyy-MM-dd HH:mm:ss'): string {
  const dateUtc = parseISO(isoDate);
  const dateMsk = toZonedTime(dateUtc, MOSCOW_TZ);
  return format(dateMsk, dateFormat);
}

export function toMoscowDateObject(isoDate: string): Date {
  const dateUtc = parseISO(isoDate);
  return toZonedTime(dateUtc, MOSCOW_TZ);
}
