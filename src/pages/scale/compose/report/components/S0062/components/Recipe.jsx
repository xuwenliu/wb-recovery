import React, { useState, useEffect } from 'react';
import { Button, Select, message, Input, Form, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { FooterToolbar } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { getAllPackage } from '@/pages/Function/RehabilitationPlan/service';
import { getComprehensiveAllSection } from '@/pages/Function/ColumnLocation/service';
import { getAllClass } from '@/pages/Educational/Curriculum/service';

import { getEmployeeAllList } from '@/pages/Function/Employee/service';

const Recipe = ({ submitting, dispatch, patientId }) => {
  const [form] = Form.useForm();
  const [allPackage, setAllPackage] = useState([]); // 套餐

  const [cycleTypeList, setCycleTypeList] = useState([]);
  const [classTimeList, setClassTimeList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [employeeAllList, setEmployeeAllList] = useState([]); // 执行人

  const queryComprehensiveAllSection = async () => {
    const res = await getComprehensiveAllSection();
    if (res) {
      const data1 = res.filter((item) => item.type === 12); // 课程频次
      const data2 = res.filter((item) => item.type === 13); // 课程时间
      setCycleTypeList(data1);
      setClassTimeList(data2);
      if (patientId) {
        dispatch({
          type: 'assessmentAndEvaluationCourses/getInfo',
          payload: { patientId },
          callback: (values) => {
            console.log('values', values);

            const classPlanPackageVos = values.classPlanPackageVos
              ? values.classPlanPackageVos
              : [
                  {
                    packageId: null,
                    classPlanPackageDetailVos: [],
                  },
                ];

            // 增选课程
            const classPlanPackageDetailVos2 = values.classPlanPackageDetailVos
              ? values.classPlanPackageDetailVos
              : [{ classId: null, classTimeId: classTimeList[0]?.id }];
            form.setFieldsValue({ classPlanPackageVos, classPlanPackageDetailVos2 });
          },
        });
      } else {
        form.setFields([
          {
            name: 'classPlanPackageVos',
            value: [
              {
                packageId: null,
                classPlanPackageDetailVos: [],
              },
            ],
          },
          {
            name: 'classPlanPackageDetailVos2',
            value: [{ classId: null, classTimeId: classTimeList[0]?.id }],
          },
        ]);
      }
    }
  };

  const queryAllPackage = async () => {
    const res = await getAllPackage();
    if (res) {
      setAllPackage(res);
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

  const onAllPackageChange = (value, index) => {
    const classInfo = allPackage.filter((item) => item.id === value)[0];
    const oldValue = form.getFieldValue('classPlanPackageVos');
    const newItem = {
      ...oldValue[index],
      classPlanPackageDetailVos: classInfo.classOfPackageVos,
    };
    const setValues = oldValue.map((item, idx) => {
      if (index === idx) {
        if (item.packageId === value) {
          item = newItem;
        }
      }

      return item;
    });

    form.setFields([
      {
        name: 'classPlanPackageVos',
        value: setValues,
      },
    ]);
  };

  useEffect(() => {
    queryAllPackage();
    queryAllClass();
    queryComprehensiveAllSection();
    queryEmployeeAllList();
  }, [patientId]);

  const onFinish = (values) => {
    console.log(values);
    if (!patientId) {
      return message.info('请先查看患者信息');
    }
    const postData = [];
    values.classPlanPackageVos.forEach((item) => {
      item.classPlanPackageDetailVos.forEach((sub) => {
        postData.push({
          ...sub,
          patientId,
        });
      });
    });
    values.classPlanPackageDetailVos2.forEach((sub) => {
      postData.push({
        ...sub,
        patientId,
      });
    });
    dispatch({
      type: 'assessmentAndEvaluationCourses/create',
      payload: postData,
      callback: (res) => {
        if (res) {
          message.success('操作成功');
        }
      },
    });
  };

  return (
    <>
      <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish} autoComplete="off">
        <Form.List name="classPlanPackageVos">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={index}>
                  <div
                    key={field.key}
                    style={{ display: 'flex', marginBottom: 8, width: '50%', alignItems: 'center' }}
                    align="baseline"
                  >
                    <Form.Item
                      style={{ width: '50%', marginRight: 8 }}
                      {...field}
                      label="康复处方"
                      colon={false}
                      name={[field.name, 'packageId']}
                      fieldKey={[field.fieldKey, 'packageId']}
                      rules={[{ required: true, message: '请选择套餐' }]}
                    >
                      <Select onChange={(val) => onAllPackageChange(val, index)}>
                        {allPackage.map((item) => (
                          <Select.Option value={item.id} key={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {form.getFieldValue('classPlanPackageVos').length > 1 && (
                      <MinusCircleOutlined className="reduce" onClick={() => remove(field.name)} />
                    )}
                    {form.getFieldValue('classPlanPackageVos').length - 1 === index && (
                      <PlusCircleOutlined className="add" onClick={() => add()} />
                    )}
                  </div>
                  <Form.Item>
                    <Form.List
                      {...field}
                      name={[field.name, 'classPlanPackageDetailVos']}
                      fieldKey={[field.fieldKey, 'classPlanPackageDetailVos']}
                    >
                      {(subFields, { add, remove: subRemove }) => (
                        <>
                          {subFields.map((subField, subIndex) => (
                            <Row key={subIndex}>
                              <Col span={4}>
                                <Form.Item
                                  label="课程名称"
                                  colon={false}
                                  {...subField}
                                  name={[subField.name, 'className']}
                                  fieldKey={[subField.fieldKey, 'className']}
                                >
                                  <Input disabled />
                                </Form.Item>

                                {/* <Form.Item
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
                              </Form.Item> */}
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
                              <Col
                                offset={1}
                                span={4}
                                style={{ display: 'flex', alignItems: 'center' }}
                              >
                                {form.getFieldValue('classPlanPackageVos')[index][
                                  'classPlanPackageDetailVos'
                                ].length > 1 && (
                                  <MinusCircleOutlined
                                    style={{ marginTop: 0 }}
                                    className="reduce"
                                    onClick={() => {
                                      subRemove(subField.name);
                                    }}
                                  />
                                )}
                              </Col>
                            </Row>
                          ))}
                        </>
                      )}
                    </Form.List>
                  </Form.Item>
                </div>
              ))}
            </>
          )}
        </Form.List>

        <Form.Item label="增选课程" style={{ marginBottom: 0 }}></Form.Item>
        <Form.List name="classPlanPackageDetailVos2">
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
                        Î
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
                    {form.getFieldValue('classPlanPackageDetailVos2').length > 1 && (
                      <MinusCircleOutlined
                        style={{ marginTop: 0 }}
                        className="reduce"
                        onClick={() => {
                          remove(subField.name);
                        }}
                      />
                    )}
                    {form.getFieldValue('classPlanPackageDetailVos2').length - 1 === subIndex && (
                      <PlusCircleOutlined
                        style={{ marginTop: 0 }}
                        className="add"
                        onClick={() => {
                          add();
                        }}
                      />
                    )}
                  </Col>
                </Row>
              ))}
            </>
          )}
        </Form.List>
      </Form>
      <FooterToolbar>
        <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
          提交
        </Button>
      </FooterToolbar>
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['assessmentAndEvaluationCourses/create'],
}))(Recipe);
