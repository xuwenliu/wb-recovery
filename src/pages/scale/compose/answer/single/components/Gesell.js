import React, { useState, useEffect } from 'react';
import { createForm } from 'rc-form';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Modal } from 'antd-mobile';

import Factory from '@/pages/scale/components/field/Factory';

const { alert } = Modal;

/**
 * https://material-ui.com/zh/components/accordion/
 */

function Page({ testeeInfo, model, submit, form }) {
  const { getFieldDecorator } = form;
  const { scaleQuestions } = model;
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.mediumScreen);
  const [currentStep, setCurrentStep] = useState(0);
  const [answerValues, setAnswerValues] = useState({});
  const [expanded, setExpanded] = React.useState({});
  const [records, setRecords] = useState([]);

  const warpSubmit = () => {
    const newValues = { ...answerValues };
    for (let i = 1; i <= scaleQuestions.length; i += 1) {
      if (newValues[i] === undefined || newValues[i] === '') {
        newValues[i] = '1';
      }
    }
    submit(newValues);
  };

  const getRecord = (page) => {
    if (records && records.length > 0) {
      return records[page];
    }
    return { tips: '', items: [] };
  };

  const { group, items } = getRecord(currentStep);

  const init = () => {
    const { scaleName, dimensions } = model;
    const mp = {};
    scaleQuestions.forEach((question) => {
      const { questionNo } = question;
      mp[questionNo] = question;
    });

    // 依照維度來做排序
    const list = [];
    if (scaleName === '评估状态') {
      list.push({ group: '', items: scaleQuestions });
    } else {
      dimensions.forEach((d) => {
        const qs = [];
        d.questions.forEach((no) => {
          qs.push(mp[no]);
        });

        list.push({ group: qs[0].tips, month: qs[0].questionInfo.replace('月', ''), items: qs });
      });
    }

    testeeInfo.forEach((t) => {
      const [key, value] = t.split(':');
      if (key === 'MONTH') {
        let check = -1;
        list
          .sort((a, b) => a.month * 1 - b.month * 1)
          .forEach(({ month }, index) => {
            if (check === -1 && month * 1 === value * 1) {
              check = index;
            }
            if (check === -1 && month * 1 >= value * 1) {
              check = index - 1;
            }
          });
        if (check === -1) {
          setCurrentStep(0);
        } else {
          setCurrentStep(check);
        }
      }
    });
    setRecords(list);
  };

  const changeStep = (nextStep) => {
    setCurrentStep(nextStep);
  };

  const isExpanded = (questionNo) => {
    if (expanded[questionNo] === undefined) {
      return true;
    }

    return expanded[questionNo];
  };

  const changeAnswer = (questionNo, value) => {
    const v = { ...answerValues };
    if (value === undefined) {
      expanded[questionNo] = true;
      delete v[questionNo];
    } else {
      expanded[questionNo] = false;
      v[questionNo] = value;
    }
    setAnswerValues(v);
    setExpanded(expanded);
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
            form.validateFields((err) => {
              if (!err) {
                changeStep(currentStep - 1);
              }
            });
          }}
        >
          上一页
        </Button>
      </Grid>,
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
              form.validateFields((err) => {
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
      </Grid>,
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
      </Grid>,
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
      </Button>,
    );

    const flag = mediumScreen ? '' : { justify: 'center', alignItems: 'center' };
    return (
      <Grid container {...flag}>
        {result}
      </Grid>
    );
  };

  const mark = ({ questionNo, scaleOptions }) => {
    const value = answerValues[questionNo];
    if (value) {
      const index = scaleOptions.findIndex((i) => i.option * 1 === value * 1);
      if (index !== -1) {
        return <Avatar>{scaleOptions[index].optionContent}</Avatar>;
      }
    }
  };

  const changeExpanded = (questionNo, exp) => {
    const v = { ...expanded };
    v[questionNo] = !!exp;
    setExpanded(v);
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
        {items.map((item) => (
          <ExpansionPanel
            key={item.questionNo}
            defaultExpanded
            expanded={isExpanded(item.questionNo)}
            onChange={(event, exp) => {
              changeExpanded(item.questionNo, exp);
            }}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              {mark({ questionNo: item.questionNo, scaleOptions: item.scaleOptions })}{' '}
              <Typography style={{ marginLeft: '5px', textAlign: 'center' }}>
                {item.questionContent}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {getFieldDecorator(`${item.questionNo}`, {
                initialValue: answerValues[`${item.questionNo}`] || '',
                onChange: (e) => {
                  changeAnswer(item.questionNo, e.target.value);
                },
                rules: [],
              })(
                <Factory
                  config={{
                    direction: 'horizontal',
                  }}
                  questionType={item.questionType}
                  scaleOptions={item.scaleOptions.sort((a, b) => a.option * 1 - b.option * 1)}
                />,
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </Paper>
      <div style={mediumScreen ? styleIpad : stylemobile}>{renderButton()}</div>
    </div>
  );
}

export default createForm({})(Page);
