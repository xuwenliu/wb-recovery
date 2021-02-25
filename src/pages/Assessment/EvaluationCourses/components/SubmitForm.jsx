import React, { useState, useEffect } from 'react';
import { Form, Checkbox, Button, Input, message } from 'antd';
import { getAllClass } from '@/pages/Educational/Curriculum/service';
import { connect } from 'umi';
import { getEvaluationSingle } from '../service';
import { getAuth } from '@/utils/utils';
import Target from '@/components/Scale/Target';

function SubmitForm({ list = [], guide, patientId, scaleType, name, submitting, dispatch }) {
  console.log('guide', guide);
  console.log('list', list);
  const [form] = Form.useForm();
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
    let targets = [];
    if (res.targetVos) {
      if (res.targetVos[0]?.targets) {
        targets = res.targetVos[0].targets;
      }
    }
    let obj = {
      reason: res.reason,
      situation: res.situation,
      classIds: res.classIds,
      targets,
    };
    form.setFieldsValue(obj);
  };

  useEffect(() => {
    queryAllClass();
    queryEvaluationSingle();
  }, [list, patientId]);

  const onFinish = (values) => {
    const postData = {
      patientId,
      scaleType,
      ...values,
      targetJson: JSON.stringify([
        {
          name,
          reportDate: guide.reportDate,
          id: guide.id,
          scale: guide.scaleName,
          targets: values.targets || [],
        },
      ]),
    };
    delete postData.targets;
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
      {
        // 雙溪
        guide && guide.code === 'S0062' && list.length > 0 && (
          <Form.Item name="targets" label="发展目标" wrapperCol={{ offset: 2 }}>
            <Target tree={name} guide={guide} report={list} />
          </Form.Item>
        )
      }
      {
        // 早期疗育
        guide && guide.code === 'S0075' && list.length > 0 && (
          <Form.Item name="targets" label="发展目标" wrapperCol={{ offset: 2 }}>
            <Target tree={name} guide={guide} report={list} />
          </Form.Item>
        )
      }

      <Form.Item wrapperCol={{ offset: 2 }} label="课程选择" name="classIds">
        <Checkbox.Group options={classList}></Checkbox.Group>
      </Form.Item>
      {getAuth(35)?.canEdit && (
        <Form.Item wrapperCol={{ offset: 2 }}>
          <Button
            loading={submitting}
            onClick={() => form?.submit()}
            className="mr8"
            type="primary"
          >
            提交
          </Button>
          <Button onClick={cancel} className="mr8">
            清空
          </Button>
          <Button
            type="primary"
            onClick={() => {
              window.print();
            }}
          >
            打印
          </Button>
        </Form.Item>
      )}
    </Form>
  );
}
export default connect(({ loading }) => ({
  submitting: loading.effects['assessmentAndEvaluationCourses/saveEvaluationEffects'],
}))(SubmitForm);
