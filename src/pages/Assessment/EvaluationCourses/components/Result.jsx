import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';

import { findTopReport, getGuide } from '@/pages/scale/service/compose';

import { truncate } from 'lodash';

import S0062_Chart1 from './S0062/Chart1';
import S0062_Chart2 from './S0062/Chart2';
import S0062_Chart3 from './S0062/Chart3';
import S0062_Chart4 from './S0062/Chart4';
import S0062_Chart5 from './S0062/Chart5';
import S0062_Chart6 from './S0062/Chart6';
import S0062_Chart7 from './S0062/Chart7';
import S0062_Chart8 from './S0062/Chart8';

import S0075_Chart1 from './S0075/Chart1';
import S0075_Chart2 from './S0075/Chart2';
import S0075_Chart3 from './S0075/Chart3';
import S0075_Chart4 from './S0075/Chart4';
import S0075_Chart5 from './S0075/Chart5';
import S0075_Chart6 from './S0075/Chart6';
import S0075_Chart7 from './S0075/Chart7';
import S0075_Chart8 from './S0075/Chart8';

const getQuestion = (map, no) => {
  const q = map[no];

  if (q) {
    const { objectAnswer, answerOptions, questionInfo } = q;
    const index = answerOptions.findIndex((e) => e.option === objectAnswer * 1);

    let result = {};

    if (questionInfo && questionInfo.trim().length > 0) {
      result = {
        name: questionInfo,
      };
    } else {
      result = {
        name: q.questionContent,
      };
    }

    if (index !== -1) {
      const children = answerOptions.map((i) => {
        const { optionContent } = i;
        return {
          name: optionContent,
        };
      });

      result = { ...result, score: answerOptions[index].optionScore, children };
    }

    return result;
  }

  console.log('lose question:',no,map)

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
  /**
   * 要帶出 S0062 和 SOO75 等綜合報告
   */
  const scaleCodes = ['S0062', 'S0075'];
  const [guide, setGuide] = useState();
  const [list, setList] = useState([]);

  const queryRecords = async (number) => {
    /**
     * 帶出最新一筆的綜合報告
     */
    const result = await findTopReport({ userNumber: number, codes: scaleCodes });

    if (result.length > 0) {
      const record = result[0];
      const data = await getGuide({ compose: record.scale, id: record.id, takeAnswer: truncate });
      setGuide(data);
      const newList = getData(data.reports, data.answers);
      console.log('newList', newList);
      setList(newList);
    } else {
      setList([]);
    }
  };

  useEffect(() => {
    if (user.visitingCodeV) {
      queryRecords(user.visitingCodeV);
    }
  }, [user.visitingCodeV]);

  const MAP = {
    S0062: [
      {
        key: 1,
        title: '综合发展',
        component: S0062_Chart1,
      },
      {
        key: 2,
        title: '感官知觉',
        component: S0062_Chart2,
      },
      {
        key: 3,
        title: '粗大动作',
        component: S0062_Chart3,
      },
      {
        key: 4,
        title: '精细动作',
        component: S0062_Chart4,
      },
      {
        key: 5,
        title: '生活自理',
        component: S0062_Chart5,
      },
      {
        key: 6,
        title: '沟通领域',
        component: S0062_Chart6,
      },
      {
        key: 7,
        title: '认知',
        component: S0062_Chart7,
      },
      {
        key: 8,
        title: '社会技能',
        component: S0062_Chart8,
      },
    ],
    S0075: [
      {
        key: 1,
        title: '综合发展',
        component: S0075_Chart1,
      },
      {
        key: 2,
        title: '感官知觉领域',
        component: S0075_Chart2,
      },
      {
        key: 3,
        title: '粗大动作领域',
        component: S0075_Chart3,
      },
      {
        key: 4,
        title: '精细动作领域',
        component: S0075_Chart4,
      },
      {
        key: 5,
        title: '生活自理领域',
        component: S0075_Chart5,
      },
      {
        key: 6,
        title: '语言沟通领域',
        component: S0075_Chart6,
      },
      {
        key: 7,
        title: '认知领域',
        component: S0075_Chart7,
      },
      {
        key: 8,
        title: '社会适应领域',
        component: S0075_Chart8,
      },
    ],
  };

  const getTabPane = () => {
    if (guide && guide.code && list.length > 0) {
      return MAP[guide.code].map((item) => (
        <Tabs.TabPane tab={item.title} key={item.key}>
          <item.component list={list} guide={guide} name={item.title} patientId={user.patientId} />
        </Tabs.TabPane>
      ));
    }
  };

  return <Tabs defaultActiveKey={1}>{getTabPane()}</Tabs>;
}

export default Result;
