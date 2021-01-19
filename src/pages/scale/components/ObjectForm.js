import React from 'react';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { createForm } from 'rc-form';
import { formatDateFromTime } from '@/utils/format';
import styles from '@/utils/classStyle';

function ObjectForm({ form, record = {}, submit, handleCancel }) {
  const { id, number, name, gender, birthday } = record;
  const { getFieldDecorator } = form;

  const handelSubmit = () => {
    form.validateFields((err, values) => {
      if (!err) {
        submit({ ...values, id, birthday: formatDateFromTime(values.birthday) });
      }
    });
  };

  return (
    <>
      <Grid container justify="space-around">
        {getFieldDecorator('number', {
          initialValue: number || '',
          rules: [{ required: true, message: '这道题必须回答' }],
        })(<TextField label="编号" style={styles.formThird} />)}

        {getFieldDecorator('name', {
          initialValue: name || '',
          rules: [{ required: true, message: '这道题必须回答' }],
        })(<TextField label="姓名" style={styles.formThird} />)}
      </Grid>
      <Grid container justify="space-around">
        <FormControl>
          {/* <FormLabel>性别</FormLabel> */}
          <InputLabel>性别</InputLabel>
          {getFieldDecorator('gender', {
            initialValue: gender || '',
            rules: [{ required: true, message: '这道题必须回答' }],
          })(
            <Select style={styles.formThird}>
              <MenuItem value="男">男</MenuItem>
              <MenuItem value="女">女</MenuItem>
              <MenuItem value="?">?</MenuItem>
            </Select>,
          )}
        </FormControl>

        <FormControl>
          {/* <FormLabel>出生日期</FormLabel> */}
          <InputLabel>出生日期</InputLabel>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {getFieldDecorator('birthday', {
              initialValue: birthday ? new Date(birthday) : null,
              rules: [{ required: true, message: '这道题必须回答' }],
            })(<KeyboardDatePicker style={styles.formThird} margin="normal" format="yyyy/MM/dd" />)}
          </MuiPickersUtilsProvider>
        </FormControl>
      </Grid>
      <div style={{ ...styles.buttonLine, textAlign: 'center' }}>
        <Button style={{ width: '46%' }} variant="contained" color="primary" onClick={handelSubmit}>
          確定
        </Button>
        <Button
          style={{ width: '46%', marginLeft: '1rem' }}
          variant="contained"
          onClick={() => {
            if (handleCancel) {
              handleCancel();
            } else {
              form.resetFields();
            }
          }}
        >
          取消
        </Button>
      </div>
    </>
  );
}

export default createForm({})(ObjectForm);
