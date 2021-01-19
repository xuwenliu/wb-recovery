import { format } from 'date-fns';
import moment from 'moment';

const FORMAT_DATE = 'yyyy-MM-dd';

export function formatDateFromTime(time) {
  if (time) {
    const date = new Date();

    date.setTime(time);

    return format(date, FORMAT_DATE);
  }

  return '';
}

export function formatDateFromDays(days) {
  const milliseconds = parseInt(days) * 24 * 60 * 60 * 1000; // 将天数换算成毫秒数
  const duration = moment.duration(milliseconds); // 用momentJs的duration函数换算成年月日 tips：这个换算是大概换算没有计算闰年和标准的大小月
  return duration._data;
}
