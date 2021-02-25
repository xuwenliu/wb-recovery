import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Image, Button, Form } from 'antd';

import styles from './index.less';
import moment from 'moment';
import {
  getPatientInfoSingle,
  getPatientInfoSingleByScan,
} from '@/pages/Patriarch/ChildrenRecord/service';

import {
  getPhysiquePatientInfo,
  getPhysiqueAllCaseCode,
} from '@/pages/MedicalExamination/HealthCheckup/service';
import { getAllCaseCode } from '@/pages/Assessment/TeamAssessment/service';
import { getSpecialAllCaseCode } from '@/pages/Rehabilitation/PersonalPlan/service';
import bingli from '@/assets/img/bingli.png';
import { getQrCode } from '@/services/common';
import { initSocket } from '@/utils/utils';
import { split } from 'lodash';

const layout = {
  labelCol: {
    span: 10,
  },
};
const BaseInfoShow = ({ onPatientIdChange, onAllInfoChange, newUrl }) => {
  const [baseInfo, setBaseInfo] = useState();
  const [allCode, setAllCode] = useState([]);
  const [qrCode, setQrCode] = useState();

  // 查询病历编号下拉
  const queryPhysiqueAllCaseCode = async () => {
    let res = [];
    if (newUrl === 'getAllCaseCode') {
      res = await getAllCaseCode();
      if (res && res.length) {
        setAllCode(res);
      }
    } else if (newUrl === 'getSpecialAllCaseCode') {
      res = await getSpecialAllCaseCode();
      if (res && res.length) {
        setAllCode(res);
      }
    } else {
      res = await getPhysiqueAllCaseCode();
      if (res && res.length) {
        setAllCode(res);
      }
    }
  };

  const caseCodeVSelectChange = async (codeName) => {
    const code = codeName.split('-')[0];
    const sub = await getPhysiquePatientInfo({ code });
    const res = await getPatientInfoSingle({ patientId: sub.patientId });
    setBaseInfo({ ...res, ...sub });
    onPatientIdChange(sub.patientId);
    onAllInfoChange && onAllInfoChange({ ...res, ...sub });
  };

  const queryPatientInfoByQrCode = async (code) => {
    const res = await getPatientInfoSingleByScan({ code });
    const sub = await getPhysiquePatientInfo({ code: res.caseCodeV });
    setBaseInfo({ ...res, ...sub });
    onPatientIdChange(sub.patientId);
    onAllInfoChange && onAllInfoChange({ ...res, ...sub });
  };

  // 生成二维码-创建连接
  const queryQrCode = async () => {
    const res = await getQrCode();
    if (res) {
      setQrCode(res.data);
      initSocket(res.id, (code) => {
        // 收到扫码通知
        queryPatientInfoByQrCode(code);
      });
    }
  };

  useEffect(() => {
    queryQrCode();
    queryPhysiqueAllCaseCode();
    if (window.location.search) {
      const code = window.location.search.split('?code=')[1];
      caseCodeVSelectChange(code);
    }
  }, []);

  let code_name = '';
  if (baseInfo && baseInfo.caseCodeV && baseInfo.name) {
    code_name = `${baseInfo?.caseCodeV}-${baseInfo?.name}`;
  }

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
          <Form className={styles.baseShow} {...layout}>
            <Row>
              <Col span={12}>
                <Form.Item label="病历编号" labelCol={{ span: 5 }}>
                  <Select
                    placeholder="请选择"
                    value={code_name}
                    showSearch
                    virtual={false}
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
              <Col span={12}>
                <Form.Item labelCol={{ span: 5 }} label="就诊编号">
                  {baseInfo?.visitingCodeV}
                </Form.Item>
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
          <div className={styles.code}>
            <Image width={200} src={qrCode} />
            {/* <div className="submit">
              <Button type="primary" onClick={handleGetBaseInfo}>
                显示基本资料
              </Button>
            </div> */}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default BaseInfoShow;
