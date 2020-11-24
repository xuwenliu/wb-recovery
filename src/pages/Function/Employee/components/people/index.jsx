import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, Form, Popconfirm, Tooltip, Select, DatePicker } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getEmployeeList, getDeptAllList, getDeptRoles } from '@/pages/Function/Employee/service';
import { connect } from 'umi';
const FormItem = Form.Item;
import moment from 'moment';

let updateId = '';

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

const People = (props) => {
  const { submitting } = props;
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [deptList, setDeptList] = useState([]);
  const [roleList, setRoleList] = useState([]);

  //获取所属部门
  const queryDeptList = async () => {
    const res = await getDeptAllList();
    if (res) {
      setDeptList(res);
    }
  };

  // 选择所属部门
  const handleDeptChange = (id) => {
    queryDeptRoles(id);
    form.setFields([
      {
        name: 'roleIds',
        value: [],
      },
    ]);
  };

  // 通过部门获取角色
  const queryDeptRoles = async (id) => {
    const res = await getDeptRoles({ id });
    if (res) {
      setRoleList(res);
    }
  };

  useEffect(() => {
    if (props.tab == 2) {
      queryDeptList();
      actionRef?.current?.reload();
    }
  }, [props.tab]);

  // 删除
  const handleRemove = async (row) => {
    const { dispatch } = props;
    dispatch({
      type: 'functionAndEmployee/remove',
      payload: {
        id: row.id,
      },
      callback: (res) => {
        if (res) {
          message.success('删除成功');
          actionRef?.current?.reload();
        } else {
          message.error('删除失败');
        }
      },
    });
  };
  // 编辑
  const handleUpdate = async (row) => {
    const { dispatch } = props;
    updateId = row.id;
    dispatch({
      type: 'functionAndEmployee/getInfo',
      payload: {
        id: row.id,
      },
      callback: (data) => {
        if (data) {
          data.entryTime = moment(data.entryTime);
          queryDeptRoles(data.deptId);
          form.setFieldsValue(data);
          setVisible(true);
        }
      },
    });
  };

  // 取消
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    updateId = '';
  };

  // 提交
  const handleOk = async () => {
    const { dispatch } = props;
    const values = await form.validateFields(); //校验
    if (values) {
      const getValues = form.getFieldsValue(); // 获取最新文本值
      const postData = {
        id: updateId,
        ...getValues,
        entryTime: moment(getValues.entryTime).valueOf(), // 时间传时间戳
      };
      dispatch({
        type: 'functionAndEmployee/create',
        payload: postData,
        callback: (res) => {
          if (!res) return;
          message.success(`${postData.id ? '修改' : '新增'}成功`);
          handleCancel();
          actionRef?.current?.reload();
        },
      });
    }
  };

  const columns = [
    {
      title: '人员编号',
      dataIndex: 'code',
      formItemProps: {
        placeholder: '请输入人员编号/名称',
      },
    },
    {
      title: '入职日期',
      dataIndex: 'entryTime',
      search: false,
    },
    {
      title: '人员名称',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      search: false,
    },
    {
      title: '人员角色',
      dataIndex: 'roleNames',
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
          <Popconfirm title="确定删除该项数据吗？" onConfirm={() => handleRemove(record)}>
            <Button danger size="small" type="primary">
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

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
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={(params, sorter, filter) => getEmployeeList({ ...params, body: params.code })}
        columns={columns}
      />
      <Modal
        title="人员信息"
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
          style={{
            marginTop: 8,
          }}
          form={form}
          name="basic"
        >
          <Tooltip title="注：一经确认无法修改">
            <FormItem
              {...formItemLayout}
              label="人员编号"
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入人员编号',
                },
              ]}
            >
              <Input disabled={updateId} placeholder="请输入人员编号" />
            </FormItem>
          </Tooltip>
          <FormItem
            {...formItemLayout}
            label="人员名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入人员名称',
              },
            ]}
          >
            <Input placeholder="请输入人员名称" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="所属部门"
            name="deptId"
            rules={[
              {
                required: true,
                message: '请选择部门',
              },
            ]}
          >
            <Select onChange={handleDeptChange} placeholder="请选择部门">
              {deptList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="入职日期"
            name="entryTime"
            rules={[
              {
                required: true,
                message: '请选择入职日期',
              },
            ]}
          >
            <DatePicker style={{ width: '50%' }} placeholder="请选择入职日期" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="所属角色"
            name="roleIds"
            rules={[
              {
                required: true,
                message: '请选择角色',
              },
            ]}
          >
            <Select mode="multiple" allowClear placeholder="请选择角色">
              {roleList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="手机号码"
            name="mobile"
            rules={[
              {
                required: true,
                message: '请输入电话号码',
              },
            ]}
          >
            <Input placeholder="请输入手机号码" />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndEmployee/create'],
}))(People);
