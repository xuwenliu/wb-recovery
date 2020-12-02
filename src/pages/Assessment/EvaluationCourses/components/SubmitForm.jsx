import React, { useState, useEffect } from 'react';
import { Form, Checkbox, Button, Input, message } from 'antd';
import { getAllClass } from '@/pages/Educational/Curriculum/service';
import { connect } from 'umi';
import { getEvaluationSingle } from '../service';

function SubmitForm({ list = [], patientId, scaleType, name, submitting, dispatch }) {
  console.log('list', list);
  const [form] = Form.useForm();
  const [targetData, setTargetData] = useState([]);
  const [classList, setClassList] = useState([]);

  const queryAllClass = async () => {
    const res = await getAllClass();
    if (res) {
      res.map((item) => {
        item.label = item.name;
        item.value = item.id;
      });
      setClassList(res);
    }
  };
  const queryEvaluationSingle = async () => {
    if (!patientId) return;
    const res = await getEvaluationSingle({
      patientId,
      scaleType,
    });
    if (list.length != 0) {
      let data = [];
      let obj = {
        reason: res.reason,
        situation: res.situation,
        classIds: res.classIds,
      };
      list.forEach((item) => {
        if (item.name === name) {
          data = item.children.map((sub) => {
            obj[sub.name] = [];
            sub.children.map((three) => {
              three.label = three.name;
              three.value = three.name;
              if (three.score * 1 < 3) {
                obj[sub.name].push(three.name);
              }
              if (res.targets?.includes(three.name)) {
                obj[sub.name].push(three.name);
              }
              obj[sub.name] = [...new Set(obj[sub.name])];
              return three;
            });
            return sub;
          });
        }
      });
      form.setFieldsValue(obj); // 小于3分的选中
      setTargetData(data);
    }
  };

  useEffect(() => {
    queryAllClass();
    queryEvaluationSingle();
  }, [list, patientId]);

  const onFinish = (values) => {
    let removeClassIds = { ...values };
    const target = [];
    delete removeClassIds.classIds;
    console.log(removeClassIds);
    Object.values(removeClassIds).forEach((item) => {
      if (item instanceof Array) {
        target.push(...item);
      }
    });
    const postData = {
      patientId,
      scaleType,
      target,
      reason: values.reason,
      situation: values.situation,
      classIds: values.classIds,
    };
    dispatch({
      type: 'assessmentAndEvaluationCourses/saveEvaluationEffects',
      payload: postData,
      callback: (res) => {
        if (res) {
          message.success('操作成功');
        }
      },
    });
  };

  const cancel = () => {
    form.resetFields();
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="现状分析" name="situation">
        <Input.TextArea rows={4} placeholder="请输入优势/劣势" />
      </Form.Item>
      <Form.Item label="原因推断" name="reason">
        <Input.TextArea rows={4} placeholder="生理、心理、社会功能；教学环境" />
      </Form.Item>
      <Form.Item label="发展目标" wrapperCol={{ offset: 2 }}>
        {targetData?.map((item, index) => (
          <Form.Item key={index} label={item.name} name={item.name}>
            <Checkbox.Group options={item.children}></Checkbox.Group>
          </Form.Item>
        ))}
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 2 }} label="课程选择" name="classIds">
        <Checkbox.Group options={classList}></Checkbox.Group>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 2 }}>
        <Button loading={submitting} onClick={() => form?.submit()} className="mr8" type="primary">
          提交
        </Button>
        <Button onClick={cancel} className="mr8">
          清空
        </Button>
        {/* <Button type="primary">打印</Button> */}
      </Form.Item>
    </Form>
  );
}
export default connect(({ loading }) => ({
  submitting: loading.effects['assessmentAndEvaluationCourses/saveEvaluationEffects'],
}))(SubmitForm);
