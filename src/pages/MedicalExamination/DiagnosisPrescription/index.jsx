import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';

import BaseInfoShow from '@/components/BaseInfoShow';
import HealthCheckupRecordList from '@/components/HealthCheckupRecordList';
import MedicalRecordList from '@/components/MedicalRecordList';
import AssessmentRecordList from '@/components/AssessmentRecordList';
import CreateCheckupRecord from '@/pages/MedicalExamination/DiagnosisPrescription/components/CreateCheckupRecord';
import BaseInfo from '@/pages/MedicalExamination/DiagnosisPrescription/components/BaseInfo';
import ChartsPer from '@/components/ChartsPer';
import ChartsStand from '@/components/ChartsStand';
import { getPhysiqueGraphData } from '@/pages/MedicalExamination/HealthCheckup/service';
import { getAuth } from '@/utils/utils';

const DiagnosisPrescription = () => {
  const [patientId, setPatientId] = useState();
  const [info, setInfo] = useState();
  const [graphData, setGraphData] = useState();

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

  useEffect(() => {
    queryPhysiqueGraphData();
  }, [info?.patientId]);

  return (
    <PageContainer>
      <BaseInfoShow onPatientIdChange={onPatientIdChange} onAllInfoChange={onAllInfoChange} />
      <Card style={{ marginTop: 20 }}>
        <Tabs defaultActiveKey="1">
          {getAuth(12) && (
            <Tabs.TabPane tab="本次就诊记录" key="1">
              <CreateCheckupRecord info={info} />
            </Tabs.TabPane>
          )}
          {getAuth(13) && (
            <Tabs.TabPane tab="体格检查记录" key="2">
              <HealthCheckupRecordList patientId={patientId} />
            </Tabs.TabPane>
          )}
          {getAuth(14) && (
            <Tabs.TabPane tab="百分位曲线图" key="3">
              <ChartsPer gender={info?.genderName} graphData={graphData} />
            </Tabs.TabPane>
          )}

          {getAuth(15) && (
            <Tabs.TabPane tab="标准差单位曲线图" key="4">
              <ChartsStand gender={info?.genderName} graphData={graphData} />
            </Tabs.TabPane>
          )}

          {getAuth(16) && (
            <Tabs.TabPane tab="基本资料" key="5">
              <BaseInfo authKey={16} patientId={patientId} />
            </Tabs.TabPane>
          )}
          {getAuth(17) && <Tabs.TabPane tab="检核自评" key="6"></Tabs.TabPane>}

          {getAuth(18) && (
            <Tabs.TabPane tab="就诊记录" key="7">
              <MedicalRecordList patientId={patientId} />
            </Tabs.TabPane>
          )}
          {getAuth(19) && (
            <Tabs.TabPane tab="测评记录" key="8">
              <AssessmentRecordList />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Card>
    </PageContainer>
  );
};
export default DiagnosisPrescription;
