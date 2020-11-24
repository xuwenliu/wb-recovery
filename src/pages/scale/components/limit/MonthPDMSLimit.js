/* eslint-disable no-restricted-globals */
import React, { Fragment, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getYear, getMonth, getDate } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  formControl: {
    display: 'block',
    margin: 20,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        width: 230,
      },
    },
  },
  lineControl: {
    margin: 20,
  },
});

function dateFromISO(isoDateString) {
  if (isoDateString.match) {
    const parts = isoDateString.match(/\d+/g);
    const isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
    return new Date(isoTime);
  }
  return new Date(isoDateString);
}

export default function page({ object = {}, value, onChange, supportEarly }) {
  const classes = useStyles();
  const today = new Date();

  const [birthday, setBirthday] = React.useState(
    object.birthday ? dateFromISO(object.birthday) : today
  );

  const [early, setEarly] = React.useState({});

  const calculateMonth = () => {
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

  const handleDateChange = date => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setBirthday(date);
      onChange(calculateMonth());
    }
  };

  const handleEarlyMonthChange = changeValue => {
    early.month = changeValue;
    setEarly(early);
    onChange(calculateMonth());
  };

  const handleEarlyDateChange = changeValue => {
    early.date = changeValue;
    setEarly(early);
    onChange(calculateMonth());
  };

  useEffect(() => {
    onChange(calculateMonth());
  }, []);

  return (
    <Fragment>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          // disableToolbar
          className={classes.formControl}
          style={{ width: 230 }}
          margin="normal"
          id="date-picker-dialog"
          label="出生日期"
          // variant="inline"
          format="yyyy/MM/dd"
          value={birthday}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>

      {supportEarly && (
        <Fragment>
          <TextField
            className={classes.lineControl}
            label="早產月份"
            variant="outlined"
            type="number"
            value={early.month}
            onChange={e => {
              handleEarlyMonthChange(e.target.value);
            }}
          />
          <TextField
            className={classes.lineControl}
            label="早產天數"
            variant="outlined"
            type="number"
            value={early.date}
            onChange={e => {
              handleEarlyDateChange(e.target.value);
            }}
          />
        </Fragment>
      )}

      <TextField
        className={classes.formControl}
        id="outlined-basic"
        label="月份"
        value={value}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        onChange={event => {
          onChange(event.target.value);
        }}
      />
    </Fragment>
  );
}
