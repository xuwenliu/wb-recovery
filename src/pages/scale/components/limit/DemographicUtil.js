/* eslint-disable no-shadow */
/* eslint-disable react/react-in-jsx-scope */
import { uniqueId } from 'lodash/util';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import data from './defaultDemographics';
import { getError } from '@/utils/error';

function getCascaderItem(form, classes, name, value, index) {
  const options = [];

  /**
   * 固定兩層
   */
  value.forEach(e => {
    const key = Object.keys(e)[0];
    const item = e[key];

    const top = {
      value: key,
      label: key,
      children: [],
    };

    item.forEach(child => {
      top.children.push({
        value: child,
        label: child,
      });
    });

    options.push(top);
  });

  return (
    <div key={index} label={name}>
      {form.getFieldDecorator(`limits[${index}].${name}`, {
        rules: [{ required: true, message: `请输入${name}` }],
      })(<div options={options} placeholder="请输入" />)}
    </div>
  );
}

function getTextItem(form, classes, name, value, index) {
  return form.getFieldDecorator(`limits[${index}].${name}`, {
    rules: [{ required: true, message: `请输入${name}` }],
  })(
    <TextField
      fullWidth
      key={name}
      label={name}
      variant="outlined"
      className={classes.lineControl}
      {...getError({ errors: form.getFieldError(`limits[${index}].${name}`) })}
    />
  );
}

function getArrayItem(form, classes, name, value, index) {
  return form.getFieldDecorator(`limits[${index}].${name}`, {
    rules: [{ required: true, message: `请输入${name}` }],
  })(
    <TextField
      key={index}
      select
      label={name}
      fullWidth
      className={classes.lineControl}
      variant="outlined"
    >
      {value.map(item => (
        <MenuItem key={uniqueId()} value={item}>
          {item}
        </MenuItem>
      ))}
    </TextField>
  );
}

// eslint-disable-next-line consistent-return
function getSystemItem(form, classes, name, value, index) {
  const i = data.findIndex(i => i.code === value);

  if (i > -1) {
    const item = data[i];

    if (item.type === 'cascader') {
      return getCascaderItem(form, classes, name, item.value, index);
    }
    if (item.type === 'select') {
      return getArrayItem(form, classes, name, item.value, index);
    }
    if (item.type === 'text') {
      return getTextItem(form, classes, name, item.value, index);
    }
  }
}

export function getUI(form, classes, name, value, index) {
  if (value && value.startsWith && value.startsWith('system.')) {
    return getSystemItem(form, classes, name, value, index);
  }

  if (Array.isArray(value)) {
    return getArrayItem(form, classes, name, value, index);
  }

  return getTextItem(form, classes, name, value, index);
}
