import React, { useState, useEffect } from 'react';
import { Space, Select } from 'antd';

import { manage, getSimpleSuggest } from '@/pages/scale/service/compose';
import { fetchEvaluationTargets } from '@/pages/scale/service/thirdparty';

import ScaleSuggestList from '@/pages/scale/components/ScaleSuggestList';

import { formatDateFromTime } from '@/utils/format';

const { Option } = Select;

/**
 * 1.量表的目標
 * 2.雙溪和早期的目標
 *
 * @param  param0
 */
function PersonalTrainingTarget({ user = {}, value = [], onChange }) {
  /**
   *
   */
  const [records, setRecords] = useState([]);

  const [suggests, setSuggests] = useState();
  
  /**
   * 帶出有目標的報告
   */
  const querySimpleSuggest = async (id) => {
    setSuggests(await getSimpleSuggest({ id }));
  };

  const convertTargetToSuggest = (targets) => {
    const eles = [];
    targets?.forEach((target) => {
      eles.push({
        no: target.key,
        desc: `长期目标：${target.desc}`,
      });
      if (target.items) {
        target.items.forEach((i) => {
          eles.push({
            no: i.key,
            desc: `短期目标：${target.desc}`,
          });
        });
      }
    });

    return eles;
  };

  const queryRecords = async (number) => {
    let list = [];
    const result = await manage({ values: { userNumber: number, suggest: true } });

    list = [...result.content];

    const targets = await fetchEvaluationTargets({ patientId: user.patientId });
    console.log('targets',targets)

    targets.forEach((target, i) => {
      list = [
        ...list,
        {
          id: target.id || `${target.scale}-${i}`,
          scaleName: target.scale,
          reportDate: target.reportDate || new Date().getTime(),
          suggest: convertTargetToSuggest(target.targets),
        },
      ];
    });

    setRecords(list);
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
        onChange={(changeValue) => {
          const item = records.find((i) => i.id === changeValue);
          if (item.suggest) {
            // 已經帶出來目標
            setSuggests(item.suggest);
          } else {
            querySimpleSuggest(changeValue);
          }
        }}
      >
        {records.map(({ id, scaleName, reportDate }) => (
          <Option key={id} value={id}>
            {scaleName} {formatDateFromTime(reportDate)}
          </Option>
        ))}
      </Select>
      {suggests && (
        <ScaleSuggestList
          showPlan
          showType={false}
          showSubScale={false}
          items={suggests}
          value={value}
          onChange={(checks) => {
            onChange(checks);
          }}
        />
      )}
    </Space>
  );
}

export default PersonalTrainingTarget;
