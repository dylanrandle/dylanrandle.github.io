import { CONTENT_DATE_FORMAT } from '../config.ts';

const dateOptions = {
  card: { day: 'numeric', month: 'short', year: 'numeric' },
  article: { dateStyle: 'long' },
  resume: { month: 'short', year: 'numeric' },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export const formatContentDate = (
  date: Date,
  style: keyof typeof dateOptions,
) =>
  new Intl.DateTimeFormat(CONTENT_DATE_FORMAT.locale, {
    ...dateOptions[style],
    timeZone: CONTENT_DATE_FORMAT.timeZone,
  }).format(date);
