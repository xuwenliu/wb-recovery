import React, { useEffect } from 'react';
import { connect } from 'dva';
import router from '@/utils/router';
import { useDebounceFn } from '@umijs/hooks';
import { createForm } from 'rc-form';
import TextField from '@material-ui/core/TextField';
import Alert from '@/components/Alert';
import Header from '@/components/AppHeader';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Button from '@/components/Common/Button';
import AutoComplete from '@/components/AutoComplete';
import SubScale from '../../components/SubScale';
import { getError } from '@/utils/error';
import Demographics from '@/pages/scale/components/Demographics';
/**
 * 1.依照人口學變量產生畫面元件
 *
 * 2.依照人口學變量產生子量表清單
 */
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

function Page({
  dispatch,
  location: {
    query: { compose },
  },
  form,
  objects = { content: [] },
  object,
  scale,
  subScaleNames = [],
  loading,
  submiting,
}) {
  const { getFieldDecorator, getFieldError } = form;

  const classes = useStyles();

  const fetchScale = () => {
    dispatch({
      type: 'scaleComposeTesteeInfo/fetchScale',
      payload: { scaleId: compose },
    });
  };

  const fetchObject = objectId => {
    dispatch({
      type: 'scaleComposeTesteeInfo/fetchObjectDetail',
      payload: { id: objectId },
    });
  };

  /**
   * 避免短時間內重複查詢
   */
  const { run: handleSearch } = useDebounceFn(number => {
    dispatch({
      type: 'scaleComposeTesteeInfo/fetchObject',
      payload: { number },
    });
  }, 500);

  const checkNext = ({ subScales, id }) => {
    /**
     * 人口學頁面為中間頁面.不增加到路由紀錄
     */

    if (subScales.length > 1) {
      // 多個子量表的答題
      router.replace({
        pathname: '/scale/compose/answer',
        query: { compose, id },
      });
    } else {
      // 直接打題
      router.replace({
        pathname: '/scale/compose/answer/single',
        query: { compose, id, subScale: subScales[0] },
      });
    }
  };

  const handleSubmit = () => {
    form.validateFields((err, values) => {
      // console.log('submit:', values);

      if (!err) {
        const testeeInfo = [];
        const { subScales } = values;

        Object.keys(values).forEach(key => {
          if (key !== 'subScales') {
            const v = {};
            v[key] = values[key];
            testeeInfo.push(v);
          }
        });

        console.log({
          compose,
          values: { user: object.id, subleScaleName: subScales, testeeInfo },
        });

        dispatch({
          type: 'scaleComposeTesteeInfo/createAnswer',
          payload: {
            compose,
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
    return { items: [...subScaleNames] };
  };

  const demographicsOnChange = values => {
    // 過濾空白
    const demographics = {};
    Object.keys(values).forEach(key => {
      if (values[key] !== '') {
        demographics[key] = values[key];
      }
    });

    /** 帶出子量表 */
    dispatch({
      type: 'scaleComposeTesteeInfo/fetchSubScaleNames',
      payload: { id: compose, demographics },
    });
  };

  useEffect(() => {
    fetchScale();
    return () => {
      dispatch({
        type: 'scaleComposeTesteeInfo/clear',
        payload: {},
      });
    };
  }, []);

  const subScaleInfo = getSubScaleInfo();

  if (scale) {
    console.log('scale.limits:', scale.limits);
  }

  return (
    <>
      <Header>
        <h2 style={{ textAlign: 'center' }}>个人信息</h2>
      </Header>
      <Paper style={{ margin: 20, paddingBottom: 10 }}>
        <form noValidate autoComplete="off">
          <AutoComplete
            label="人员代码"
            loading={loading}
            onInputChange={value => {
              const vs = value.split('.');
              if (vs.length === 1) {
                handleSearch(value);
              }
            }}
            onChange={({ value }) => {
              fetchObject(value);
            }}
            options={objects.content.map(i => {
              return {
                value: i.id,
                label: `${i.number}.${i.name}`,
              };
            })}
          />
          {object && (
            <div>
              {getFieldDecorator('name', {
                initialValue: object.name,
                rules: [{ required: true, message: '姓名不可为空' }],
              })(
                <TextField
                  {...getError({ errors: getFieldError('name') })}
                  className={classes.formControl}
                  label="姓名"
                  variant="outlined"
                />
              )}
              <Demographics
                object={object}
                form={form}
                limits={scale.limits || []}
                onChange={demographicsOnChange}
              />

              {/**
                 *  {getFieldDecorator('MONTHOLD', {
                rules: [{ required: true, message: '月齡必須輸入' }],
              })(<MonthLimit form={form} object={object} supportEarly={supportEarly()} />)}
                 */}

              {getFieldDecorator('subScales', {
                initialValue: scale.choiceType === 'SINGLE' ? [] : subScaleInfo.items,
                rules: [{ required: true, message: '子量表不可为空' }],
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

export default connect(({ scaleComposeTesteeInfo, loading }) => ({
  loading: loading.effects['scaleComposeTesteeInfo/fetchObject'],
  loadingObject: loading.effects['scaleComposeTesteeInfo/fetchObjectDetail'],
  submiting: loading.effects['scaleComposeTesteeInfo/createAnswer'],
  scale: scaleComposeTesteeInfo.scale,
  objects: scaleComposeTesteeInfo.objects,
  object: scaleComposeTesteeInfo.object,
  subScaleNames: scaleComposeTesteeInfo.subScaleNames,
}))(warp);
