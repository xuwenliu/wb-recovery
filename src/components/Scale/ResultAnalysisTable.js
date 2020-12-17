import React, { useState, useEffect } from 'react';
import { Space, Radio } from 'antd';

import { manage, getGuide } from '@/pages/scale/service/compose';

import S0062 from '@/pages/scale/compose/report/components/S0062';
import { truncate } from 'lodash';
import { formatDateFromTime } from '@/utils/format';
import { getData } from '@/pages/scale/compose/report/components/S0062/util';

function ResultAnalysisTable({ user = {} }) {
  const scaleCode = 'S0062';
  const [records, setRecords] = useState({ content: [] });
  const [guide, setGuide] = useState();
  const [data, setData] = useState();
  
  const queryRecords = async (number) => {
    const result = await manage({ values: { scaleCode, userNumber: number } });
    if (result.content.length > 0) {
      const record = result.content[0];
      const g = await getGuide({ compose: record.scale, id: record.id, takeAnswer: truncate });
      setGuide(g);
      // setData(getData(g));
    }
    setRecords(result);
  };

  const queryGuide = async ({ compose, id }) => {
    // const guide = await getGuide({ compose, id, takeAnswer: truncate });
    // setData(getData(guide));
  };

  useEffect(() => {
    if (user.visitingCodeV) {
      queryRecords(user.visitingCodeV);
    }
    return () => {};
  }, [user.visitingCodeV]);

  return (
    <Space direction="vertical">
      {records.content.length > 1 && (
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
      )}
      {guide && <S0062 {...guide} />}
    </Space>
  );
}

export default ResultAnalysisTable;
