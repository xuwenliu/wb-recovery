/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react';

import { useSnackbar } from 'notistack';
import Scale from '@/pages/scale/components/ScaleAnswer';
import { Modal } from 'antd-mobile';

import Image from '@/components/Common/Image';
import { minTime } from 'date-fns';

const { alert } = Modal;

const getRange = str => {
  const getMonth = monthStr => {
    const [year, month] = monthStr.split(':');
    return year * 12 + month * 1;
  };

  const [min, max] = str.split('-');

  return { min: getMonth(min), max: max === undefined ? 0 : getMonth(max) };
};

function RenderOptionContent({ option }) {
  const { optionScore, optionContent } = option;
  return <div>{`${optionScore}分.${optionContent}`}</div>;
}

/**
 * 畫面展示
 */
function QuestionContent({ model, question }) {
  const { scaleType, scaleName } = model;
  const { questionNo, questionContent } = question;
  const { title, month, position, steps } = JSON.parse(questionContent);

  return (
    <div>
      {steps ? (
        <div style={{ display: 'grid', gridTemplateColumns: '30% 70%' }}>
          <div>项目 {questionNo}</div>
          <div>{title}</div>
          <div>年龄</div>
          <div>{month}月</div>
          <div>体位</div>
          <div>{position}</div>
          <div>步骤</div>
          <div>{steps}</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '30% 70%' }}>
          <div>项目 {questionNo}</div>
          <div>{title}</div>
          <div>年龄</div>
          <div>{month}月</div>
          <div>体位</div>
          <div>{position}</div>
        </div>
      )}
      <div>
        <Image src={`/images/scale/pdms/${scaleType}-${scaleName}/项目${questionNo}.jpg`} />
      </div>
    </div>
  );
}

function Page({ model, answer, submit, testeeInfo }) {
  const { enqueueSnackbar } = useSnackbar();
  const [current, setCurrent] = useState(-1); // 代表尚未計算出跳轉位置
  const [top, seTop] = useState(false);
  const [bottom, seBottom] = useState(false);

  const getPre = ({ values, no }) => {
    return `${values[no - 2] || ''}${values[no - 1] || ''}${values[no] || ''}`;
  };

  const getNext = ({ values, no }) => {
    return `${values[no] || ''}${values[no + 1] || ''}${values[no + 2] || ''}`;
  };

  const isSubmit = nv => {
    alert('提示信息', '已经到达顶部和底部.是否直接送出？', [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => {
          submit(nv);
        },
      },
    ]);
  };

  const checkTop = ({ no, step, values, changeStep, setAnswerValues, questionSize }) => {
    if (getPre({ values, no }) === '111') {
      seTop(true);
      const nv = { ...values };
      for (let i = step; i <= questionSize; i += 1) {
        nv[i] = '1'; // 頂部補1
      }
      setAnswerValues(nv);
      enqueueSnackbar('到达顶部，该题后面的题目全部补为0分。', { variant: 'info' });
      if (bottom) {
        isSubmit(nv);
      } else if (current === 0) {
        isSubmit(nv);
      } else {
        alert('提示信息', '已到达顶部.是否跳转至底部?', [
          { text: '取消' },
          {
            text: '确定',
            onPress: () => {
              if (current !== 1) {
                changeStep(current - 1); // 當到頂部時.要跳到起始頁的前一題
              }
            },
          },
        ]);
      }
    }
  };

  const checkBottom = ({ no, step, values, changeStep, setAnswerValues, questionSize }) => {
    if (getNext({ values, no }) === '333') {
      seBottom(true);
      const nv = { ...values };
      for (let i = 1; i <= step; i += 1) {
        nv[i] = '3'; // 底部補3
      }
      setAnswerValues(nv);
      enqueueSnackbar('到达底部，该题前面的题目全部补为2分。', { variant: 'info' });
      if (top) {
        isSubmit(nv);
      } else {
        alert('提示信息', '已到达底部.是否跳转至顶部?', [
          { text: '取消' },
          {
            text: '确定',
            onPress: () => {
              if (current !== questionSize) {
                changeStep(current + 1); // 當到底部時.要跳到起始頁的下一題 current
              }
            },
          },
        ]);
      }
    }
  };

  const monitorAction = action => {
    if (action.type === 'ANSWER') {
      checkTop(action);
      checkBottom(action);
    }
  };

  const onScaleAnswerChange = action => {
    if (action.type === 'SKIP') {
      enqueueSnackbar(`自動定位到第 ${action.step + 1} 題`, { variant: 'info' });
    } else if (action.type === 'ANSWER') {
      monitorAction(action);
    }
  };

  const sortOptions = options => {
    options.sort((a, b) => b.optionScore * 1 - a.optionScore * 1);
  };

  const init = () => {
    const { scaleQuestions } = model;
    testeeInfo.forEach(t => {
      const [key, value] = t.split(':');
      if (key === 'MONTH') {
        let check = -1;
        scaleQuestions
          .sort((a, b) => a.questionNo * 1 - b.questionNo * 1)
          .forEach(({ questionNo, questionInfo }) => {
            if (questionInfo !== '') {
              const { min, max } = getRange(questionInfo);
              /**
              console.log(
                'no:',
                questionNo,
                'min:',
                min,
                'max:',
                max,
                'value:',
                value,
                questionInfo
              );
               */

              if (max) {
                if (value * 1 >= min && value * 1 <= max) {
                  const index = questionNo * 1 - 1;
                  check = index;
                }
              } else {
                // console.log('check ',value,min,value*1 === min);
                if (value * 1 === min) {
                  const index = questionNo * 1 - 1;
                  check = index;
                }
              }
            }
          });
        if (check === -1) {
          setCurrent(0);
        } else {
          setCurrent(check);
        }
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  return current === -1 ? null : (
    <Scale
      sortOptions={sortOptions}
      current={current}
      model={model}
      submit={submit}
      answer={answer}
      renderQuestionContent={QuestionContent}
      renderOptionContent={RenderOptionContent}
      onChange={onScaleAnswerChange}
    />
  );
}

export default Page;
