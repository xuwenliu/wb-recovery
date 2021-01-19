/* eslint-disable no-restricted-globals */
import React, { Fragment, useEffect } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import { getYear, getMonth, getDate } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';

import styles from '@/utils/publicStyles';

const useStyles = makeStyles({
  formControl: styles.formControl,
  lineControl: styles.lineControl,
});

function dateFromISO(isoDateString) {
  if (isoDateString.match) {
    const parts = isoDateString.match(/\d+/g);
    const isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
    return new Date(isoTime);
  }
  return new Date(isoDateString);
}

export default function page({ object = {}, value, onChange, supportEarly = true }) {
  const classes = useStyles();
  const today = new Date();

  const [early, setEarly] = React.useState({});

  const calculateMonth = () => {
    const birthday = object.birthday ? dateFromISO(object.birthday) : today;

    const start = {
      year: getYear(birthday),
      month: getMonth(birthday) + 1, // 0 代表一月份
      date: getDate(birthday),
    };

    if (early.month) {
      start.month += early.month * 1;
    }
    if (early.date) {
      start.date += early.date * 1;
    }

    const end = {
      year: getYear(today),
      month: getMonth(today) + 1,
      date: getDate(today),
    };

    const e = (end.year * 12 + end.month) * 30 + end.date;
    const s = (start.year * 12 + start.month) * 30 + start.date;

    const v = Math.floor((e - s) / 30);

    return v;
  };

  const handleEarlyMonthChange = (changeValue) => {
    early.month = changeValue;
    setEarly(early);
    onChange(calculateMonth());
  };

  const handleEarlyDateChange = (changeValue) => {
    early.date = changeValue;
    setEarly(early);
    onChange(calculateMonth());
  };

  useEffect(() => {
    onChange(calculateMonth());
  }, [object.id]);

  return (
    <Fragment>
      {supportEarly && (
        <Fragment>
          <TextField
            className={classes.lineControl}
            label="早產月份"
            variant="outlined"
            type="number"
            value={early.month}
            onChange={(e) => {
              handleEarlyMonthChange(e.target.value);
            }}
          />
          <TextField
            className={classes.lineControl}
            label="早產天數"
            variant="outlined"
            type="number"
            value={early.date}
            onChange={(e) => {
              handleEarlyDateChange(e.target.value);
            }}
          />
        </Fragment>
      )}
      <FormControl className={classes.formControl}>
        <FormLabel>月龄</FormLabel>
        <div>{value}</div>
      </FormControl>
    </Fragment>
  );
}
