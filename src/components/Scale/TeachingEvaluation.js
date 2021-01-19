/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { Card, Result, Spin } from 'antd';
import TabScaleAnswer from '@/components/Scale/TabScaleAnswer';
import { useRequest } from '@umijs/hooks';
import {
  searchScale,
  getIncompleteAnswer,
  createAnswer,
  saveAnswerByValue,
  createReport,
} from '@/pages/scale/service/compose';
import TesteeInfoForm from './TesteeInfoForm';

const TYPE = '发育能力类评定量表.发育筛查类';

function TeachingEvaluation({ user = {} }) {
  const [scales, setScales] = useState({ content: [] });
  const [answers, setAnswers] = useState();
  const [finish, setFinish] = useState();

  const getAnswerCurrent = (list) => {
    if (list.length === 0) {
      return;
    }

    const answer = list[0].answers.find((i) => {
      if (i.finish === undefined || i.finish === false) {
        return true;
      }

      return false;
    });

    return answer ? answer.scale : list[0].answers[0].scale;
  };

  const { loading: loadingScale, run: fetchScale } = useRequest(searchScale, {
    manual: true,
    onSuccess: (result) => {
      setScales(result);
    },
  });

  const { loading: loadingFetchIncompleteAnswer, run: fetchIncompleteAnswer } = useRequest(
    getIncompleteAnswer,
    {
      manual: true,
      onSuccess: (result, params) => {
        const [{ compose, number }] = params;
        setAnswers({
          compose,
          number,
          list: result,
          current: getAnswerCurrent(result),
        });
      },
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading: loadingSubmitAnswer, run: submitAnswer } = useRequest(createAnswer, {
    manual: true,
    onSuccess: (result, params) => {
      const [{ compose }] = params;
      fetchIncompleteAnswer({ compose, number: user.visitingCodeV });
    },
  });

  const buildReport = async ({ compose, answer }) => {
    await createReport({ compose, answer });
    setFinish(true);
  };

  const { loading: loadingSubmit, run: submit } = useRequest(saveAnswerByValue, {
    manual: true,
    onSuccess: (result, ps) => {
      const [{ params }] = ps;

      if (result.report) {
        setFinish(true);
      } else {
        answers.list[0].answers.forEach((sa) => {
          if (sa.scale === params.subScale) {
            sa.finish = true;
          }
        });
        answers.current = getAnswerCurrent(answers.list);
        console.log('change answer currect:', answers.current);
        setAnswers({ ...answers });
        // fetchIncompleteAnswer({ compose: result.compose, number: user.visitingCodeV });
      }
    },
  });

  function AnswerStateCheck() {
    if (answers.list.length === 0) {
      return (
        <TesteeInfoForm
          compose={answers.compose}
          user={user}
          submit={({ compose, testeeInfo }) => {
            submitAnswer({
              compose,
              values: {
                userNumber: user.visitingCodeV,
                subleScaleName: [], // 全部子量表
                testeeInfo,
              },
            });
          }}
        />
      );
    }

    console.log('AnswerStateCheck render....', answers.current);

    return (
      <Spin spinning={loadingSubmit}>
        <TabScaleAnswer
          user={user}
          data={answers.list[0]}
          current={answers.current}
          submit={({ compose, answer, subScale, values }) => {
            submit({
              params: {
                compose,
                answer,
                subScale,
              },
              values,
            });
          }}
          createReport={(params) => {
            buildReport(params);
          }}
        />
      </Spin>
    );
  }

  useEffect(() => {
    if (user.visitingCodeV) {
      fetchScale({ scaleType: TYPE });
      setFinish();
      setAnswers();
    }
    return () => {};
  }, [user.visitingCodeV]);

  if (finish) {
    return (
      <Result
        status="success"
        title="答题完成"
        subTitle="答题完成.請到「评估结果分析表」檢視報告"
      />
    );
  }

  if (loadingFetchIncompleteAnswer) {
    return (
      <div style={{ textAlign: 'center', panding: '300px' }}>
        <Spin />
      </div>
    );
  }

  if (answers) {
    return <AnswerStateCheck />;
  }

  return (
    <Card loading={loadingScale}>
      {scales.content.map(({ id, scaleName }) => (
        <Card.Grid
          key={id}
          style={{
            width: '50%',
            textAlign: 'center',
          }}
          onClick={() => {
            fetchIncompleteAnswer({ compose: id, number: user.visitingCodeV });
          }}
        >
          {scaleName}
        </Card.Grid>
      ))}
    </Card>
  );
}

export default TeachingEvaluation;
