import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, message, Radio, Select, Tooltip } from 'antd';
import { connect, FormattedMessage, formatMessage, history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';

import './style.less';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const Edit = (props) => {
  const { submitting } = props;
  const [form] = Form.useForm();
  const [title, setTitle] = useState('新增场地');

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
      xs: {
        span: 24,
      },
      sm: {
        span: 24,
      },
      md: {
        span: 24,
      },
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 2,
      },
    },
  };

  useEffect(() => {
    const { id } = props.location.query;
    if (id) {
      setTitle('编辑场地');
      getInfo();
    }
  }, []);

  const getInfo = () => {
    const { dispatch } = props;
    const { id } = props.location.query;
    dispatch({
      type: 'functionAndPlace/getInfo',
      payload: { id },
      callback: (res) => {
        res.editorState = BraftEditor.createEditorState(res.editorState);
        form.setFieldsValue(res);
      },
    });
  };

  const onFinish = (values) => {
    const { dispatch } = props;
    const { id } = props.location.query;
    values.editorState = values.editorState.toHTML();
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

  const reset = () => {
    form.resetFields();
    const { id } = props.location.query;
    if (id) {
      getInfo();
    }
  };

  return (
    <PageContainer
      title={title}
      extra={
        <Button onClick={() => history.goBack()} icon={<ArrowLeftOutlined />}>
          返回
        </Button>
      }
    >
      <Card bordered={false}>
        <Form
          // hideRequiredMark
          style={{
            marginTop: 8,
          }}
          form={form}
          name="basic"
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
        >
          <Tooltip title="注：一经确认无法修改">
            <FormItem
              {...formItemLayout}
              label="场地编号"
              name="no"
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
            name="location"
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
            name="desc"
            rules={[
              {
                required: true,
                message: '请输入场地说明',
              },
            ]}
          >
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder="请输入场地说明"
              rows={4}
            />
          </FormItem>

          <FormItem {...formEditorLayout} label="器材说明" name="editorState">
            <BraftEditor placeholder="请输入器材说明" className="my-editor" />
          </FormItem>

          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Button className="mr8" type="primary" htmlType="submit" loading={submitting}>
              确认
            </Button>
            <Button onClick={reset}>重置</Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndPlace/create'],
}))(Edit);

// function mapStateToProps(state) {
//   console.log('state', state);
// }
// export default connect(mapStateToProps)(Edit);
