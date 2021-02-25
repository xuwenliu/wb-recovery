/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { Card, Result, Spin, Empty } from 'antd';
import TabScaleAnswer from '@/components/Scale/TabScaleAnswer';
import { useRequest } from '@umijs/hooks';
import { parse } from 'date-fns';
import { getAgeByBirthday } from '@/pages/scale/util/age';

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
  const [scales, setScales] = useState([]);
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

    // eslint-disable-next-line consistent-return
    return answer ? answer.scale : list[0].answers[0].scale;
  };

  /**
   * 帶出量表清單（依照年齡限制）
   */
  const { loading: loadingScale, run: fetchScale } = useRequest(searchScale, {
    manual: true,
    onSuccess: (result) => {
      const date = parse(user.birthDay, 'yyyy-MM-dd', new Date());
      const age = getAgeByBirthday(date);

      setScales(
        result.content.filter((i) => {
          const { limits } = i;

          if (limits && limits.YEAR) {
            const min = limits.YEAR.limit.MIN * 1;
            const max = limits.YEAR.limit.MAX * 1;
            
            if (age >= min && age <= max) {
              return true;
            }
          }

          return false;
        }),
      );
    },
  });

  /**
   * 帶出答題紀錄（最新的一筆未完成的答題）
   */
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
      {scales.length === 0 && <Empty description={<span>没有条件符合的量表</span>} />}
      {scales.map(({ id, scaleName }) => (
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
