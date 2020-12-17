import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { getUI } from './DemographicUtil';

const useStyles = makeStyles({
  formControl: {
    display: 'block',
    marginTop: 20,
    marginBottom: 20,
  },
  lineControl: {
    marginTop: 15,
    marginBottom: 15,
  },
});

export default function page({ form, limits }) {
  const classes = useStyles();
  const fields = {};

  limits.forEach(item => {
    const values = item.split(':');
    const name = values[0];
    const value = values[1];

    // eslint-disable-next-line no-prototype-builtins
    if (fields.hasOwnProperty(name) === false) {
      fields[name] = value;
    } else if (Array.isArray(fields[name])) {
      fields[name].push(value);
    } else {
      fields[name] = [fields[name], value];
    }
  });

  return (
    <Fragment>
      {Object.keys(fields).map((name, index) => getUI(form, classes, name, fields[name], index))}
    </Fragment>
  );
}
