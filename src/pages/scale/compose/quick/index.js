import React, { useEffect } from 'react';
import { connect } from 'dva';
import router from '@/utils/router';
import { useDebounceFn } from '@umijs/hooks';
import { createForm } from 'rc-form';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@/components/Alert';
import Header from '@/components/AppHeader';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Button from '@/components/Common/Button';
import AutoComplete from '@/components/AutoComplete';

import Demographics from '@/pages/scale/components/Demographics';
import { lineControl, formControl } from '@/utils/publicStyles';
import SubScale from '../../components/SubScale';

/**
 * 主要差異在跳轉的地方
 * 1.答題後要跳轉到哪邊
 *
 * 人口學變量有改變
 *
 */
const useStyles = makeStyles({
  formControl,
  lineControl,
});

function Page({
  dispatch,
  form,
  objects = { content: [] },
  object,
  scales = { content: [] },
  scale,
  subScaleNames = [],
  // loading,
  submiting,
}) {

  const { getFieldDecorator , getFieldError } = form;

  const classes = useStyles();

  const fetch = () => {
    dispatch({
      type: 'scaleComposeQuick/fetch',
      payload: { code: 'S0057' },
    });
  };

  const fetchScale = (compose) => {
    dispatch({
      type: 'scaleComposeQuick/fetchScale',
      payload: { scaleId: compose },
    });
  };

  const fetchObject = (objectId) => {
    dispatch({
      type: 'scaleComposeQuick/fetchObjectDetail',
      payload: { id: objectId },
    });
  };

  /**
   * 避免短時間內重複查詢
   */
  const { run: handleSearch } = useDebounceFn((number) => {
    dispatch({
      type: 'scaleComposeQuick/fetchObject',
      payload: { text:number },
    });
  }, 500);

  const checkNext = ({ subScales, id }) => {
    /**
     * 人口學頁面為中間頁面.不增加到路由紀錄
     */

    if (subScales.length > 1) {
      // 多個子量表的答題
      router.push({
        pathname: '/scale/compose/answer',
        query: { compose: scale.id, id },
      });
    } else {
      // 直接打題
      router.push({
        pathname: '/scale/compose/answer/single',
        query: { compose: scale.id, id, subScale: subScales[0] },
      });
    }
  };

  const handleSubmit = () => {
    form.validateFields((err, values) => {
      if (!err) {
        const testeeInfo = [];
        const { subScales } = values;

        Object.keys(values).forEach((key) => {
          if (key !== 'subScales') {
            const v = {};
            v[key] = values[key];
            testeeInfo.push(v);
          }
        });

        dispatch({
          type: 'scaleComposeQuick/createAnswer',
          payload: {
            compose: scale.id,
            values: { user: object.id, subleScaleName: subScales, testeeInfo },
          },
          callback: ({ id }) => {
            checkNext({ subScales, id });
          },
        });
      }
    });
  };

  const getSubScaleInfo = () => {

    const info = { items: [...subScaleNames] };
    info.alert = getFieldError('subScales');
    // alert

    return info;
  };

  const demographicsOnChange = (values) => {
    // 過濾空白
    const demographics = {};
    Object.keys(values).forEach((key) => {
      if (values[key] !== '') {
        demographics[key] = values[key];
      }
    });

    /** 帶出子量表 */
    dispatch({
      type: 'scaleComposeQuick/fetchSubScaleNames',
      payload: { id: scale.id, demographics },
    });
  };

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleComposeQuick/clear',
        payload: {},
      });
    };
  }, []);

  const subScaleInfo = getSubScaleInfo();

  console.log('object:',object);

  return (
    <>
      <Header>
        <h2 style={{ textAlign: 'center' }}>检核自评</h2>
      </Header>
      <Paper style={{ padding: 10 }}>
        <form noValidate autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.text}>量表</InputLabel>
            <Select
              style={{ width: '250px' }}
              onChange={(event) => {
                fetchScale(event.target.value);
              }}
            >
              {scales.content.map((s) => (
                <MenuItem key={s.id} value={s.id} id={s.id}>
                  {s.scaleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {scale && (
            <div style={{ paddingLeft: 20 }}>
              <AutoComplete
                label="人员代码"
                onInputChange={(value) => {
                  const vs = value.split('.');
                  if (vs.length === 1) {
                    handleSearch(value);
                  }
                }}
                onChange={({ value }) => {
                  fetchObject(value);
                }}
                options={objects.content.map((i) => {
                  return {
                    value: i.id,
                    label: `${i.number}.${i.name}`,
                  };
                })}
              />
            </div>
          )}

          {object && (
            <div>
              {getFieldDecorator('name', {
                initialValue: object.name,
                rules: [{ required: true, message: '姓名' }],
              })(<TextField className={classes.formControl} label="姓名" variant="outlined" />)}

              <Demographics
                object={object}
                form={form}
                limits={scale.limits}
                onChange={demographicsOnChange}
              />
              {getFieldDecorator('subScales', {
                initialValue: scale.choiceType === 'SINGLE' ? [] : subScaleInfo.items,
                rules: [{ required: true, message: '符合条件的子量表不可为空' }],
              })(<SubScale choiceType={scale.choiceType} data={subScaleInfo.items} />)}

              {subScaleInfo.alert ? (
                <Alert style={{ margin: '10px' }} severity="info">
                  {subScaleInfo.alert}
                </Alert>
              ) : null}

              <div style={{ margin: 20, marginTop: 40 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  loading={submiting}
                >
                  开始答题
                </Button>
              </div>
            </div>
          )}
        </form>
      </Paper>
    </>
  );
}

const warp = createForm({})(Page);

export default connect(({ scaleComposeQuick, loading }) => ({
  loading: loading.effects['scaleComposeQuick/fetchObject'],
  loadingObject: loading.effects['scaleComposeQuick/fetchObjectDetail'],
  submiting: loading.effects['scaleComposeQuick/createAnswer'],
  scales: scaleComposeQuick.scales,
  scale: scaleComposeQuick.scale,
  objects: scaleComposeQuick.objects,
  object: scaleComposeQuick.object,
  subScaleNames: scaleComposeQuick.subScaleNames,
}))(warp);
