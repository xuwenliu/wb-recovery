/* eslint-disable no-restricted-globals */
import React, { Fragment, useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';

import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { getAgeByBirthday } from '@/pages/scale/util/age';
import styles from '@/utils/publicStyles'

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


function YearLimit({ object = {}, value, onChange }) {
  const classes = useStyles();
  const today = new Date();

  const [birthday, setBirthday] = useState(object.birthday ? dateFromISO(object.birthday) : today);

  const handleDateChange = date => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setBirthday(date);
      onChange(getAgeByBirthday(birthday));
    }
  };

  useEffect(() => {
    onChange(getAgeByBirthday(birthday));
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

      <TextField
        className={classes.formControl}
        label="年龄"
        value={value}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        onChange={event => {
          if (event.target.value.length !== 0) {
            onChange(event.target.value);
          }
        }}
      />
    </Fragment>
  );
}

export default YearLimit;
