import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Row,
  Col,
  Form,
  Select,
  Input,
  Image,
  Button,
  message,
  Tabs,
  Descriptions,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import { connect } from 'umi';

import './index.less';
import moment from 'moment';
import { getCheckAll, getCheckChildren } from '@/pages/Function/ColumnLocation/service';
import { getPatientInfoSingle } from '@/pages/Patriarch/ChildrenRecord/service';
import { getProjectAllProject } from '@/pages/Function/ResearchProject/service';
import {
  getPhysiquePatientInfo,
  getPhysiqueAllCaseCode,
  getPhysiqueList,
  getPhysiqueGraphData,
} from './service';

import BodyTemperatureSelect from './components/BodyTemperatureSelect';
import ChartsPer from '@/components/ChartsPer';
import ChartsStand from '@/components/ChartsStand';

const formItemLayout3 = {
  labelCol: { span: 6 },
  wrapperCol: {
    span: 14,
  },
};
const layout = {
  labelCol: {
    span: 10,
  },
};

const HealthCheckup = ({ dispatch, submitting }) => {
  const actionRef = useRef();

  const [form] = Form.useForm();
  const [baseInfo, setBaseInfo] = useState();
  const [patientId, setPatientId] = useState('771739876879560704');
  const [allCode, setAllCode] = useState([]);
  const [graphData, setGraphData] = useState();

  const [temperatureStateLevel1List, setTemperatureStateLevel1List] = useState([]);
  const [temperatureStateLevel2List, setTemperatureStateLevel2List] = useState([]);
  // 获取下拉信息
  const queryCheckAll = async () => {
    const res = await getCheckAll();
    setTemperatureStateLevel1List(res.filter((item) => item.type === 1)); // 体温状态id，医学检查栏位（体温状态类型，一级）
  };

  // 查询病历编号下拉
  const queryPhysiqueAllCaseCode = async () => {
    const res = await getPhysiqueAllCaseCode();
    setAllCode(res);
  };
  //查询研究编号
  // const queryProjectAllProject = async () => {
  //   const res = await getProjectAllProject();
  //   setAllProject(res);
  // };

  // 查询-曲线图数据
  const queryPhysiqueGraphData = async () => {
    if (baseInfo?.patientId) {
      const res = await getPhysiqueGraphData({ patientId: baseInfo.patientId });
      setGraphData(res);
    }
  };

  const queryCheckChildren = async (parentId) => {
    const res = await getCheckChildren({ parentId });
    setTemperatureStateLevel2List(res);
  };

  const temperatureSelectChange = (parentId) => {
    queryCheckChildren(parentId);
  };

  // 切换病例编号
  const caseCodeVSelectChange = async (code) => {
    const sub = await getPhysiquePatientInfo({ code });
    setBaseInfo(sub);
    setPatientId(sub.patientId);
    actionRef.current?.reload();
  };

  // 显示基本资料
  const handleGetBaseInfo = async () => {
    const res = await getPatientInfoSingle({ patientId });
    const sub = await getPhysiquePatientInfo({ code: res.caseCodeV });
    setBaseInfo({ ...res, ...sub });
  };

  // 生长曲线计算
  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (values) {
      const getValues = form.getFieldsValue(); // 获取最新文本值
      const postData = {
        ...getValues,
        patientId,
        visitingTime: moment(getValues.visitingTime).valueOf(),
      };
      dispatch({
        type: 'medicalExaminationAndHealthCheckup/create',
        payload: postData,
        callback: () => {
          actionRef.current?.reload();
          message.success('操作成功');
        },
      });
    }
  };

  const columns = [
    {
      title: '就诊时间',
      dataIndex: 'visitingTime',
      search: false,
      render: (_, record) => {
        return moment(record.visitingTime).format('YYYY-MM-DD');
      },
    },
    {
      title: '身高/CM',
      dataIndex: 'height',
      search: false,
    },
    {
      title: '体重/KG',
      dataIndex: 'weight',
      search: false,
    },
    {
      title: '头围/CM',
      dataIndex: 'headCircumference',
      search: false,
    },
    {
      title: '体温/度',
      dataIndex: 'bodyTemperature',
      search: false,
    },
  ];

  useEffect(() => {
    queryCheckAll();
    queryPhysiqueAllCaseCode();
    // queryProjectAllProject();
    queryPhysiqueGraphData();
  }, [baseInfo?.patientId]);

  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={18}>
            <Form className="base-show" form={form} {...layout}>
              <Row>
                <Col span={6}>
                  <Form.Item label="病历编号">
                    <Select value={baseInfo?.caseCodeV} showSearch onChange={caseCodeVSelectChange}>
                      {allCode.map((item) => (
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

              <div className="check">
                <Row>
                  <Col span={6}>
                    <Form.Item label="体格检查"></Form.Item>
                  </Col>
                </Row>
                <Row style={{ alignItems: 'baseline' }}>
                  <Col span={8}>
                    <Form.Item
                      label="身高"
                      name="height"
                      rules={[
                        {
                          required: true,
                          message: '请输入身高',
                        },
                        {
                          pattern: /^\d+(\.\d{0,1})?$/,
                          message: '请输入正确的数值（保留1位小数）',
                        },
                      ]}
                    >
                      <Input placeholder="请输入" addonAfter="CM" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...formItemLayout3}
                      label="体重"
                      name="weight"
                      rules={[
                        {
                          required: true,
                          message: '请输入体重',
                        },
                        {
                          pattern: /^\d+(\.\d{0,1})?$/,
                          message: '请输入正确的数值（保留1位小数）',
                        },
                      ]}
                    >
                      <Input placeholder="请输入" addonAfter="KG" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...formItemLayout3}
                      label="头围"
                      name="headCircumference"
                      rules={[
                        {
                          required: true,
                          message: '请输入头围',
                        },
                        {
                          pattern: /^\d+(\.\d{0,1})?$/,
                          message: '请输入正确的数值（保留1位小数）',
                        },
                      ]}
                    >
                      <Input placeholder="请输入" addonAfter="CM" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={13}>
                    <Form.Item
                      labelCol={{ span: 6 }}
                      label="体温"
                      name="temperatureStateLevel1"
                      rules={[
                        {
                          required: true,
                          message: '请选择',
                        },
                      ]}
                    >
                      <Select placeholder="请选择" onChange={temperatureSelectChange}>
                        {temperatureStateLevel1List.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.content}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: '请选择体温',
                        },
                      ]}
                      {...formItemLayout3}
                      name="bodyTemperature"
                    >
                      <BodyTemperatureSelect />
                    </Form.Item>
                  </Col>
                  <Col span={4} style={{ marginLeft: '-13%' }}>
                    <Form.Item
                      name="temperatureStateLevel2"
                      rules={[
                        {
                          required: true,
                          message: '请选择',
                        },
                      ]}
                    >
                      <Select placeholder="请选择">
                        {temperatureStateLevel2List.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.content}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Form>
          </Col>
          <Col span={6}>
            <div className="code">
              <Image
                width={200}
                src="https://img14.360buyimg.com/uba/s260x260_jfs/t1/32118/11/559/2782/5c3d81ecEbda0c0f1/5f2b637d11817204.png"
              />
              <div className="submit">
                <Button onClick={handleSubmit} loading={submitting} type="primary" className="mr8">
                  生长曲线计算
                </Button>
                <Button type="primary" onClick={handleGetBaseInfo}>
                  显示基本资料
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: 20 }}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="体格检查记录" key="1">
            <ProTable
              actionRef={actionRef}
              rowKey="id"
              request={(params, sorter, filter) => getPhysiqueList({ ...params, body: patientId })}
              columns={columns}
              search={false}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="百分位曲线图" key="2">
            <ChartsPer
              gender={baseInfo?.genderName}
              graphData={graphData}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="标准差单位曲线图" key="3">
            <ChartsStand
              gender={baseInfo?.genderName}
              graphData={graphData}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['medicalExaminationAndHealthCheckup/create'],
}))(HealthCheckup);
