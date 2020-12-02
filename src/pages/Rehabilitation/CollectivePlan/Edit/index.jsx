import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Select, message, Input, Form, Space, Card, Row, Col, Switch } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { ArrowLeftOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import { history, connect } from 'umi';
import { media } from '@/utils/utils';

import { getComprehensiveAllSection } from '@/pages/Function/ColumnLocation/service';
import { getCollectiveEduDetail } from '../service';
import { getAllClass } from '@/pages/Educational/Curriculum/service';
import { getEmployeeAllList } from '@/pages/Function/Employee/service';

const monthList = [];
for (let i = 1; i <= 12; i++) {
  monthList.push({
    id: i,
    name: `${i}月`,
  });
}
const Edit = ({ submitting, dispatch, location }) => {
  const { id: updatePlanId } = location.query;

  const [form] = Form.useForm();
  const [topicList, setTopicList] = useState([]);
  const [cycleTypeList, setCycleTypeList] = useState([]);
  const [classTimeList, setClassTimeList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [employeeAllList, setEmployeeAllList] = useState([]); // 执行人
  // 主题
  const queryComprehensiveAllSection = async () => {
    const res = await getComprehensiveAllSection();
    if (res) {
      const data1 = res.filter((item) => item.type === 12); // 课程频次
      const data2 = res.filter((item) => item.type === 13); // 课程时间
      setTopicList(res.filter((item) => item.type === 14));
      setCycleTypeList(data1);
      setClassTimeList(data2);
      if (updatePlanId) {
        queryCollectiveEduDetail();
      } else {
        form.setFields([
          {
            name: 'collectiveEduDetailBos',
            value: [
              {
                month: null,
                cycleTypeId: data1[0].id,
                classTimeId: data2[0].id,
                topicId: null,
                eventName: null,
              },
            ],
          },
        ]);
      }
    }
  };

  // 课程
  const queryAllClass = async () => {
    const res = await getAllClass();
    if (res) {
      setClassList(res);
    }
  };

  // 执行人
  const queryEmployeeAllList = async () => {
    const res = await getEmployeeAllList();
    if (res) {
      setEmployeeAllList(res);
    }
  };

  const handleEditPlan = (isShow, subIndex) => {
    const setValues = form.getFieldValue('collectiveEduDetailBos');
    setValues[subIndex]['isShow'] = isShow;
    form.setFields([
      {
        name: 'collectiveEduDetailBos',
        value: setValues,
      },
    ]);
  };

  const onFinish = (values) => {
    const postData = {
      ...values,
      id: updatePlanId,
      collectiveEduDetailBos: values.collectiveEduDetailBos.map((item) => {
        item.teachingPlan = item.teachingPlan ? item.teachingPlan.toHTML() : '';
        return item;
      }),
    };

    dispatch({
      type: 'rehabilitationAndCollectivePlan/create',
      payload: postData,
      callback: (res) => {
        if (res) {
          history.goBack();
          message.success('操作成功');
        }
      },
    });
  };

  const queryCollectiveEduDetail = async () => {
    const values = await getCollectiveEduDetail({
      planId: updatePlanId,
    });

    const setData = {
      ...values,
      collectiveEduDetailBos: values.collectiveEduPlanDetailVos.map((item) => {
        item.teachingPlan = BraftEditor.createEditorState(item.teachingPlan);
        return item;
      }),
    };
    form.setFieldsValue(setData);
  };

  useEffect(() => {
    queryComprehensiveAllSection();
    queryAllClass();
    queryEmployeeAllList();
  }, []);

  return (
    <PageContainer header={{ title: '' }}>
      <Card bordered={false}>
        <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish} autoComplete="off">
          <Row>
            <Col span={4}>
              <Form.Item name="topicId" rules={[{ required: true, message: '请选择主题' }]}>
                <Select placeholder="请选择主题">
                  {topicList.map((item) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col offset={1} span={4}>
              <Form.Item name="month" rules={[{ required: true, message: '请选择月份' }]}>
                <Select placeholder="请选择月份">
                  {monthList.map((item) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col offset={1} span={6}>
              <Form.Item name="eventName" rules={[{ required: true, message: '请输入活动名称' }]}>
                <Input placeholder="请输入活动名称" />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="collectiveEduDetailBos">
            {(subFields, { add, remove }) => (
              <>
                {subFields.map((subField, subIndex) => (
                  <Row key={subIndex}>
                    <Col span={4}>
                      <Form.Item
                        label="课程名称"
                        {...subField}
                        name={[subField.name, 'classId']}
                        fieldKey={[subField.fieldKey, 'classId']}
                        rules={[{ required: true, message: '请选择课程' }]}
                      >
                        <Select placeholder="请选择课程">
                          {classList.map((item) => (
                            <Select.Option value={item.id} key={item.id}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col offset={1} span={5}>
                      <Form.Item label="课程频次" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex' }}>
                          <Form.Item>
                            <Input
                              value={1}
                              disabled
                              addonAfter={
                                <Form.Item
                                  initialValue={cycleTypeList[0]?.id}
                                  noStyle
                                  name={[subField.name, 'cycleTypeId']}
                                >
                                  <Select>
                                    {cycleTypeList.map((item) => (
                                      <Select.Option key={item.id} value={item.id}>
                                        {item.name}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            name={[subField.name, 'cycle']}
                            rules={[
                              { required: true, message: '请输入' },
                              {
                                pattern: /^[0-9]*$/,
                                message: '请输入数字',
                              },
                            ]}
                          >
                            <Input addonAfter="次" />
                          </Form.Item>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col offset={1} span={3}>
                      <Form.Item
                        label="课程时间"
                        name={[subField.name, 'onceClassTime']}
                        rules={[
                          { required: true, message: '请输入课程时间' },
                          {
                            pattern: /^[0-9]*$/,
                            message: '请输入数字',
                          },
                        ]}
                      >
                        <Input
                          addonAfter={
                            <Form.Item
                              initialValue={classTimeList[0]?.id}
                              noStyle
                              name={[subField.name, 'classTimeId']}
                            >
                              <Select>
                                {classTimeList.map((item) => (
                                  <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col offset={1} span={4}>
                      <Form.Item
                        label="执行人"
                        {...subField}
                        name={[subField.name, 'executionId']}
                        fieldKey={[subField.fieldKey, 'executionId']}
                        rules={[{ required: true, message: '请选择执行人' }]}
                      >
                        <Select>
                          {employeeAllList.map((item) => (
                            <Select.Option value={item.id} key={item.id}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col offset={1} span={4} style={{ display: 'flex', alignItems: 'center' }}>
                      <Form.Item
                        {...subField}
                        style={{ marginBottom: 0, marginRight: 8 }}
                        name={[subField.name, 'isShow']}
                        fieldKey={[subField.fieldKey, 'isShow']}
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren="取消编缉"
                          unCheckedChildren="教案编缉"
                          onChange={(checked) => handleEditPlan(checked, subIndex)}
                        />
                      </Form.Item>
                      {form.getFieldValue('collectiveEduDetailBos').length > 1 && (
                        <MinusCircleOutlined
                          style={{ marginTop: 0 }}
                          className="reduce"
                          onClick={() => {
                            remove(subField.name);
                          }}
                        />
                      )}
                      {form.getFieldValue('collectiveEduDetailBos').length - 1 === subIndex && (
                        <PlusCircleOutlined
                          style={{ marginTop: 0 }}
                          className="add"
                          onClick={() => {
                            add();
                          }}
                        />
                      )}
                    </Col>

                    {form.getFieldValue('collectiveEduDetailBos')[subIndex]?.isShow && (
                      <Space>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              label="现状分析"
                              {...subField}
                              name={[subField.name, 'situation']}
                              fieldKey={[subField.fieldKey, 'situation']}
                              rules={[{ required: true, message: '请输入现状分析' }]}
                            >
                              <Input.TextArea rows={4}></Input.TextArea>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              label="原因推断"
                              {...subField}
                              name={[subField.name, 'reason']}
                              fieldKey={[subField.fieldKey, 'reason']}
                              rules={[{ required: true, message: '请输入原因推断' }]}
                            >
                              <Input.TextArea rows={4}></Input.TextArea>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item label="教学目标">
                              <Input.TextArea rows={4}></Input.TextArea>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              label="编辑教案"
                              {...subField}
                              name={[subField.name, 'teachingPlan']}
                              fieldKey={[subField.fieldKey, 'teachingPlan']}
                              rules={[{ required: true, message: '请输入' }]}
                            >
                              <BraftEditor
                                media={media()}
                                placeholder="请输入上课内容、动作、动作完成次数、教具等"
                                className="my-editor"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Space>
                    )}
                  </Row>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Card>
      <FooterToolbar>
        <Button onClick={() => history.goBack()} icon={<ArrowLeftOutlined />}>
          返回
        </Button>

        <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
          提交
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['rehabilitationAndCollectivePlan/create'],
}))(Edit);
