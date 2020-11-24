import { ArrowLeftOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Input, Form, message, Tooltip } from 'antd';
import { connect, history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';

import './style.less';
const FormItem = Form.Item;

const Edit = ({ dispatch, submitting, location }) => {
  const [error, setError] = useState([]);
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 2,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  };
  const formEditorLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 2,
      },
    },
    wrapperCol: {
      span: 24,
    },
  };

  const getInfo = () => {
    const { id } = location.query;
    dispatch({
      type: 'functionAndPlace/getInfo',
      payload: { siteId: id },
      callback: (res) => {
        res.equipment = res.equipment ? BraftEditor.createEditorState(res.equipment) : '';
        form.setFieldsValue(res);
      },
    });
  };

  const onFinish = (values) => {
    const { id } = location.query;
    values.equipment = values.equipment ? values.equipment.toHTML() : '';
    values.id = id; // 更新时使用
    dispatch({
      type: 'functionAndPlace/create',
      payload: values,
      callback: (res) => {
        if (res) {
          message.success(`${id ? '修改' : '新增'}成功`);
          history.goBack();
        } else {
          message.error(`${id ? '修改' : '新增'}失败`);
        }
      },
    });
  };

  useEffect(() => {
    const { id } = location.query;
    if (id) {
      getInfo();
    }
  }, []);

  const onFinishFailed = (errorInfo) => {
    setError(errorInfo.errorFields);
  };

  const getErrorInfo = (errors) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    return (
      <span className="errorIcon">
        <CloseCircleOutlined />
        {errorCount}
      </span>
    );
  };

  return (
    <Form
      style={{
        marginTop: 8,
      }}
      form={form}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <PageContainer header={{ title: '' }}>
        <Card bordered={false}>
          <Tooltip title="注：一经确认无法修改">
            <FormItem
              {...formItemLayout}
              label="场地编号"
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入场地编号',
                },
              ]}
            >
              <Input placeholder="请输入场地编号" />
            </FormItem>
          </Tooltip>
          <FormItem
            {...formItemLayout}
            label="场地名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入场地名称',
              },
            ]}
          >
            <Input placeholder="请输入场地名称" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="场地位置"
            name="place"
            rules={[
              {
                required: true,
                message: '请输入场地位置',
              },
            ]}
          >
            <Input placeholder="请输入场地位置" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="场地说明"
            name="description"
            rules={[
              {
                required: true,
                message: '请输入场地说明',
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="请输入场地说明" />
          </FormItem>

          <FormItem {...formEditorLayout} label="器材说明" name="equipment">
            <BraftEditor placeholder="请输入器材说明" className="my-editor" />
          </FormItem>
        </Card>
      </PageContainer>
      <FooterToolbar>
        {getErrorInfo(error)}
        <Button onClick={() => history.goBack()} icon={<ArrowLeftOutlined />}>
          返回
        </Button>

        <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
          提交
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndPlace/create'],
}))(Edit);
