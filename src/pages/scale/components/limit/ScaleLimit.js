/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Alert from '@/components/Alert';
import { makeStyles } from '@material-ui/core/styles';
import styles from '@/utils/publicStyles'
import { uniqueId } from 'lodash/util';

const useStyles = makeStyles({
  formControl: styles.formControlTB,
  lineControl:lineControl,
});

export default function page({ form, object, scale = {} }) {
  const classes = useStyles();
  const createFormItem = (name, value, index) => {
    if (Array.isArray(value)) {
      return (
        <FormControl key={name} className={classes.formControl}>
          <InputLabel>{name}</InputLabel>
          {form.getFieldDecorator(`limits[${index}].${name}`, {
            rules: [{ required: true, message: '請輸入' }],
          })(
            <Select style={{ width: '100%' }}>
              {value.map(item => (
                <MenuItem key={uniqueId()} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      );
    }
    return (
      <div key={index} className={classes.formControl}>
        {/**
           *  {form.getFieldDecorator('name', {
          rules: [],
        })(<TextField fullWidth label="姓名" variant="outlined" className={classes.formControl} />)}
           */}
        {form.getFieldDecorator(`limits[${index}].${name}`, {
          rules: [],
        })(<TextField fullWidth key={name} label={name} placeholder={value} variant="outlined" />)}
      </div>
    );
  };

  const { objectLimit = [], scaleName } = scale;
  const fields = {};

  objectLimit.forEach(item => {
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
      {fields.length > 0 && <Alert severity="warning">请输入量表 {scaleName} 的人口学变量</Alert>}
      {/* <FormControl className={classes.formControl}>
        <FormLabel>姓名：{object.name}</FormLabel>
      </FormControl> */}

      {Object.keys(fields).map((name, index) => createFormItem(name, fields[name], index))}
    </Fragment>
  );
}
