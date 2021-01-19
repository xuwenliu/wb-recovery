import React, { Fragment, useEffect } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { getMonthByBirthday } from '@/pages/scale/util/age';
import { makeStyles } from '@material-ui/core/styles';
import { formControl, lineControl } from '@/utils/publicStyles';

const useStyles = makeStyles({
  formControl,
  lineControl,
  paperControl: {
    marginLeft: 40,
  },
});
/**
 * 
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

      const handleDateChange = date => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setBirthday(date);
      onChange(getMonthByBirthday(birthday, scale));
    }
  };
 */

function dateFromISO(isoDateString) {
  if (isoDateString.match) {
    const parts = isoDateString.match(/\d+/g);
    const isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
    return new Date(isoTime);
  }
  return new Date(isoDateString);
}

export default function page({ object = {}, scale = 0, value, onChange }) {
  const today = new Date();
  const classes = useStyles();

  useEffect(() => {
    const birthday = object.birthday ? dateFromISO(object.birthday) : today;
    onChange(getMonthByBirthday(birthday, scale));
  }, [object.id]);

  // classes要跟当前页面的classes保持一致

  return (
    <Fragment>
      <FormControl className={classes.formControl}>
        <FormLabel>月龄</FormLabel>
        <div>{value}</div>
      </FormControl>

      {/**
         * <TextField
        className={classes.formControl}
        id="outlined-basic"
        label="月龄"
        value={value}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={event => {
          onChange(event.target.value);
        }}
        InputProps={{
          readOnly: true,
        }}
      />
         */}
    </Fragment>
  );
}
