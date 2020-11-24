import React from 'react';
import { Form, Input, Select, Button, DatePicker } from 'antd';
import CitySelect from '../../../Patriarch/ChildrenRecord/Edit/components/CitySelect';
const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 8,
  },
};
const citySelectLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 16,
  },
};

const BaseInfo = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
  };
  const cancel = () => {
    form.resetFields();
  };
  const checkAddress = (rule, value) => {
    if (!value || !value.province) {
      return Promise.reject('请选择省');
    }
    if (!value.city) {
      return Promise.reject('请选择市');
    }
    if (!value.area) {
      return Promise.reject('请选择区');
    }
    if (!value.place) {
      return Promise.reject('请输入详细地址');
    }
    return Promise.resolve();
  };

  return (
    <Form {...layout} name="user" onFinish={onFinish} form={form}>
      <Form.Item
        name="nickName"
        label="账户昵称"
        rules={[
          {
            required: true,
            message: '请输入账户昵称',
          },
        ]}
      >
        <Input className="ml4" placeholder="请输入账户昵称" />
      </Form.Item>
      <Form.Item
        name="account"
        label="账户账号"
        rules={[
          {
            required: true,
            message: '请输入账户账号',
          },
        ]}
      >
        <Input className="ml4" placeholder="请输入账户账号" />
      </Form.Item>
      <Form.Item
        name="job"
        label="员工职位"
        rules={[
          {
            required: true,
            message: '请选择员工职位',
          },
        ]}
      >
        <Select className="ml4" placeholder="请选择员工职位" />
      </Form.Item>
      <Form.Item
        name="createTime"
        label="创建日期"
        rules={[
          {
            required: true,
            message: '请选择创建日期',
          },
        ]}
      >
        <DatePicker style={{ width: '50%' }} className="ml4" placeholder="请选择创建日期" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="联系电话"
        rules={[
          {
            required: true,
            message: '请输入联系电话',
          },
        ]}
      >
        <Input className="ml4" placeholder="请输入联系电话" />
      </Form.Item>
      <Form.Item
        {...citySelectLayout}
        label="户籍所在地"
        name="regionAddress"
        rules={[
          {
            required: true,
            message: '请选择户籍所在地',
          },
          {
            validator: checkAddress,
          },
        ]}
      >
        <CitySelect />
      </Form.Item>

      <Form.Item
        {...citySelectLayout}
        label="现居住地址"
        name="nowAddress"
        rules={[
          {
            required: true,
            message: '请选择现居住地址',
          },
          {
            validator: checkAddress,
          },
        ]}
      >
        <CitySelect />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
        <Button className="mr8" type="primary" htmlType="submit">
          确定
        </Button>
        <Button onClick={cancel}>取消</Button>
      </Form.Item>
    </Form>
  );
};

export default BaseInfo;
