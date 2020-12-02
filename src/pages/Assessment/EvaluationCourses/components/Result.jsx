import React, { useState, useEffect } from 'react';
import { Radio, Tabs } from 'antd';

import { manage, getGuide } from '@/pages/scale/service/compose';

import S0062 from '@/pages/scale/compose/report/components/S0062';
import { truncate } from 'lodash';
import { formatDateFromTime } from '@/utils/format';

import Chart1 from './Chart1';
import Chart2 from './Chart2';
import Chart3 from './Chart3';
import Chart4 from './Chart4';
import Chart5 from './Chart5';
import Chart6 from './Chart6';
import Chart7 from './Chart7';
import Chart8 from './Chart8';

const getQuestion = (map, no) => {
  const q = map[no];

  if (q) {
    const { objectAnswer, answerOptions } = q;
    const index = answerOptions.findIndex((e) => e.option === objectAnswer * 1);

    let result = { name: q.questionContent };

    if (index !== -1) {
      result = { ...result, score: answerOptions[index].optionScore };
    }

    return result;
  }

  return {
    name: `X-${no}`,
    score: '',
  };
};

const getMap = (answer) => {
  const map = {};
  answer.answerQuestions.forEach((i) => {
    map[i.questionNo] = i;
  });
  return map;
};

const getData = (reports, answers) => {
  const data = [];
  reports.forEach((report, i) => {
    const { scaleName, scoringResults } = report;
    const map = getMap(answers[i]);
    const item = {
      name: scaleName,
      children: [],
    };

    scoringResults.forEach((result) => {
      const { scope, score, scoreName, questions } = result;
      if (scope === 'TOTAL_SCORE') {
        item.score = score * 1;
      } else {
        const child = {
          name: scoreName,
          score,
          children: questions.map((no) => {
            return getQuestion(map, no);
          }),
        };

        item.children.push(child);
      }
    });

    data.push(item);
  });

  return data;
};

function Result({ user = {} }) {
  const scaleCode = 'S0062';
  const [records, setRecords] = useState({ content: [] });
  const [guide, setGuide] = useState();
  const [list, setList] = useState([]);

  const queryRecords = async (number) => {
    const result = await manage({ values: { scaleCode, userNumber: number } });
    if (result.content.length > 0) {
      const record = result.content[0];
      const data = await getGuide({ compose: record.scale, id: record.id, takeAnswer: truncate });
      setGuide(data);
      setList(getData(data.reports, data.answers));
    }
    setRecords(result);
  };

  const queryGuide = async ({ compose, id }) => {
    setGuide(await getGuide({ compose, id, takeAnswer: truncate }));
  };

  useEffect(() => {
    if (user.visitingCodeV) {
      queryRecords(user.visitingCodeV);
    }
    return () => {};
  }, [user.visitingCodeV]);

  return (
    <>
      {/* {records.content.length > 1 && (
        <Radio.Group
          defaultValue={records.content[0].id}
          buttonStyle="solid"
          onChange={(e) => {
            records.content.forEach((i) => {
              if (i.id === e.target.value) {
                queryGuide({ compose: i.scale, id: i.id });
              }
            });
          }}
        >
          {records.content.map(({ id, reportDate }) => (
            <Radio.Button key={id} value={id}>
              {formatDateFromTime(reportDate)}
            </Radio.Button>
          ))}
        </Radio.Group>
      )} */}

      <Tabs defaultActiveKey={1}>
        <Tabs.TabPane tab="综合发展" key={1}>
          <Chart1 list={list} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="感官知觉" key={2}>
          <Chart2 list={list} patientId={user.patientId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="粗大动作" key={3}>
          <Chart3 list={list} patientId={user.patientId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="精细动作" key={4}>
          <Chart4 list={list} patientId={user.patientId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="生活自理" key={5}>
          <Chart5 list={list} patientId={user.patientId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="沟通" key={6}>
          <Chart6 list={list} patientId={user.patientId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="认知" key={7}>
          <Chart7 list={list} patientId={user.patientId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="社会技能" key={8}>
          <Chart8 list={list} patientId={user.patientId} />
        </Tabs.TabPane>
      </Tabs>

      {/* {guide && <S0062 {...guide} />} */}
    </>
  );
}

export default Result;
