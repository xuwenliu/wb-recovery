import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, Form, Popconfirm, Tooltip, Select, Checkbox } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import {
  getGroupList,
  getDeptAllList,
  getGroupDepartments,
  getGroupEmployees,
  getRoleAllList,
} from '../../service';
import { getCommonEnums } from '../../../../../services/common';
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

const Group = (props) => {
  const { submitting } = props;
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [deptList, setDeptList] = useState([]); //一级部门
  const [subDeptList, setSubDeptList] = useState([]); // 子部门
  const [employeeList, setEmployeeList] = useState([]); // 部门下的员工
  const [groupTypeList, setGroupTypeList] = useState([]); // 评估类型

  //获取评估类型
  const queryGroupType = async () => {
    const res = await getCommonEnums({
      enumName: 'AssessGroupType',
    });
    if (res) {
      console.log(Object.values(res));
      setGroupTypeList(Object.values(res));
    }
  };

  // 查询一级部门
  const queryDeptList = async () => {
    const res = await getDeptAllList();
    if (res) {
      setDeptList(res);
    }
  };

  // 查询子部门
  const querySubDept = async () => {
    const res = await getGroupDepartments();
    if (res) {
      setSubDeptList(res);
    }
  };

  // 查询子部门下的员工
  const querySubDeptEmployees = async () => {
    const res = await getGroupEmployees();
    if (res) {
      const data = res.map((item) => {
        item.label = item.name;
        item.value = item.id;
        return item;
      });
      setEmployeeList(data);
    }
  };

  // 通过一级部门获取子部门
  const handleDeptChange = (id) => {
    querySubDept(id);
    form.setFields([
      {
        name: 'subId',
        value: '',
      },
      {
        name: 'permissionIds',
        value: [],
      },
    ]);
  };

  // 通过子部门获取员工
  const handleSubDeptChange = (id) => {
    querySubDeptEmployees(id);
    form.setFields([
      {
        name: 'permissionIds',
        value: [],
      },
    ]);
  };

  useEffect(() => {
    queryGroupType();
    queryDeptList();
  }, []);

  // 删除
  const handleRemove = async (row) => {
    const hide = message.loading('正在删除');
    const { dispatch } = props;
    dispatch({
      type: 'functionAndEmployee/removeGroupType',
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
      type: 'functionAndEmployee/getInfoGroupType',
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
        id: updateId,
        ...getValues,
        entryTime: moment(getValues.entryTime).valueOf(), // 时间传时间戳
      };
      dispatch({
        type: 'functionAndEmployee/createGroupType',
        payload: postData,
        callback: (res) => {
          if (!res) return;
          message.success(`${postData.id ? '修改' : '新增'}成功`);
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
      title: '小组编号',
      dataIndex: 'code',
      formItemProps: {
        placeholder: '请输入小组编号/名称',
      },
    },
    {
      title: '评估小组名称',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '评估类型',
      dataIndex: 'groupType',
      search: false,
    },
    {
      title: '小组人员',
      dataIndex: 'employeeNames',
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
        request={(params, sorter, filter) => getGroupList({ ...params, body: params.code })}
        columns={columns}
      />
      <Modal
        title="评估小组信息"
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
              label="小组编号"
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入小组编号',
                },
              ]}
            >
              <Input disabled={updateId} placeholder="请输入小组编号" />
            </FormItem>
          </Tooltip>
          <FormItem
            {...formItemLayout}
            label="小组名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入小组名称',
              },
            ]}
          >
            <Input placeholder="请输入小组名称" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="评估类型"
            name="deptId"
            rules={[
              {
                required: true,
                message: '请选择评估类型',
              },
            ]}
          >
            <Select placeholder="请选择评估类型">
              {groupTypeList.map((item) => (
                <Select.Option key={item.code} value={item.code}>
                  {item.codeCn}
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="一级部门"
            name="oneId"
            rules={[
              {
                required: true,
                message: '请选择一级部门',
              },
            ]}
          >
            <Select onChange={handleDeptChange} placeholder="请选择一级部门">
              {deptList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="子部门"
            name="subId"
            rules={[
              {
                required: true,
                message: '请选择子部门',
              },
            ]}
          >
            <Select onChange={handleSubDeptChange} placeholder="请选择子部门">
              {subDeptList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="选择权限"
            name="permissionIds"
            rules={[
              {
                required: true,
                message: '请选择权限',
              },
            ]}
          >
            <Checkbox.Group options={employeeList} />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndEmployee/createRoleType'],
}))(Group);

// function mapStateToProps(state) {
//   console.log('state', state);
// }
// export default connect(mapStateToProps)(Group);
