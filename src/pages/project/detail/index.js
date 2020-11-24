/* eslint-disable no-console */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeader, Form, Input, DatePicker, Button, Card, Switch, Tag } from 'antd';

import ScaleWork from './ScaleWork';
import Demographics from './Demographics';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

function ProjectDetail({ dispatch, projectDetail }) {
  const { data = { close: false }, scales = {}, demographics } = projectDetail;
  const { works = [] } = data;

  const validateMessages = {
    required: '请输入${label}',
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const fetchScale = () => {
    dispatch({
      type: 'projectDetail/scales',
      payload: {},
    });
  };

  useEffect(() => {
    fetchScale();
    return () => {};
  }, []);

  const props = {
    dispatch,
    scales,
    works,
    demographics,
  };

  return (
    <PageHeader title="項目明細">
      <Card bordered={false}>
        <Form
          {...layout}
          initialValues={{}}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <FormItem label="量表" name="works" rules={[{ required: true }]}>
            <ScaleWork scales={scales} works={works} />
          </FormItem>
          <FormItem label="名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入" style={{ width: '100%' }} />
          </FormItem>
          <FormItem label="标签" name="tags" rules={[{ required: false }]}>
            <Tag closable>Tag 2</Tag>
          </FormItem>
          <FormItem label="代码" name="code">
            <Input placeholder="请输入" rules={[{ required: true }]} style={{ width: '100%' }} />
          </FormItem>
          <FormItem label="开关" name="close">
            <Switch />
          </FormItem>
          <FormItem label="时间" name="date">
            <RangePicker style={{ width: '100%' }} placeholder={['start', 'end']} />
          </FormItem>
          <FormItem label="说明" name="description">
            <TextArea style={{ minHeight: 32 }} rows={2} />
          </FormItem>
          <FormItem {...tailLayout} name="demographics">
            <Demographics {...props} />
          </FormItem>
          <FormItem style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button style={{ marginLeft: 8 }}>取消</Button>
          </FormItem>
        </Form>
      </Card>
    </PageHeader>
  );
}

export default connect(({ projectDetail, loading }) => ({
  projectDetail,
  logining: loading.effects['projectDetail/login'],
}))(ProjectDetail);
