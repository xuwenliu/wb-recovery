import React, { useState, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Card, Image, message, Col, Checkbox, Radio, Input, Button, Tabs } from 'antd';
import { history } from 'umi';
const { TabPane } = Tabs;
import Tab1 from './components/Tab1';
import Tab2 from './components/Tab2';
import Tab3 from './components/Tab3';
import Tab4 from './components/Tab4';
import Tab5 from './components/Tab5';
import Tab6 from './components/Tab6';
import Tab8 from './components/Tab8';
import BottomContent from './components/BottomContent';
import BaseInfoShow from '@/components/BaseInfoShow';

import xunlianmubiao from '@/assets/img/xunlianmubiao.png';

const haveOrNoList = [
  {
    codeCn: '有',
    code: 1,
  },
  {
    codeCn: '无',
    code: 2,
  },
];
import { queryCommonAllEnums, getSingleEnums } from '@/utils/utils';

const TrainingObjectives = () => {
  const [patientId, setPatientId] = useState();
  const [info, setInfo] = useState();
  const [yesList, setYesList] = useState([]);
  const [diseaseTypeList, setDiseaseTypeList] = useState([]);
  const [abilityLevelTypeList, setAbilityLevelTypeList] = useState([]);
  const [abnormalTypeList, setAbnormalTypeList] = useState([]);

  const onPatientIdChange = (id) => {
    setPatientId(id);
  };
  const onAllInfoChange = (info) => {
    setInfo(info);
  };

  const queryEnums = async () => {
    const newArr = await queryCommonAllEnums();
    setYesList(getSingleEnums('DiseaseConfirmType', newArr)); //确定 可能
    setAbilityLevelTypeList(getSingleEnums('AbilityLevelType', newArr)); //无异常，疑似发展迟缓，发展迟缓
    setAbnormalTypeList(getSingleEnums('AbnormalType', newArr)); //无异常，异常，疑似异常

    const diseaseTypeData = getSingleEnums('DiseaseType', newArr);
    const diseaseTypeListOptions = diseaseTypeData.map((item) => {
      item.label = item.codeCn;
      item.value = item.code;
      return item;
    });
    setDiseaseTypeList(diseaseTypeListOptions); //
  };

  useEffect(() => {
    queryEnums();
  }, []);
  return (
    <PageContainer className="team-assessment">
      <BaseInfoShow onPatientIdChange={onPatientIdChange} onAllInfoChange={onAllInfoChange} />
      <Card
        style={{ marginTop: 30 }}
        bordered={false}
        title={
          <>
            <Image preview={false} className="mr8" src={xunlianmubiao} width={30} height={30} />
            训练与目标
          </>
        }
      >
        <Tabs style={{ background: '#F2F3F7', padding: 20 }} tabPosition="left">
          <TabPane tab="粗大运动" key="1">
            <Tab1 patientId={patientId} />
          </TabPane>
          <TabPane tab="精细运动" key="2">
            <Tab2 patientId={patientId} />
          </TabPane>
          <TabPane tab="认知能力" key="3">
            <Tab3 patientId={patientId} />
          </TabPane>
          <TabPane tab="语言能力" key="4">
            <Tab4 patientId={patientId} />
          </TabPane>
          <TabPane tab="生活自理" key="5">
            <Tab5 patientId={patientId} />
          </TabPane>
          <TabPane tab="社会适应" key="6">
            <Tab6 patientId={patientId} />
          </TabPane>
          <TabPane tab="社会融合活动" key="7"></TabPane>
          <TabPane tab="环境与辅具" key="8">
            <Tab8 patientId={patientId} />
          </TabPane>
        </Tabs>
        <BottomContent patientId={patientId} />
      </Card>
      <FooterToolbar>
        <Button
          type="primary"
          onClick={() => {
            if (!info?.caseCodeV) {
              return message.info('请先查看患者信息');
            }
            history.push({
              pathname: '/assessment/evaluationcourses',
              query: {
                code: info.caseCodeV,
              },
            });
          }}
        >
          进入教学课程评量
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};
export default TrainingObjectives;
