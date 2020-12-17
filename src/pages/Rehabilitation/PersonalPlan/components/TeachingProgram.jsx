import {
  Button,
  Select,
  message,
  Input,
  Form,
  Checkbox,
  Switch,
  DatePicker,
  Space,
  Tree,
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { ArrowLeftOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import { media, getAuth } from '@/utils/utils';
import { truncate } from 'lodash';

import { history, connect } from 'umi';
import moment from 'moment';

import { getSpecialPage, getAllClassAdd } from '../service';
import { getAllClass } from '@/pages/Educational/Curriculum/service';
import { getSpecialPackages, getAllClassOfPackage } from '../service';
import { getEmployeeAllList } from '@/pages/Function/Employee/service';
import { manage, getGuide } from '@/pages/scale/service/compose';

const getQuestion = (map, no) => {
  const q = map[no];

  if (q) {
    const { objectAnswer, answerOptions } = q;
    const index = answerOptions.findIndex((e) => e.option === objectAnswer * 1);

    let result = { title: q.questionContent, key: q.questionContent };

    if (index !== -1) {
      result = { ...result, score: answerOptions[index].optionScore };
    }

    return result;
  }

  return {
    title: `X-${no}`,
    key: `X-${no}`,
    score: '',
  };
};

const getMap = (answer) => {
  const map = {};
  answer.answerQuestions.forEach((i) => {
    map[i.questionNo] = i;
  });
  return map;
};

const getData = (reports, answers) => {
  const data = [];
  reports.forEach((report, i) => {
    const { scaleName, scoringResults } = report;
    const map = getMap(answers[i]);
    const item = {
      title: scaleName,
      key: scaleName,
      children: [],
      checkable: false,
    };

    scoringResults.forEach((result) => {
      const { scope, score, scoreName, questions } = result;
      if (scope === 'TOTAL_SCORE') {
        item.score = score * 1;
      } else {
        const child = {
          title: scoreName,
          key: scoreName,
          score,
          checkable: false,
          children: questions.map((no) => {
            return getQuestion(map, no);
          }),
        };

        item.children.push(child);
      }
    });

    data.push(item);
  });

  return data;
};

const TeachingProgram = ({ patientId, user = {}, submitting, dispatch, tabChange }) => {
  const scaleCode = 'S0062';
  const [list, setList] = useState([]);

  const queryRecords = async (number) => {
    const result = await manage({ values: { scaleCode, userNumber: number } });
    if (result.content.length > 0) {
      const record = result.content[0];
      const data = await getGuide({ compose: record.scale, id: record.id, takeAnswer: truncate });
      console.log('list', getData(data.reports, data.answers));
      setList(getData(data.reports, data.answers));
    }
  };

  useEffect(() => {
    if (user.visitingCodeV) {
      queryRecords(user.visitingCodeV);
    }
    return () => {};
  }, [user.visitingCodeV]);

  const onCheck = (checkedKeys, subIndex, name) => {
    const setValue = form.getFieldValue(name);
    setValue[subIndex].targets = checkedKeys;
    form.setFields([
      {
        name,
        value: setValue,
      },
    ]);
  };

  const actionRef = useRef();
  const [form] = Form.useForm();
  const [allClass, setAllClass] = useState([]); // 课程-列表筛选
  const [allPackage, setAllPackage] = useState([]); // 套餐
  const [employeeAllList, setEmployeeAllList] = useState([]); // 执行人
  const [isEdit, setIsEdit] = useState(false);

  const querySpecialPage = async (params) => {
    const res = await getSpecialPage({
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

  // 所有套餐
  const querySpecialPackages = async () => {
    if (!patientId) return;
    const res = await getSpecialPackages({ patientId });
    if (res) {
      setAllPackage(res);
    }
  };

  // 所有课程 用于列表筛选
  const queryAllClass = async () => {
    const res = await getAllClass();
    if (res) {
      setAllClass(res);
    }
  };

  // 切换套餐
  const onAllPackageChange = async (packageId) => {
    const res = await getAllClassOfPackage({
      patientId,
      packageId,
    });
    if (res) {
      const setValues = res.map((item) => {
        item.cycleStr = `1${item.cycleTypeName}${item.cycle}次`;
        item.classTimeStr = `${item.onceClassTime}${item.classTimeName}`;
        item.isShow = false;
        item.time = [
          item.startTime ? moment(item.startTime) : null,
          item.endTime ? moment(item.endTime) : null,
        ];
        item.teachingPlan = item.teachingPlan
          ? BraftEditor.createEditorState(item.teachingPlan)
          : '';
        item.checkedKeys = item.targets;
        return item;
      });
      form.setFields([
        {
          name: 'classOfPackageVos',
          value: setValues,
        },
      ]);
    }
  };

  // 增选课程
  const queryAllClassAdd = async () => {
    if (!patientId) return;
    const res = await getAllClassAdd({ patientId });
    if (res) {
      const setValues = res?.map((item) => {
        item.cycleStr = `1${item.cycleTypeName}${item.cycle}次`;
        item.classTimeStr = `${item.onceClassTime}${item.classTimeName}`;
        item.isShow = false;
        item.time = [
          item.startTime ? moment(item.startTime) : null,
          item.endTime ? moment(item.endTime) : null,
        ];
        item.teachingPlan = item.teachingPlan
          ? BraftEditor.createEditorState(item.teachingPlan)
          : '';
        item.checkedKeys = item.targets;
        return item;
      });
      form.setFields([
        {
          name: 'classOfPackageVos2',
          value: setValues,
        },
      ]);
    }
  };

  // 执行人
  const queryEmployeeAllList = async () => {
    const res = await getEmployeeAllList();
    if (res) {
      setEmployeeAllList(res);
    }
  };

  useEffect(() => {
    querySpecialPage();
    queryAllClassAdd();
    querySpecialPackages();
    queryEmployeeAllList();
  }, [patientId]);

  const columns = [
    {
      title: '训练日期',
      dataIndex: 'time',
      valueType: 'dateRange',
      render: (_, record) => {
        let str = '';
        if (record.startTime) {
          str = `${moment(record.startTime).format('YYYY-MM-DD')} 至 ${moment(
            record.endTime,
          ).format('YYYY-MM-DD')}`;
        }
        return str;
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
          <Button size="small" onClick={() => tabChange('3', record.classId)}>
            教学记录
          </Button>
        </>
      ),
    },
  ];

  const onBack = () => {
    setIsEdit(false);
    form.resetFields();
  };

  const handleAdd = async () => {
    setIsEdit(true);
    queryAllClassAdd();
    querySpecialPackages();
    queryEmployeeAllList();
  };

  const handleEditPlan = (isShow, subIndex) => {
    const setValues = form.getFieldValue('classOfPackageVos');
    setValues[subIndex]['isShow'] = isShow;
    form.setFields([
      {
        name: 'classOfPackageVos',
        value: setValues,
      },
    ]);
  };

  const handleEditPlanAdd = (isShow, subIndex) => {
    const setValues = form.getFieldValue('classOfPackageVos2');
    setValues[subIndex]['isShow'] = isShow;
    form.setFields([
      {
        name: 'classOfPackageVos2',
        value: setValues,
      },
    ]);
  };

  // 提交
  const handleSubmit = (subIndex, name) => {
    let values = form.getFieldValue(name)[subIndex];
    const postData = {
      startTime: moment(values.time[0]).valueOf(),
      endTime: moment(values.time[1]).valueOf(),
      executionId: values.executionId,
      planId: values.id,
      reason: values.reason,
      situation: values.situation,
      teachingPlan: values.teachingPlan ? values.teachingPlan.toHTML() : '',
      targets: values.targets,
    };
    dispatch({
      type: 'rehabilitationAndPersonalPlan/update',
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
            getAuth(40)?.canEdit && (
              <Button key="add" type="primary" onClick={() => handleAdd()}>
                编辑教案
              </Button>
            ),
          ]}
          request={(params, sorter, filter) => querySpecialPage(params)}
          columns={columns}
        />
      )}
      {isEdit && (
        <>
          <Button
            style={{ marginBottom: 30, float: 'right' }}
            onClick={onBack}
            icon={<ArrowLeftOutlined />}
          >
            返回
          </Button>
          <Form layout="vertical" form={form} autoComplete="off">
            <Form.Item
              wrapperCol={{ span: 4 }}
              label="康复处方"
              colon={false}
              name="packageId"
              rules={[{ required: true, message: '请选择套餐' }]}
            >
              <Select onChange={onAllPackageChange}>
                {allPackage.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.List name="classOfPackageVos">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, subIndex) => (
                    <>
                      <Space key={field.key}>
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
                          label="训练日期"
                          colon={false}
                          {...field}
                          name={[field.name, 'time']}
                          fieldKey={[field.fieldKey, 'time']}
                          rules={[{ required: true, message: '请选择训练日期' }]}
                        >
                          <DatePicker.RangePicker />
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
                            onChange={(checked) => handleEditPlan(checked, subIndex)}
                          />
                        </Form.Item>
                      </Space>
                      {form.getFieldValue('classOfPackageVos')[subIndex]?.isShow && (
                        <Space direction="vertical">
                          <Form.Item
                            label="现状分析"
                            colon={false}
                            {...field}
                            name={[field.name, 'situation']}
                            fieldKey={[field.fieldKey, 'situation']}
                          >
                            <Input.TextArea rows={4}></Input.TextArea>
                          </Form.Item>
                          <Form.Item
                            label="原因推断"
                            colon={false}
                            {...field}
                            name={[field.name, 'reason']}
                            fieldKey={[field.fieldKey, 'reason']}
                          >
                            <Input.TextArea rows={4}></Input.TextArea>
                          </Form.Item>
                          <Form.Item label="教学目标">
                            <Tree
                              checkable
                              treeData={list}
                              defaultExpandedKeys={
                                form.getFieldValue('classOfPackageVos')[subIndex]?.targets
                              }
                              onCheck={(checkedKeys) => {
                                onCheck(checkedKeys, subIndex, 'classOfPackageVos');
                              }}
                              checkedKeys={
                                form.getFieldValue('classOfPackageVos')[subIndex]?.targets
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            label="编辑教案"
                            colon={false}
                            {...field}
                            name={[field.name, 'teachingPlan']}
                            fieldKey={[field.fieldKey, 'teachingPlan']}
                          >
                            <BraftEditor
                              media={media()}
                              placeholder="请输入上课内容、动作、动作完成次数、教具等"
                              className="my-editor"
                            />
                          </Form.Item>

                          <Form.Item>
                            <Button
                              onClick={() => handleSubmit(subIndex, 'classOfPackageVos')}
                              type="primary"
                            >
                              提交
                            </Button>
                          </Form.Item>
                        </Space>
                      )}
                    </>
                  ))}
                </>
              )}
            </Form.List>

            <Form.Item label="增选课程" style={{ marginBottom: 0 }}></Form.Item>
            <Form.List name="classOfPackageVos2">
              {(subFields, { add, remove }) => (
                <>
                  {subFields.map((subField, subIndex) => (
                    <div key={subField.fieldKey}>
                      <Space key={subField.fieldKey}>
                        <Form.Item
                          label={subIndex === 0 && '课程名称'}
                          colon={false}
                          {...subField}
                          name={[subField.name, 'className']}
                          fieldKey={[subField.fieldKey, 'className']}
                        >
                          <Input disabled />
                        </Form.Item>
                        <Form.Item
                          label={subIndex === 0 && '课程频次'}
                          colon={false}
                          {...subField}
                          name={[subField.name, 'cycleStr']}
                          fieldKey={[subField.fieldKey, 'cycleStr']}
                        >
                          <Input disabled />
                        </Form.Item>
                        <Form.Item
                          label={subIndex === 0 && '课程时间'}
                          colon={false}
                          {...subField}
                          name={[subField.name, 'classTimeStr']}
                          fieldKey={[subField.fieldKey, 'classTimeStr']}
                        >
                          <Input disabled />
                        </Form.Item>
                        <Form.Item
                          label={subIndex === 0 && '执行人'}
                          colon={false}
                          {...subField}
                          name={[subField.name, 'executionId']}
                          fieldKey={[subField.fieldKey, 'executionId']}
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
                          label={subIndex === 0 && '训练日期'}
                          colon={false}
                          {...subField}
                          name={[subField.name, 'time']}
                          fieldKey={[subField.fieldKey, 'time']}
                          rules={[{ required: true, message: '请选择训练日期' }]}
                        >
                          <DatePicker.RangePicker />
                        </Form.Item>

                        <Form.Item
                          {...subField}
                          name={[subField.name, 'isShow']}
                          fieldKey={[subField.fieldKey, 'isShow']}
                          valuePropName="checked"
                        >
                          <Switch
                            checkedChildren="取消编缉"
                            unCheckedChildren="教案编缉"
                            onChange={(checked) => handleEditPlanAdd(checked, subIndex)}
                          />
                        </Form.Item>
                      </Space>
                      {form.getFieldValue('classOfPackageVos2')[subIndex]?.isShow && (
                        <Space direction="vertical">
                          <Form.Item
                            label="现状分析"
                            colon={false}
                            {...subField}
                            name={[subField.name, 'situation']}
                            fieldKey={[subField.fieldKey, 'situation']}
                          >
                            <Input.TextArea rows={4}></Input.TextArea>
                          </Form.Item>
                          <Form.Item
                            label="原因推断"
                            colon={false}
                            {...subField}
                            name={[subField.name, 'reason']}
                            fieldKey={[subField.fieldKey, 'reason']}
                          >
                            <Input.TextArea rows={4}></Input.TextArea>
                          </Form.Item>

                          <Form.Item label="教学目标">
                            <Tree
                              checkable
                              treeData={list}
                              defaultExpandedKeys={
                                form.getFieldValue('classOfPackageVos2')[subIndex]?.targets
                              }
                              onCheck={(checkedKeys) => {
                                onCheck(checkedKeys, subIndex, 'classOfPackageVos2');
                              }}
                              checkedKeys={
                                form.getFieldValue('classOfPackageVos2')[subIndex]?.targets
                              }
                            />
                          </Form.Item>

                          <Form.Item
                            label="编辑教案"
                            colon={false}
                            {...subField}
                            name={[subField.name, 'teachingPlan']}
                            fieldKey={[subField.fieldKey, 'teachingPlan']}
                          >
                            <BraftEditor
                              media={media()}
                              placeholder="请输入上课内容、动作、动作完成次数、教具等"
                              className="my-editor"
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              onClick={() => handleSubmit(subIndex, 'classOfPackageVos2')}
                              type="primary"
                            >
                              提交
                            </Button>
                          </Form.Item>
                        </Space>
                      )}
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </>
      )}
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['rehabilitationAndPersonalPlan/update'],
}))(TeachingProgram);
