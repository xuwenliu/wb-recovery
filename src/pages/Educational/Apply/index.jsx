import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';

import BaseInfoShow from '@/components/BaseInfoShow';
import ScaleTrainingSuggest from '@/components/Scale/ScaleTrainingSuggest';
import TeachingProgram from '@/pages/Rehabilitation/PersonalPlan/components/TeachingProgram';
import TeachingRecord from '@/pages/Rehabilitation/PersonalPlan/components/TeachingRecord';
import CaseAssessmentRecord from '@/pages/Assessment/CaseAssessmentPlanning/components/CaseAssessmentRecord';
import HealthCheckupRecordList from '@/components/HealthCheckupRecordList';
import MedicalRecordList from '@/components/MedicalRecordList';
import AssessmentRecordList from '@/components/AssessmentRecordList';
import BaseInfo from '@/pages/MedicalExamination/DiagnosisPrescription/components/BaseInfo';
import ChartsPer from '@/components/ChartsPer';
import ChartsStand from '@/components/ChartsStand';
import { getPhysiqueGraphData } from '@/pages/MedicalExamination/HealthCheckup/service';

const Apply = () => {
  const [patientId, setPatientId] = useState();
  const [info, setInfo] = useState();
  const [graphData, setGraphData] = useState();
  const [tab, setTab] = useState('1');
  const [classId, setClassId] = useState();

  const onPatientIdChange = (id) => {
    setPatientId(id);
  };
  const onAllInfoChange = (info) => {
    setInfo(info);
  };

  // 查询-曲线图数据
  const queryPhysiqueGraphData = async () => {
    if (info?.patientId) {
      const res = await getPhysiqueGraphData({ patientId: info.patientId });
      setGraphData(res);
    }
  };

  const tabChange = (tab, classId) => {
    setTab(tab);
    setClassId(classId);
  };

  useEffect(() => {
    queryPhysiqueGraphData();
  }, [info?.patientId]);

  return (
    <PageContainer>
      <BaseInfoShow
        onPatientIdChange={onPatientIdChange}
        onAllInfoChange={onAllInfoChange}
        newUrl="getSpecialAllCaseCode"
      />
      <Card style={{ marginTop: 20 }}>
        <Tabs
          activeKey={tab}
          onChange={(tab) => {
            setTab(tab);
            setClassId(null);
          }}
        >
          <Tabs.TabPane tab="训练建议" key="1">
            <ScaleTrainingSuggest user={info} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="教学计划" key="2">
            <TeachingProgram patientId={patientId} tabChange={tabChange} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="教学记录" key="3">
            <TeachingRecord patientId={patientId} tab={tab} classId={classId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="病历基本资料" key="4">
            <CaseAssessmentRecord info={info} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="体格检查记录" key="5">
            <HealthCheckupRecordList patientId={patientId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="百分位曲线图" key="6">
            <ChartsPer gender={info?.genderName} graphData={graphData} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="标准差单位曲线图" key="7">
            <ChartsStand gender={info?.genderName} graphData={graphData} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="基本资料" key="8">
            <BaseInfo patientId={patientId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="检核自评" key="9"></Tabs.TabPane>
          <Tabs.TabPane tab="就诊记录" key="10">
            <MedicalRecordList patientId={patientId} />
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
