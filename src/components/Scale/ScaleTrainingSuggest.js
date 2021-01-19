import React, { useState, useEffect } from 'react';
import { Space, Select } from 'antd';

import { manage, getSimpleSuggest } from '@/pages/scale/service/compose';
import ScaleSuggestList from '@/pages/scale/components/ScaleSuggestList';

import { formatDateFromTime } from '@/utils/format';

const { Option } = Select;

// import { getGuide } from '@/pages/scale/service/compose';

function ScaleTrainingSuggest({ user = {} }) {
  const [records, setRecords] = useState({ content: [] });
  const [suggests, setSuggests] = useState();
  const [checkSuggests, setCheckSuggests] = useState([]);

  const querySimpleSuggest = async (id) => {
    setSuggests(await getSimpleSuggest({ id }));
  };

  const queryRecords = async (number) => {
    setRecords(await manage({ values: { userNumber: number, suggest: true } }));
  };

  useEffect(() => {
    if (user.visitingCodeV) {
      queryRecords(user.visitingCodeV);
    }
    return () => {};
  }, [user.visitingCodeV]);

  return (
    <Space direction="vertical">
      <Select
        style={{ width: 300 }}
        // loading={recordsLoading}
        onChange={(value) => {
          querySimpleSuggest(value);
        }}
      >
        {records.content.map(({ id, scaleName, reportDate }) => (
          <Option key={id} value={id}>
            {scaleName} {formatDateFromTime(reportDate)}
          </Option>
        ))}
      </Select>
      {suggests && (
        <ScaleSuggestList
          items={suggests}
          value={checkSuggests}
          onChange={(checks) => {
            setCheckSuggests(checks);
          }}
        />
      )}
    </Space>
  );
}

export default ScaleTrainingSuggest;
