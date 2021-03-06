import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';

import BaseInfoShow from '@/components/BaseInfoShow';

import ScaleTrainingSuggest from '@/components/Scale/ScaleTrainingSuggest';
import TeachingEvaluation from '@/components/Scale/TeachingEvaluation';

import Result from './components/Result';
import Recipe from './components/Recipe';
import { getAuth } from '@/utils/utils';

const EvaluationCourses = () => {
  const [patientId, setPatientId] = useState();
  const [info, setInfo] = useState();
  const onPatientIdChange = (id) => {
    setPatientId(id);
  };
  const onAllInfoChange = (info) => {
    setInfo(info);
  };

  return (
    <PageContainer>
      <BaseInfoShow onPatientIdChange={onPatientIdChange} onAllInfoChange={onAllInfoChange} />
      <Card style={{ marginTop: 20 }}>
        <Tabs defaultActiveKey="1">
          {getAuth(33) && (
            <Tabs.TabPane tab="训练建议" key="1">
              <ScaleTrainingSuggest user={info} />
            </Tabs.TabPane>
          )}

          {getAuth(34) && (
            <Tabs.TabPane tab="教学评量" key="2">
              <TeachingEvaluation user={info} />
            </Tabs.TabPane>
          )}
          {getAuth(35) && (
            <Tabs.TabPane tab="评估结果分析表" key="3">
              <Result user={info} />
            </Tabs.TabPane>
          )}
          {getAuth(36) && (
            <Tabs.TabPane tab="康复处方" key="4">
              <Recipe patientId={patientId} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Card>
    </PageContainer>
  );
};
export default EvaluationCourses;
