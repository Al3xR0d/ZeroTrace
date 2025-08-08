import { parseISO, format, parse, setSeconds, setMilliseconds, formatISO } from 'date-fns';
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

export function formatInTimeZone(date: Date, timeZone: string): string {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });

  const parts = dtf.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value;
    return acc;
  }, {});

  return `${parts.weekday}, ${parts.month} ${parts.day}, ${parts.year} at ${parts.hour}:${parts.minute}:${parts.second} ${parts.timeZoneName}`;
}

export function timestampToRFC3339(ts: number | string): string {
  if (ts === null || ts === undefined) {
    throw new Error('timestamp required');
  }

  const num = typeof ts === 'string' ? Number(ts) : ts;
  if (Number.isNaN(num)) {
    throw new Error('invalid timestamp');
  }

  const ms = num < 1e12 ? Math.round(num * 1000) : Math.round(num);

  const d = new Date(ms);

  if (Number.isNaN(d.getTime())) {
    throw new Error('invalid timestamp after conversion');
  }

  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}
