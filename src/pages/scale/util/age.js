import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

/**
 * differenceInMonths():获得两个时间相差月份
 * 要和 platform.scale.util.AgeUtil 計算的結果一致
 */
const getAgeByBirthday = birthday => {
  if (birthday) {
    return differenceInYears(new Date(), birthday);
  }

  return '';
};

const getDayByBirthday = birthday => {
  if (birthday) {
    return differenceInDays(new Date(), birthday);
  }

  return '';
};

const getMonthByBirthday = birthday => {
  if (birthday) {
    return differenceInMonths(new Date(), birthday);
  }

  return '';
};

const getPDMSMonth = birthday => {
  return birthday;
};

export { getAgeByBirthday, getMonthByBirthday, getDayByBirthday, getPDMSMonth };
