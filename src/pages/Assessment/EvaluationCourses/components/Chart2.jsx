import React, { useState, useEffect } from 'react';
import { Chart } from '@antv/g2';
import { Form, Checkbox, Button } from 'antd';
import BraftEditor from 'braft-editor';

function Chart2({ list = [] }) {
  console.log('list', list);
  const [form] = Form.useForm();
  const [targetData, setTargetData] = useState([]);

  const init = () => {
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 400,
    });

    chart.data(list);
    chart.scale({
      name: {
        range: [0, 1],
      },
      score: {
        min: 0,
        nice: true,
      },
    });

    chart.tooltip({
      showCrosshairs: true, // 展示 Tooltip 辅助线
      shared: true,
    });

    chart.line().position('name*score');
    chart.point().position('name*score');

    chart.render();
  };

  useEffect(() => {
    if (list.length != 0) {
      // init();
      let data = [];
      let obj = {};
      list.forEach((item) => {
        if (item.name === '感官知觉') {
          data = item.children.map((sub) => {
            obj[sub.name] = [];
            sub.children.map((three) => {
              three.label = three.name;
              three.value = three.name;
              if (three.score * 1 < 3) {
                obj[sub.name].push(three.name);
              }
              return three;
            });
            return sub;
          });
        }
      });
      form.setFieldsValue(obj); // 小于3分的选中
      setTargetData(data);
    }
  }, [list]);

  const onFinish = (values) => {};
  const cancel = () => {
    form.resetFields();
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="现状分析">
        <BraftEditor placeholder="请输入优势/劣势" className="my-editor" />
      </Form.Item>
      <Form.Item label="原因推断：（生理、心理、社会功能；教学环境）">
        <BraftEditor className="my-editor" />
      </Form.Item>
      <Form.Item label="发展目标" wrapperCol={{ offset: 2 }}>
        {targetData?.map((item, index) => (
          <Form.Item key={index} label={item.name} name={item.name}>
            <Checkbox.Group options={item.children}></Checkbox.Group>
          </Form.Item>
        ))}
      </Form.Item>
      <Form.Item label="课程选择"></Form.Item>
      <Form.Item wrapperCol={{ offset: 2 }}>
        <Button htmlType="submit" className="mr8" type="primary">
          提交
        </Button>
        <Button onClick={cancel} className="mr8">
          取消
        </Button>
        <Button type="primary">打印</Button>
      </Form.Item>
    </Form>
  );
}
export default Chart2;
