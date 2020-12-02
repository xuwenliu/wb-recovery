import React, { useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, message } from 'antd';
import CitySelect from '../../../Patriarch/ChildrenRecord/Edit/components/CitySelect';
import { getUserInfo } from '../service';
import { connect } from 'umi';
import moment from 'moment';
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

const BaseInfo = ({ submitting, dispatch }) => {
  const [form] = Form.useForm();

  const queryUserInfo = async () => {
    const values = await getUserInfo();
    if (values) {
      const setData = {
        ...values,
        createTime: moment(values.createTime),
        job: values.roleVos?.map((item) => item.name).join(' '),
        regionAddress: {
          province: values.provinceCode,
          city: values.cityCode,
          area: values.regionCode,
          place: values.household,
        },
        nowAddress: {
          province: values.nowProvinceCode,
          city: values.nowCityCode,
          area: values.nowRegionCode,
          place: values.nowPlace,
        },
      };
      form.setFieldsValue(setData);
    }
  };
  useEffect(() => {
    queryUserInfo();
  }, []);
  const onFinish = (values) => {
    const postData = {
      ...values,
      provinceCode: values.regionAddress?.province,
      cityCode: values.regionAddress?.city,
      regionCode: values.regionAddress?.area,
      household: values.regionAddress?.place,
      nowProvinceCode: values.nowAddress?.province,
      nowCityCode: values.nowAddress?.city,
      nowRegionCode: values.nowAddress?.area,
      nowPlace: values.nowAddress?.place,
    };

    dispatch({
      type: 'functionAndAccount/update',
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
    queryUserInfo();
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
      <Form.Item name="nickName" label="账户昵称">
        <Input className="ml4" placeholder="请输入账户昵称" />
      </Form.Item>
      <Form.Item name="account" label="账户账号">
        <Input className="ml4" placeholder="请输入账户账号" />
      </Form.Item>

      <Form.Item name="job" label="员工职位">
        <Input className="ml4" disabled />
      </Form.Item>

      <Form.Item name="createTime" label="创建日期">
        <DatePicker
          disabled
          style={{ width: '50%' }}
          className="ml4"
          placeholder="请选择创建日期"
        />
      </Form.Item>
      <Form.Item
        name="mobile"
        label="手机号码"
        rules={[
          {
            pattern: /^1\d{10}$/,
            message: '手机号码格式错误！',
          },
        ]}
      >
        <Input className="ml4" placeholder="请输入联系电话" />
      </Form.Item>
      <Form.Item {...citySelectLayout} label="户籍所在地" name="regionAddress">
        <CitySelect />
      </Form.Item>

      <Form.Item {...citySelectLayout} label="现居住地址" name="nowAddress">
        <CitySelect />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
        <Button loading={submitting} className="mr8" type="primary" htmlType="submit">
          确定
        </Button>
        <Button onClick={cancel}>重置</Button>
      </Form.Item>
    </Form>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndAccount/update'],
}))(BaseInfo);
