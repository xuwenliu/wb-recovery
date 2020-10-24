import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, Form, Popconfirm, Tooltip, Select } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryRule, updateRule, addRule, removeRule } from '../../service';
import { connect, history } from 'umi';
const FormItem = Form.Item;
const { TextArea } = Input;

const handleAdd = async () => {
  history.push({
    pathname: '/function/place/edit',
  });
};

const handleUpdate = async (row) => {
  history.push({
    pathname: '/function/place/edit',
    query: {
      id: row.id,
    },
  });
};

const handleRemove = async (actionRef, row) => {
  const hide = message.loading('正在删除');
  const { dispatch } = props;
  dispatch({
    type: 'functionAndEmployee/remove',
    payload: {
      id: row.id,
    },
    callback: (res) => {
      hide();
      if (res) {
        message.success('删除成功，即将刷新');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('删除失败');
      }
    },
  });
};

const Department = (props) => {
  const { submitting } = props;
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 20,
      },
      md: {
        span: 24,
      },
    },
  };

  const columns = [
    {
      title: '部门编号',
      dataIndex: 'number',
      formItemProps: {
        placeholder: '请输入部门编号/名称',
      },
    },
    {
      title: '部门名称',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '层级',
      dataIndex: 'location',
      search: false,
    },
    {
      title: '部门人数',
      dataIndex: 'desc',
      search: false,
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button onClick={() => handleUpdate(record)} size="small" type="primary" className="mr8">
            编辑
          </Button>
          <Popconfirm
            title="确定删除该项数据吗？"
            onConfirm={() => handleRemove(actionRef, record)}
          >
            <Button danger size="small" type="primary">
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  const handleOk = async () => {
    const values = await form.validateFields(); //校验
    if (values) {
      const getValues = form.getFieldsValue(); // 获取最新文本值
    }
  };
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
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
    <>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => setVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
      />
      <Modal
        title="部门信息"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" loading={submitting} onClick={handleOk}>
            确定
          </Button>,
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          ,
        ]}
      >
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
              label="部门编号"
              name="no"
              rules={[
                {
                  required: true,
                  message: '请输入部门编号',
                },
              ]}
            >
              <Input placeholder="请输入部门编号" />
            </FormItem>
          </Tooltip>
          <FormItem
            {...formItemLayout}
            label="部门名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入部门名称',
              },
            ]}
          >
            <Input placeholder="请输入部门名称" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="部门层级"
            name="location"
            rules={[
              {
                required: true,
                message: '请选择部门层级',
              },
            ]}
          >
            <Select placeholder="请选择部门层级">
              <Select.Option value={1}>一级部门</Select.Option>
              <Select.Option value={2}>二级部门</Select.Option>
              <Select.Option value={3}>三级部门</Select.Option>
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="子部门"
            name="location"
            rules={[
              {
                required: true,
                message: '请选择子部门',
              },
            ]}
          >
            <Select placeholder="请选择子部门" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="部门职位"
            name="location"
            rules={[
              {
                required: true,
                message: '请选择部门职位',
              },
            ]}
          >
            <Select placeholder="请选择部门职位" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="部门主管"
            name="desc"
            rules={[
              {
                required: true,
                message: '请输入部门主管',
              },
            ]}
          >
            <Input placeholder="请输入部门主管" />
          </FormItem>

          {/* <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Button className="mr8" type="primary" htmlType="submit" loading={submitting}>
              确认
            </Button>
            <Button onClick={reset}>重置</Button>
          </FormItem> */}
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndEmployee/create'],
}))(Department);

// function mapStateToProps(state) {
//   console.log('state', state);
// }
// export default connect(mapStateToProps)(Department);
