/* eslint-disable no-restricted-globals */
import React, { Fragment, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getMonthByBirthday } from '@/pages/scale/util/age';
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

export default function page({ object = {}, value, onChange }) {
  const classes = useStyles();
  const today = new Date();

  const [birthday, setBirthday] = React.useState(
    object.birthday ? dateFromISO(object.birthday) : today
  );

  const handleDateChange = date => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setBirthday(date);
      onChange(getMonthByBirthday(birthday));
    }
  };

  useEffect(() => {
    console.log(birthday, 'month:', getMonthByBirthday(birthday));
    onChange(getMonthByBirthday(birthday));
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
