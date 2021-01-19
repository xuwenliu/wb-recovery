import { differenceInYears, differenceInDays } from 'date-fns';

/**
 * differenceInMonths():获得两个时间相差月份
 * 要和 platform.scale.util.AgeUtil 計算的結果一致
 */
const getAgeByBirthday = (birthday) => {
  if (birthday) {
    return differenceInYears(new Date(), birthday);
  }

  return '';
};

const getDayByBirthday = (birthday) => {
  if (birthday) {
    return differenceInDays(new Date(), birthday);
  }

  return '';
};

const getMonthByBirthday = (birthday, scale) => {
  if (birthday) {
    const diff = new Date().getTime() - birthday.getTime();
    const value = diff / (30 * 24 * 60 * 60 * 1000);

    if (scale === 0) {
      return Math.floor(value);
    }

    return value.toFixed(scale);
  }

  return '';
};

const getPDMSMonth = (birthday) => {
  return birthday;
};

export { getAgeByBirthday, getMonthByBirthday, getDayByBirthday, getPDMSMonth };
