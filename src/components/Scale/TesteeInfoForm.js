import React, { useEffect } from 'react';
import { Form, InputNumber, Button } from 'antd';
import { parse } from 'date-fns';

import { getAgeByBirthday } from '@/pages/scale/util/age';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

function TesteeInfoForm({ compose, user, submit }) {
  const [form] = Form.useForm();
  const { birthDay } = { ...user };

  const onFinish = (values) => {
    submit({ compose, testeeInfo: [values] });
  };

  useEffect(() => {
    const birthday = parse(birthDay, 'yyyy-MM-dd', new Date());
    form.setFieldsValue({ YEAR: getAgeByBirthday(birthday) });

    return () => {};
  }, [user.visitingCodeV]);

  return (
    <Form {...layout} form={form} onFinish={onFinish}>
      <Form.Item
        shouldUpdate
        label="评估年龄"
        name="YEAR"
        rules={[
          {
            required: true,
            message: '請輸入年齡',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item {...tailLayout} style={{ paddingTop: '10px' }}>
        <Button type="primary" htmlType="submit">
          开始评估
        </Button>
      </Form.Item>
    </Form>
  );
}

export default TesteeInfoForm;
