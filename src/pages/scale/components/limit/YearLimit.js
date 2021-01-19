import React, { useState, useEffect } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { makeStyles } from '@material-ui/core/styles';
import { getAgeByBirthday } from '@/pages/scale/util/age';
import styles from '@/utils/publicStyles';

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

function YearLimit({ object = {}, onChange }) {
  const classes = useStyles();
  const today = new Date();

  const [birthday] = useState(object.birthday ? dateFromISO(object.birthday) : today);

  useEffect(() => {
    onChange(getAgeByBirthday(birthday));
  }, []);

  return (
    <FormControl className={classes.formControl}>
      <FormLabel>年龄</FormLabel>
      <div>{getAgeByBirthday(birthday)}</div>
    </FormControl>
  );
}

export default YearLimit;
