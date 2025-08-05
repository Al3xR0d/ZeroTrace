import { parseISO, format, parse, setSeconds, setMilliseconds } from 'date-fns';
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

export const formatCurrentDateToRFC3339 = (): string => {
  const now = new Date();

  const utcDate = setSeconds(setMilliseconds(now, 0), 0);

  return utcDate.toISOString().replace(/:\d{2}\.\d{3}Z$/, ':00Z');
};

export const formatForInput = (isoDate: string | null): string => {
  if (!isoDate) return '';
  return formatToMoscowDate(isoDate, 'yyyy-MM-dd HH:mm:ss');
};

export const parseToUTC = (localDate: string): string | null => {
  if (!localDate) return null;

  const moscowDate = parse(localDate, 'yyyy-MM-dd HH:mm:ss', new Date());

  return toZonedTime(moscowDate, 'Europe/Moscow').toISOString();
};
