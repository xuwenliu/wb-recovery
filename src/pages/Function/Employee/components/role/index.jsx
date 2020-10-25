import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, Form, Popconfirm, Tooltip, Select, Checkbox } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getRoleList, getDeptAllList, getDeptRoles, getRoleAllList } from '../../service';
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

const Role = (props) => {
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

  // 获取设置权限-复选框数据
  const queryRoleList = async () => {
    const res = await getRoleAllList();
    if (res) {
      const data = res.map((item) => {
        item.label = item.name;
        item.value = item.id;
        return item;
      });
      setRoleList(data);
    }
  };

  useEffect(() => {
    queryDeptList();
    queryRoleList(); // 全部权限
  }, []);

  // 删除
  const handleRemove = async (row) => {
    const hide = message.loading('正在删除');
    const { dispatch } = props;
    dispatch({
      type: 'functionAndEmployee/removeRoleType',
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
  // 编辑
  const handleUpdate = async (row) => {
    const { dispatch } = props;
    updateId = row.id;
    dispatch({
      type: 'functionAndEmployee/getInfoRoleType',
      payload: {
        id: row.id,
      },
      callback: (data) => {
        if (data) {
          data.entryTime = moment(data.entryTime);
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
        roleId: updateId,
        ...getValues,
        entryTime: moment(getValues.entryTime).valueOf(), // 时间传时间戳
      };
      dispatch({
        type: 'functionAndEmployee/createRoleType',
        payload: postData,
        callback: (res) => {
          if (!res) return;
          message.success(`${postData.roleId ? '修改' : '新增'}成功`);
          handleCancel();
          if (actionRef.current) {
            actionRef.current.reload();
          }
        },
      });
    }
  };

  const columns = [
    {
      title: '角色编号',
      dataIndex: 'code',
      formItemProps: {
        placeholder: '请输入角色编号/名称',
      },
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      search: false,
    },
    {
      title: '权限内容',
      dataIndex: 'permissionNames',
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
        request={(params, sorter, filter) => getRoleList({ ...params, body: params.code })}
        columns={columns}
      />
      <Modal
        title="角色信息"
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
              label="角色编号"
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入角色编号',
                },
              ]}
            >
              <Input disabled={updateId} placeholder="请输入角色编号" />
            </FormItem>
          </Tooltip>
          <FormItem
            {...formItemLayout}
            label="角色名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入角色名称',
              },
            ]}
          >
            <Input placeholder="请输入角色名称" />
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
            <Select placeholder="请选择部门">
              {deptList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="设置权限"
            name="permissionIds"
            rules={[
              {
                required: true,
                message: '请选择权限',
              },
            ]}
          >
            <Checkbox.Group options={roleList} />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndEmployee/createRoleType'],
}))(Role);

// function mapStateToProps(state) {
//   console.log('state', state);
// }
// export default connect(mapStateToProps)(Role);
