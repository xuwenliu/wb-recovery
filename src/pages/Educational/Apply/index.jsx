import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';

import BaseInfoShow from '@/components/BaseInfoShow';
import HealthCheckupRecordList from '@/components/HealthCheckupRecordList';
import MedicalRecordList from '@/components/MedicalRecordList';
import AssessmentRecordList from '@/components/AssessmentRecordList';

const Apply = () => {
  const [patientId, setPatientId] = useState();
  const onPatientIdChange = (id) => {
    setPatientId(id);
  }
  return (
    <PageContainer>
      <BaseInfoShow onPatientIdChange={onPatientIdChange} />
      <Card style={{ marginTop: 20 }}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="训练建议" key="1"></Tabs.TabPane>
          <Tabs.TabPane tab="教学计划" key="2"></Tabs.TabPane>
          <Tabs.TabPane tab="教学记录" key="3"></Tabs.TabPane>
          <Tabs.TabPane tab="病历基本资料" key="4"> </Tabs.TabPane>
          <Tabs.TabPane tab="体格检查记录" key="5">
            <HealthCheckupRecordList patientId={patientId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="百分位曲线图" key="6"></Tabs.TabPane>
          <Tabs.TabPane tab="标准差单位曲线图" key="7"></Tabs.TabPane>
          <Tabs.TabPane tab="基本资料" key="8"> </Tabs.TabPane>
          <Tabs.TabPane tab="检核自评" key="9"></Tabs.TabPane>
          <Tabs.TabPane tab="就诊记录" key="10">
            <MedicalRecordList />
          </Tabs.TabPane>
          <Tabs.TabPane tab="测评记录" key="11">
            <AssessmentRecordList />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};
export default Apply;
