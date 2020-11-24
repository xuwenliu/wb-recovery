import { format } from 'date-fns';

const FORMAT_DATE = 'yyyy-MM-dd';

export function formatDateFromTime(time) {
  if (time) {
    const date = new Date();

    date.setTime(time);

    return format(date, FORMAT_DATE);
  }

  return '';
}
