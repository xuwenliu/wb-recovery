import React, { useState, useEffect } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { makeStyles } from '@material-ui/core/styles';
import { getDayByBirthday } from '@/pages/scale/util/age';
import styles from '@/utils/publicStyles';
import { formatDateFromDays } from '@/utils/format';

function dateFromISO(isoDateString) {
  if (isoDateString.match) {
    const parts = isoDateString.match(/\d+/g);
    const isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
    return new Date(isoTime);
  }
  return new Date(isoDateString);
}

const useStyles = makeStyles({
  formControl: styles.formControl,
  lineControl: styles.lineControl,
});

const DateDisplay = ({ day = {} }) => {
  const { years, months, days } = formatDateFromDays(day);

  const list = [];

  if (years) {
    list.push(<span>{years}年</span>);
  }

  if (months) {
    list.push(<span>{months}个月</span>);
  }

  if (days) {
    list.push(<span>{days}天</span>);
  }

  return list;
};

function DayLimit({ object = {}, value, onChange }) {
  const classes = useStyles();

  useEffect(() => {
    const birthday = object.birthday ? dateFromISO(object.birthday) : new Date();
    onChange(getDayByBirthday(birthday));
  }, [object.id]);

  return (
    <FormControl className={classes.formControl}>
      <FormLabel>年齡</FormLabel>
      <div>
        <DateDisplay day={value} />
      </div>
    </FormControl>
  );
}

export default DayLimit;
