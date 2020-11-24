import React, { useState, useEffect } from 'react';
import { createForm } from 'rc-form';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Alert from '@/components/Alert';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Modal } from 'antd-mobile';

const { alert } = Modal;

function Page({ model, submit, form }) {
  const { getFieldDecorator, getFieldError } = form;
  const { scaleQuestions } = model;
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.mediumScreen);
  const [currentStep, setCurrentStep] = useState(0);
  const [answerValues, setAnswerValues] = useState({});

  const [records, setRecords] = useState([]);

  const warpSubmit = () => {
    const newValues = { ...answerValues };
    for (let i = 1; i <= scaleQuestions.length; i += 1) {
      if (newValues[i] === undefined || newValues[i] === 'false') {
        newValues[i] = '1';
      } else {
        newValues[i] = '2';
      }
    }
    submit(newValues);
  };

  const getRecord = page => {
    if (records && records.length > 0) {
      return records[page];
    }
    return { tips: '', items: [] };
  };

  const { group, items } = getRecord(currentStep);

  const init = () => {
    const { scaleName, dimensions, scaleQuestions } = model;
    const mp = {};
    scaleQuestions.forEach(question => {
      const { questionNo } = question;
      mp[questionNo] = question;
    });

    // 依照維度來做排序
    const list = [];
    if (scaleName === '评估状态') {
      list.push({ group: '', items: scaleQuestions });
    } else {
      dimensions.forEach(d => {
        const qs = [];
        d.questions.forEach(no => {
          qs.push(mp[no]);
        });

        list.push({ group: qs[0].tips, items: qs });
      });
    }

    setRecords(list);
  };

  const changeStep = nextStep => {
    setCurrentStep(nextStep);
  };

  const changeAnswer = (questionNo, value) => {
    const v = { ...answerValues };
    v[questionNo] = value;
    setAnswerValues(v);
  };

  const finish = () => {
    alert('提示信息', '直接送出？', [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => {
          warpSubmit();
        },
      },
    ]);
  };

  const renderButton = () => {
    const result = [];

    result.push(
      <Grid key="pre-button" item>
        <Button
          disabled={currentStep === 0}
          variant="contained"
          color="primary"
          onClick={() => {
            form.validateFields(err => {
              if (!err) {
                changeStep(currentStep - 1);
              }
            });
          }}
        >
          上一页
        </Button>
      </Grid>
    );

    result.push(
      <Grid
        key="process"
        style={{ textAlign: 'center', lineHeight: '35px', marginLeft: '10px', marginRight: '10px' }}
        item
      >
        {currentStep === records.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            style={{ width: '100%' }}
            onClick={() => {
              form.validateFields(err => {
                if (!err) {
                  warpSubmit();
                } else {
                  console.log('err:', err);
                }
              });
            }}
          >
            送 出
          </Button>
        ) : (
          <div>
            {currentStep + 1} / {records.length}
          </div>
        )}
      </Grid>
    );

    result.push(
      <Grid key="next-button" item>
        <Button
          disabled={currentStep === records.length - 1}
          variant="contained"
          color="primary"
          onClick={() => {
            form.validateFields((err, values) => {
              if (!err) {
                changeStep(currentStep + 1);
                setAnswerValues({ ...answerValues, ...values });
              }
            });
          }}
        >
          下一页
        </Button>
      </Grid>
    );

    result.push(
      <Button
        style={{ marginLeft: '12px' }}
        disabled={currentStep === records.length - 1}
        variant="contained"
        color="primary"
        onClick={() => {
          finish();
        }}
      >
        结束
      </Button>
    );

    const flag = mediumScreen ? '' : { justify: 'center', alignItems: 'center' };
    return (
      <Grid container {...flag}>
        {result}
      </Grid>
    );
  };

  const questions = question => {
    const { scaleOptions } = question;

    scaleOptions.sort((a, b) => a.option * 1 - b.option * 1);

    const errors = getFieldError(`${question.questionNo}`);

    return [
      <div key={question.questionNo}>
        <FormControl style={{ display: 'block' }} key={question.questionNo} component="fieldset">
          <div
            style={{
              marginTop: 10,
              marginBottom: 10,
              marginLeft: 20,
              marginRight: 20,
              display: 'inline-block',
            }}
          >
            {getFieldDecorator(`${question.questionNo}`, {
              initialValue: answerValues[`${question.questionNo}`] || '',
              onChange: e => {
                changeAnswer(question.questionNo, e.target.value);
              },
              rules: [],
            })(
              <FormControlLabel
                value="2"
                control={<Switch />}
                label={
                  <div>
                    {question.questionNo}.{question.questionContent}
                  </div>
                }
              />
            )}
          </div>
        </FormControl>

        {errors ? <Alert severity="error">{errors.join(',')}</Alert> : null}
      </div>,
    ];
  };

  useEffect(() => {
    init();
  }, []);

  const stylemobile = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 7,
    backgroundColor: 'white',
    borderTop: '1px solid rgb(240,240,240)',
  };
  const styleIpad = { marginTop: 20, paddingBottom: 40, paddingLeft: 20 };

  return (
    <div>
      <Paper style={{ paddingBottom: '10px', margin: 10 }} elevation={3}>
        {group && <h3 style={{ paddingTop: 20, paddingLeft: 20 }}>{group}</h3>}
        {items.map(item => (
          <div>{questions(item)}</div>
        ))}
      </Paper>
      <div style={mediumScreen ? styleIpad : stylemobile}>{renderButton()}</div>
      {/**
         * <ScaleToolbar form={form} submit={submit} answerValues={answerValues}
        scaleQuestions={scaleQuestions} changeStep={changeStep} currentStep={currentStep} />
         */}
    </div>
  );
}

export default createForm({})(Page);
