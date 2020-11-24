import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Select } from 'antd';

import BaseInfoShow from '@/components/BaseInfoShow';

const layout = {
  labelCol: { span: 1 },
  wrapperCol: { span: 4 },
};

const ChildRehabilitation = () => {
  const [patientId, setPatientId] = useState();
  const onPatientIdChange = (id) => {
    setPatientId(id);
  }
  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  return (
    <PageContainer>
      <BaseInfoShow onPatientIdChange={onPatientIdChange} />
      <Card style={{ marginTop: 20 }}>
        <Form
          {...layout}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="报告类型"
            name="username"
          >
            <Select />
          </Form.Item>

        </Form>
      </Card>
    </PageContainer>
  );
};
export default ChildRehabilitation;
