import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, Form, Popconfirm, Tooltip, Select } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getDeptList, getDeptAllList, getEmployeeAllList, getDeptRoles } from '../../service';
import { connect } from 'umi';
const FormItem = Form.Item;

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

const Department = (props) => {
  console.log('props', props);
  const { submitting } = props;
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [deptList, setDeptList] = useState([]); //父级部门下拉
  const [deptMangerList, setDeptMangerList] = useState([]); //部门主管下拉
  const [roleList, setRoleList] = useState([]); //部门职位-父级部门下的-角色带出 下拉

  //获取父级部门
  const queryDeptList = async () => {
    const res = await getDeptAllList();
    if (res) {
      setDeptList(res);
    }
  };

  // 获取部门主管
  const queryDeptMangerList = async () => {
    const res = await getEmployeeAllList();
    if (res) {
      setDeptMangerList(res);
    }
  };

  // 通过选择的部门获取-部门职位(角色)
  const queryRoleList = async (id) => {
    const res = await getDeptRoles({ id });
    if (res) {
      setRoleList(res);
    }
  };

  const selectParentDeptChange = (id) => {
    queryRoleList(id);
  };

  useEffect(() => {
    if (props.tab == 1) {
      queryDeptList();
      queryDeptMangerList();
      actionRef?.current?.reload();
    }
  }, [props.tab]);

  // 删除
  const handleRemove = async (row) => {
    const hide = message.loading('正在删除');
    const { dispatch } = props;
    dispatch({
      type: 'functionAndEmployee/removeDepartment',
      payload: {
        id: row.id,
      },
      callback: (res) => {
        hide();
        if (res) {
          message.success('删除成功，即将刷新');
          actionRef?.current?.reload();
          queryDeptList(); //删除成功后-重新获取父级部门-如果删除后直接来修改则会有删除前的数据
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
    const updateData = {
      ...row,
      parentDeptId: row.id, // 设置父级部门id
    };
    form.setFieldsValue(updateData);
    setVisible(true);
    // dispatch({
    //   type: 'functionAndEmployee/getInfoDepartment',
    //   payload: {
    //     id: row.id,
    //   },
    //   callback: (data) => {
    //     if (data) {
    //       form.setFieldsValue(data);
    //       setVisible(true);
    //     }
    //   },
    // });
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
        deptId: updateId, // 修改使用
        deptName: getValues.name, // 修改使用
        ...getValues,
      };
      dispatch({
        type: 'functionAndEmployee/createDepartment',
        payload: postData,
        callback: (res) => {
          if (!res) return;
          message.success(`${postData.deptId ? '修改' : '新增'}成功`);
          handleCancel();
          actionRef?.current?.reload();
        },
      });
    }
  };

  const columns = [
    {
      title: '部门编号',
      dataIndex: 'code',
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
      title: '父级部门',
      dataIndex: 'parentName',
      search: false,
    },
    {
      title: '部门主管',
      dataIndex: 'supervisor',
      search: false,
    },
    {
      title: '部门人数',
      dataIndex: 'number',
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
        request={(params, sorter, filter) => getDeptList({ ...params, body: params.code })}
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
        >
          <Tooltip title="注：一经确认无法修改">
            <FormItem
              {...formItemLayout}
              label="部门编号"
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入部门编号',
                },
              ]}
            >
              <Input disabled={updateId} placeholder="请输入部门编号" />
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
            label="父级部门"
            name="parentDeptId"
            rules={[
              {
                required: true,
                message: '请选择父级部门',
              },
            ]}
          >
            <Select
              onChange={selectParentDeptChange}
              disabled={updateId}
              placeholder="请选择父级部门"
            >
              {deptList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem {...formItemLayout} label="部门职位">
            <Select disabled={updateId}>
              {roleList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="部门主管"
            name="supervisorId"
            rules={[
              {
                required: true,
                message: '请选择部门主管',
              },
            ]}
          >
            <Select placeholder="请选择部门主管">
              {deptMangerList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndEmployee/createDepartment'],
}))(Department);
