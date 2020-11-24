import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Checkbox, Select, Input, Button, message } from 'antd';
import { connect } from 'umi';

import './index.less';
import { getComprehensiveAllSection } from '@/pages/Function/ColumnLocation/service';
import { getTrainAndTargetInfo } from '@/pages/Assessment/TrainingObjectives/service';
const layout = {
  labelCol: {
    span: 8,
  },
};

const BottomContent = ({ patientId, submitting, dispatch }) => {
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [cfCsList, setCfCsList] = useState([]);
  const [carefulFieldList, setCarefulFieldList] = useState([]);
  const [gmfcsList, setGmfcsList] = useState([]);

  const [roughActiveTypeList, setRoughActiveTypeList] = useState([]);
  const [roughActiveDetailLevelList, setRoughActiveDetailLevelList] = useState([]);

  const [form] = Form.useForm();

  const queryComprehensiveSectionAll = async () => {
    const res = await getComprehensiveAllSection();
    const data = res?.map((item) => {
      item.label = item.name;
      item.value = item.id;
      return item;
    });
    setPrescriptionList(data.filter((item) => item.type === 2)); // 康复处方
    setCfCsList(data.filter((item) => item.type === 3)); //言语社交领域CFCS
    setCarefulFieldList(data.filter((item) => item.type === 4)); //精细动作领域
    setGmfcsList(data.filter((item) => item.type === 5)); //粗大运动领域GMFCS

    const arr = [6, 7, 8, 9, 10];
    const description = data
      .filter((item) => arr.includes(item.type) && item.description)
      .map((item) => {
        item.label = item.description;
        item.value = item.type;
        return item;
      });
    setRoughActiveTypeList(description);
  };

  const onRoughActiveTypeChange = async (type, noClear) => {
    const res = await getComprehensiveAllSection();
    const data = res?.map((item) => {
      item.label = item.name;
      item.value = item.id;
      return item;
    });
    setRoughActiveDetailLevelList(data.filter((item) => item.type === type));
    if (!noClear) {
      form.setFields([
        {
          name: 'roughActiveDetailLevelId',
          value: '',
        },
      ]);
    }
  };

  const onFinish = (values) => {
    console.log(values);
    if (!patientId) {
      return message.info('请先查看患者信息');
    }
    dispatch({
      type: 'assessmentAndTrainingObjectives/createSaveTrainAndTarget',
      payload: { patientId, ...values },
      callback: (res) => {
        res && message.success('操作成功');
      },
    });
  };
  const cancel = () => {
    form.resetFields();
    setRoughActiveDetailLevelList([]);
  };

  const queryTrainAndTargetInfo = async () => {
    const values = await getTrainAndTargetInfo({
      patientId,
    });
    if (values && values.data === null) {
      // 该患者没有进行操作
      cancel();
      return;
    }
    onRoughActiveTypeChange(values.roughActiveType, true);
    form.setFieldsValue(values);
  };

  useEffect(() => {
    queryComprehensiveSectionAll();
  }, []);

  useEffect(() => {
    if (patientId) {
      queryTrainAndTargetInfo();
    }
  }, [patientId]);

  return (
    <Form className="bottom-content" form={form} onFinish={onFinish}>
      <Row>
        <Col span={11}>
          <Card bordered={false} className="card-title" title="评定与分级">
            <Form.Item
              {...layout}
              label="言语社交领域CFCS"
              name="cfCsId"
              rules={[
                {
                  required: true,
                  message: '请选择言语社交领域CFCS',
                },
              ]}
            >
              <Select>
                {cfCsList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              {...layout}
              label="精细动作领域"
              name="carefulFieldId"
              rules={[
                {
                  required: true,
                  message: '请选择精细动作领域',
                },
              ]}
            >
              <Select>
                {carefulFieldList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              {...layout}
              label="粗大运动领域GMFCS"
              name="gmfcsId"
              rules={[
                {
                  required: true,
                  message: '请选择粗大运动领域GMFCS',
                },
              ]}
            >
              <Select>
                {gmfcsList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item {...layout} label="粗大运动领域细分类">
              <Input.Group compact>
                <Form.Item
                  style={{ width: '50%' }}
                  name="roughActiveType"
                  rules={[
                    {
                      required: true,
                      message: '请选择粗大运动领域细分类',
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    onChange={(id) => onRoughActiveTypeChange(id, false)}
                  >
                    {roughActiveTypeList.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  style={{ width: '50%' }}
                  name="roughActiveDetailLevelId"
                  rules={[
                    {
                      required: true,
                      message: '请选择',
                    },
                  ]}
                >
                  <Select style={{ width: '100%' }}>
                    {roughActiveDetailLevelList.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item {...layout} wrapperCol={{ offset: 8 }}>
              <Button className="mr8" htmlType="submit" loading={submitting} type="primary">
                提交
              </Button>
              <Button onClick={cancel}>取消</Button>
            </Form.Item>
          </Card>
        </Col>
        <Col span={11} offset={1}>
          <Card bordered={false} className="card-title" title="康复处方">
            <Form.Item
              name="prescriptionIds"
              rules={[
                {
                  required: true,
                  message: '请选择康复处方',
                },
              ]}
            >
              <Checkbox.Group
                style={{ margin: '8px 0' }}
                options={prescriptionList}
              ></Checkbox.Group>
            </Form.Item>
            {/* <Input /> */}
          </Card>
        </Col>
      </Row>
    </Form>
  );
};
export default connect(({ loading }) => ({
  submitting: loading.effects['assessmentAndTrainingObjectives/createSaveTrainAndTarget'],
}))(BottomContent);
