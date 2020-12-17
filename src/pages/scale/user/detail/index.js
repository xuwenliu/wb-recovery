import React, { useEffect } from 'react';
import router from '@/utils/router';
import Header from '@/components/AppHeader';

import { connect } from 'dva';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { createForm } from 'rc-form';
import { formatDateFromTime } from '@/utils/format';
import styles from '@/utils/classStyle';

function Page({
  dispatch,
  form,
  scaleUserDetail: { record = {} },
  location: {
    query: { id },
  },
}) {
  const { getFieldDecorator } = form;

  const fetch = () => {
    if (id) {
      dispatch({
        type: 'scaleUserDetail/fetch',
        payload: { id },
      });
    }
  };

  const saveOrUpdate = values => {
    dispatch({
      type: 'scaleUserDetail/saveOrUpdate',
      payload: { values },
      callback: () => {
        router.push({
          pathname: '/scale/user',
        });
      },
    });
  };

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleUserDetail/clear',
        payload: {},
      });
    };
  }, []);

  const submit = () => {
    form.validateFields((err, values) => {
      if (!err) {
        const { birthday, ...others } = values;
        saveOrUpdate({ id, birthday: formatDateFromTime(birthday), ...others });
      }
    });
  };

  const { number, name, gender, birthday } = record;

  return (
    <div>
      <Header returnUrl="/scale/user">个案</Header>

      <Grid container justify="space-around">
        {getFieldDecorator('number', {
          initialValue: number || '',
          rules: [{ required: true, message: '这道题必须回答' }],
        })(<TextField label="编码" style={styles.formThird} />)}

        {getFieldDecorator('name', {
          initialValue: name || '',
          rules: [{ required: true, message: '这道题必须回答' }],
        })(<TextField label="姓名" style={styles.formThird} />)}
      </Grid>
      <Grid container justify="space-around">
        <FormControl>
          <InputLabel>性别</InputLabel>
          {getFieldDecorator('gender', {
            initialValue: gender || '',
            rules: [{ required: true, message: '这道题必须回答' }],
          })(
            <Select style={styles.formThird}>
              <MenuItem value="男">男</MenuItem>
              <MenuItem value="女">女</MenuItem>
            </Select>
          )}
        </FormControl>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {getFieldDecorator('birthday', {
            initialValue: birthday ? new Date(birthday) : null,
            rules: [{ required: true, message: '这道题必须回答' }],
          })(
            <KeyboardDatePicker
              style={styles.formThird}
              variant="inline"
              format="yyyy/MM/dd"
              margin="normal"
            />
          )}
        </MuiPickersUtilsProvider>
      </Grid>
      <div style={styles.formLine}>
        <Button style={{ width: '100%' }} variant="contained" color="primary" onClick={submit}>
          確定
        </Button>
      </div>
    </div>
  );
}

const warp = createForm({})(Page);

export default connect(({ scaleUserDetail, loading }) => ({
  loading: loading.effects['scaleUserDetail/fetch'],
  scaleUserDetail,
}))(warp);
