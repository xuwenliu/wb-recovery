import { PlusOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Select, message, Input, Form, Space, Switch, DatePicker } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { FooterToolbar } from '@ant-design/pro-layout';
import { ArrowLeftOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';

import { history, connect } from 'umi';
import moment from 'moment';

import { getDetailPage, getSpecialEduSingle } from '../service';

import { getAllClass } from '@/pages/Educational/Curriculum/service';
import { getAllPackage } from '@/pages/Function/RehabilitationPlan/service';
import { getEmployeeAllList } from '@/pages/Function/Employee/service';

const TeachingProgram = ({ patientId, submitting, dispatch, tabChange }) => {
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [allClass, setAllClass] = useState([]); // 课程
  const [allPackage, setAllPackage] = useState([]); // 套餐
  const [employeeAllList, setEmployeeAllList] = useState([]); // 执行人

  const [isEdit, setIsEdit] = useState(false);
  const [updatePlanId, setUpdatePlanId] = useState();

  const queryDetailPage = async (params) => {
    const res = await getDetailPage({
      ...params,
      body: {
        patientId,
        classId: params?.className,
        startTime: params?.time ? moment(params.time[0]).valueOf() : null,
        endTime: params?.time ? moment(params.time[1]).valueOf() : null,
      },
    });
    if (res) {
      return res;
    }
  };

  const queryAllClass = async () => {
    const res = await getAllClass();
    if (res) {
      setAllClass(res);
    }
  };

  const queryAllPackage = async () => {
    const res = await getAllPackage();
    if (res) {
      setAllPackage(res);
    }
  };
  const queryEmployeeAllList = async () => {
    const res = await getEmployeeAllList();
    if (res) {
      setEmployeeAllList(res);
    }
  };

  useEffect(() => {
    queryDetailPage();
    queryAllPackage();
    queryEmployeeAllList();
    form.setFields([
      {
        name: 'specialEduPlanDetailBos',
        value: [
          {
            packageId: null,
            classOfPackageVos: [],
          },
        ],
      },
    ]);
  }, [patientId]);

  const columns = [
    {
      title: '训练日期',
      dataIndex: 'time',
      valueType: 'dateRange',
      render: (_, record) => {
        return `${moment(record.startTime).format('YYYY-MM-DD')}至${moment(record.endTime).format(
          'YYYY-MM-DD',
        )}`;
      },
    },
    {
      title: '课程',
      dataIndex: 'className',
      valueType: 'select',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select onFocus={allClass.length === 0 && queryAllClass} placeholder="请选择课程">
            {allClass.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '课程时间',
      dataIndex: 'onceClassTime',
      search: false,
      render: (_, record) => {
        return `${record.onceClassTime}${record.classTimeName}`;
      },
    },
    {
      title: '执行老师',
      dataIndex: 'executionName',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button onClick={() => handleUpdate(record)} size="small" type="primary" className="mr8">
            编辑教案
          </Button>

          <Button size="small" onClick={() => tabChange('3', record.classId)}>
            教学记录
          </Button>
        </>
      ),
    },
  ];

  const handleAdd = async () => {
    setIsEdit(true);
  };

  const handleUpdate = async (row) => {
    setUpdatePlanId(row.planId);
    const values = await getSpecialEduSingle({ planId: row.planId });
    const specialEduPlanDetailBos = values.specialPackageVos.map((parent) => {
      parent.classOfPackageVos = parent.specialEduPlanDetailVos.map((item) => {
        item.cycleStr = `1${item.cycleTypeName}${item.cycle}次`;
        item.classTimeStr = `${item.onceClassTime}${item.classTimeName}`;
        item.teachingPlan = item.teachingPlan
          ? BraftEditor.createEditorState(item.teachingPlan)
          : '';
        return item;
      });
      return parent;
    });
    setIsEdit(true);
    const setData = {
      time: [moment(values.startTime), moment(values.endTime)],
      specialEduPlanDetailBos,
    };
    form.setFieldsValue(setData);
  };

  const onAllPackageChange = (value, index) => {
    const classInfo = allPackage.filter((item) => item.id === value)[0];
    const oldValue = form.getFieldValue('specialEduPlanDetailBos');
    const newItem = {
      ...oldValue[index],
      classOfPackageVos: classInfo.classOfPackageVos.map((item) => {
        item.cycleStr = `1${item.cycleTypeName}${item.cycle}次`;
        item.classTimeStr = `${item.onceClassTime}${item.classTimeName}`;
        return item;
      }),
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
        name: 'specialEduPlanDetailBos',
        value: setValues,
      },
    ]);
  };

  const handleEditPlan = (isShow, index, subIndex) => {
    const setValues = form.getFieldValue('specialEduPlanDetailBos');
    setValues[index]['classOfPackageVos'][subIndex]['isShow'] = isShow;
    form.setFields([
      {
        name: 'specialEduPlanDetailBos',
        value: setValues,
      },
    ]);
  };

  const onBack = () => {
    setIsEdit(false);
    form.setFields([
      {
        name: 'specialEduPlanDetailBos',
        value: [
          {
            packageId: null,
            classOfPackageVos: [],
          },
        ],
      },
    ]);
  };

  const onFinish = (values) => {
    if (!patientId) {
      return message.info('请先查看患者信息');
    }
    const specialEduPlanDetailBos = [];
    values.specialEduPlanDetailBos.forEach((item) => {
      item.classOfPackageVos.forEach((sub) => {
        specialEduPlanDetailBos.push({
          executionId: sub.executionId,
          packageId: sub.packageId,
          classId: sub.classId,
          reason: sub.reason || '',
          situation: sub.situation || '',
          teachingPlan: sub.teachingPlan ? sub.teachingPlan.toHTML() : '',
        });
      });
    });

    const postData = {
      id: updatePlanId, // 有则是修改
      patientId,
      startTime: moment(values.time[0]).valueOf(),
      endTime: moment(values.time[1]).valueOf(),
      specialEduPlanDetailBos,
    };
    dispatch({
      type: 'rehabilitationAndPersonalPlan/create',
      payload: postData,
      callback: (res) => {
        if (res) {
          onBack();
          message.success('操作成功');
        }
      },
    });
  };

  return (
    <>
      {!isEdit && (
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 80,
          }}
          toolBarRender={() => [
            <Button key="add" type="primary" onClick={() => handleAdd()}>
              <PlusOutlined /> 新增
            </Button>,
          ]}
          request={(params, sorter, filter) => queryDetailPage(params)}
          columns={columns}
        />
      )}
      {isEdit && (
        <>
          <Form hideRequiredMark form={form} onFinish={onFinish} autoComplete="off">
            <Form.Item
              label="训练日期"
              name="time"
              colon={false}
              rules={[{ required: true, message: '请选择训练日期' }]}
            >
              <DatePicker.RangePicker />
            </Form.Item>
            <Form.List name="specialEduPlanDetailBos">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={index}>
                      <div
                        key={field.key}
                        style={{ display: 'flex', marginBottom: 8, width: '50%' }}
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

                        {form.getFieldValue('specialEduPlanDetailBos').length > 1 && (
                          <MinusCircleOutlined
                            className="reduce"
                            onClick={() => remove(field.name)}
                          />
                        )}
                        {form.getFieldValue('specialEduPlanDetailBos').length - 1 === index && (
                          <PlusCircleOutlined className="add" onClick={() => add()} />
                        )}
                      </div>
                      <Form.Item>
                        <Form.List
                          {...field}
                          name={[field.name, 'classOfPackageVos']}
                          fieldKey={[field.fieldKey, 'classOfPackageVos']}
                        >
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((field, subIndex) => (
                                <div key={subIndex}>
                                  <Space>
                                    <Form.Item
                                      label="课程名称"
                                      colon={false}
                                      {...field}
                                      name={[field.name, 'className']}
                                      fieldKey={[field.fieldKey, 'className']}
                                    >
                                      <Input disabled />
                                    </Form.Item>
                                    <Form.Item
                                      label="课程频次"
                                      colon={false}
                                      {...field}
                                      name={[field.name, 'cycleStr']}
                                      fieldKey={[field.fieldKey, 'cycleStr']}
                                    >
                                      <Input disabled />
                                    </Form.Item>
                                    <Form.Item
                                      label="课程时间"
                                      colon={false}
                                      {...field}
                                      name={[field.name, 'classTimeStr']}
                                      fieldKey={[field.fieldKey, 'classTimeStr']}
                                    >
                                      <Input disabled />
                                    </Form.Item>
                                    <Form.Item
                                      label="执行人"
                                      colon={false}
                                      {...field}
                                      name={[field.name, 'executionId']}
                                      fieldKey={[field.fieldKey, 'executionId']}
                                      rules={[{ required: true, message: '请选择执行人' }]}
                                    >
                                      <Select style={{ width: 200 }}>
                                        {employeeAllList.map((item) => (
                                          <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>

                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'isShow']}
                                      fieldKey={[field.fieldKey, 'isShow']}
                                      valuePropName="checked"
                                    >
                                      <Switch
                                        checkedChildren="取消编缉"
                                        unCheckedChildren="教案编缉"
                                        onChange={(checked) =>
                                          handleEditPlan(checked, index, subIndex)
                                        }
                                      />
                                    </Form.Item>
                                  </Space>
                                  {form.getFieldValue('specialEduPlanDetailBos')[index][
                                    'classOfPackageVos'
                                  ][subIndex]['isShow'] && (
                                    <div>
                                      <Form.Item
                                        label="现状分析"
                                        colon={false}
                                        {...field}
                                        name={[field.name, 'situation']}
                                        fieldKey={[field.fieldKey, 'situation']}
                                        rules={[{ required: true, message: '请输入现状分析' }]}
                                      >
                                        <Input.TextArea rows={4}></Input.TextArea>
                                      </Form.Item>
                                      <Form.Item
                                        label="原因推断"
                                        colon={false}
                                        {...field}
                                        name={[field.name, 'reason']}
                                        fieldKey={[field.fieldKey, 'reason']}
                                        rules={[{ required: true, message: '请输入原因推断' }]}
                                      >
                                        <Input.TextArea rows={4}></Input.TextArea>
                                      </Form.Item>
                                      <Form.Item label="教学目标">
                                        <Input.TextArea rows={4}></Input.TextArea>
                                      </Form.Item>
                                      <Form.Item
                                        label="编辑教案"
                                        colon={false}
                                        {...field}
                                        name={[field.name, 'teachingPlan']}
                                        fieldKey={[field.fieldKey, 'teachingPlan']}
                                        rules={[{ required: true, message: '请输入' }]}
                                      >
                                        <BraftEditor
                                          placeholder="请输入上课内容、动作、动作完成次数、教具等"
                                          className="my-editor"
                                        />
                                      </Form.Item>
                                    </div>
                                  )}
                                </div>
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
          </Form>

          <FooterToolbar>
            <Button onClick={onBack} icon={<ArrowLeftOutlined />}>
              返回
            </Button>

            <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
              提交
            </Button>
          </FooterToolbar>
        </>
      )}
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['rehabilitationAndPersonalPlan/create'],
}))(TeachingProgram);
