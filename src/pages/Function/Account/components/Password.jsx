import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Row, Col, message, Button } from 'antd';
import { getFakeCaptcha } from '@/services/login';

const formItemLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    labelCol: {
      span: 2,
    },
    sm: {
      span: 16,
      offset: 2,
    },
  },
};

const Password = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [data, setData] = useState();
  const [count, setCount] = useState(60);
  const [timing, setTiming] = useState(false);

  const handleNextStep = async () => {
    const values = await form.validateFields();
    if (values) {
      setData(values);
      setStep(2);
    }
  };
  const onFinish = async (values) => {
    const postData = {
      ...data,
      ...values,
    };
    console.log(postData);
  };

  const handleCancel = () => {
    form.resetFields();
    setStep(1);
    setTiming(false);
  };

  const onGetCaptcha = useCallback(async () => {
    const phone = form.getFieldValue('phone');
    if (!phone) {
      message.error('请输入手机号码');
      return;
    }
    // const result = await getFakeCaptcha(phone);
    // if (result === false) {
    //   return;
    // }

    setTiming(true);
  }, []);

  useEffect(() => {
    let interval = 0;
    if (timing) {
      interval = window.setInterval(() => {
        setCount((preSecond) => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval); // 重置秒数
            return 60;
          }
          return preSecond - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timing]);

  return (
    <Form {...formItemLayout} form={form} name="register" onFinish={onFinish}>
      {step === 1 && (
        <>
          <Form.Item
            name="phone"
            label="手机号码"
            rules={[
              {
                required: true,
                message: '请输入手机号码',
              },
              {
                pattern: /^1\d{10}$/,
                message: '请输入正确的手机号码',
              },
            ]}
          >
            <Input placeholder="请输入手机号码" />
          </Form.Item>

          <Form.Item label="验证码">
            <Row gutter={8}>
              <Col span={16}>
                <Form.Item
                  name="captcha"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码',
                    },
                  ]}
                >
                  <Input placeholder="请输入验证码" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button disabled={timing} onClick={onGetCaptcha}>
                  {timing ? `${count} 秒` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </>
      )}
      {step === 2 && (
        <>
          <Form.Item
            name="password"
            label="输入新密码"
            rules={[
              {
                required: true,
                message: '请输入新密码',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="确认新密码"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请再次输入密码',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次密码不一致');
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
        </>
      )}

      <Form.Item {...tailFormItemLayout}>
        {step === 1 && (
          <Button onClick={handleNextStep} type="primary">
            下一步
          </Button>
        )}

        {step === 2 && (
          <>
            <Button className="mr8" type="primary" htmlType="submit">
              提交
            </Button>
            <Button onClick={handleCancel}>取消</Button>
          </>
        )}
      </Form.Item>
    </Form>
  );
};

export default Password;
