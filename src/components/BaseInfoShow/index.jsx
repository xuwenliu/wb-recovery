import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Image, Button, Form } from 'antd';

import './index.less';
import moment from 'moment';
import { getPatientInfoSingle } from '@/pages/Patriarch/ChildrenRecord/service';

import {
  getPhysiquePatientInfo,
  getPhysiqueAllCaseCode,
} from '@/pages/MedicalExamination/HealthCheckup/service';
import { getAllCaseCode } from '@/pages/Assessment/TeamAssessment/service';
import { getSpecialEduAllCaseCode } from '@/pages/Rehabilitation/PersonalPlan/service';
import bingli from '@/assets/img/bingli.png';

let patientId = '771739876879560704';
const layout = {
  labelCol: {
    span: 10,
  },
};
const BaseInfoShow = ({ onPatientIdChange, onAllInfoChange, newUrl }) => {
  const [baseInfo, setBaseInfo] = useState();
  const [allCode, setAllCode] = useState([]);

  // 查询病历编号下拉
  const queryPhysiqueAllCaseCode = async () => {
    let res = [];
    if (newUrl === 'getAllCaseCode') {
      res = await getAllCaseCode();
      if (res.length) {
        setAllCode(res);
      }
    } else if (newUrl === 'getSpecialEduAllCaseCode') {
      res = await getSpecialEduAllCaseCode();
      if (res.length) {
        setAllCode(res);
      }
    } else {
      res = await getPhysiqueAllCaseCode();
      res && setAllCode(res);
    }
  };

  const caseCodeVSelectChange = async (code) => {
    const sub = await getPhysiquePatientInfo({ code });
    const res = await getPatientInfoSingle({ patientId: sub.patientId });
    setBaseInfo({ ...res, ...sub });
    onPatientIdChange(sub.patientId);
    onAllInfoChange && onAllInfoChange({ ...res, ...sub });
  };

  // 显示基本资料
  const handleGetBaseInfo = async () => {
    const res = await getPatientInfoSingle({ patientId });
    const sub = await getPhysiquePatientInfo({ code: res.caseCodeV });
    setBaseInfo({ ...res, ...sub });
    onPatientIdChange(sub.patientId);
    onAllInfoChange && onAllInfoChange({ ...res, ...sub });
  };

  useEffect(() => {
    queryPhysiqueAllCaseCode();
  }, []);

  return (
    <Card
      title={
        <>
          <Image preview={false} className="mr8" src={bingli} width={35} height={26} />
          病例基本资料
        </>
      }
    >
      <Row>
        <Col span={18}>
          <Form className="base-show" {...layout}>
            <Row>
              <Col span={6}>
                <Form.Item label="病历编号">
                  <Select
                    placeholder="请选择"
                    value={baseInfo?.caseCodeV}
                    showSearch
                    onChange={caseCodeVSelectChange}
                  >
                    {allCode?.map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="就诊编号">{baseInfo?.visitingCodeV}</Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="研究编号">{baseInfo?.projectName}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="姓名">{baseInfo?.name}</Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="性别">{baseInfo?.genderName}</Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="民族">{baseInfo?.ethnicName}</Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="出生日期">{baseInfo?.birthDay}</Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <Form.Item label="前次就诊">
                  {baseInfo?.lastVisitingTime
                    ? moment(baseInfo?.lastVisitingTime).format('YYYY-MM-DD')
                    : ''}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="就诊日期">{moment().format('YYYY-MM-DD')}</Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="就诊间隔">{baseInfo?.betweenTime}个月</Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="就诊年龄">{baseInfo?.betweenBirthTime}个月</Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <Form.Item label="体格检查">身高：{baseInfo?.physiqueCheckVo?.height}CM</Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="体重">{baseInfo?.physiqueCheckVo?.weight}KG</Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="头围">{baseInfo?.physiqueCheckVo?.headCircumference}CM</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <Form.Item labelCol={{ span: 3 }} label="体温">
                  {baseInfo?.physiqueCheckVo?.temperatureStateLevel1Name} &nbsp;&nbsp;
                  {baseInfo?.physiqueCheckVo?.bodyTemperature}度&nbsp;&nbsp;
                  {baseInfo?.physiqueCheckVo?.temperatureStateLevel2Name}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={6}>
          <div className="code">
            <Image
              width={200}
              src="https://img14.360buyimg.com/uba/s260x260_jfs/t1/32118/11/559/2782/5c3d81ecEbda0c0f1/5f2b637d11817204.png"
            />
            <div className="submit">
              <Button type="primary" onClick={handleGetBaseInfo}>
                显示基本资料
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default BaseInfoShow;
