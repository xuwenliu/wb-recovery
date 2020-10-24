import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, Form, Popconfirm, Tooltip, Select } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getDeptList, getDeptAllList, getEmployeeAllList, getRoleAllList } from '../../service';
import { connect, history } from 'umi';
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
  const { submitting } = props;
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [deptList, setDeptList] = useState([]);//部门层级下拉
  const [deptMangerList, setDeptMangerList] = useState([]);//部门主管下拉
  const [roleList, setRoleList] = useState([]);//部门职位-全部角色带出 下拉





  //获取部门层级
  const queryDeptList = async () => {
    const res = await getDeptAllList();
    if (res) {
      setDeptList(res);
    }
  }

  // 获取部门主管
  const queryDeptMangerList = async () => {
    const res = await getEmployeeAllList();
    if (res) {
      setDeptMangerList(res);
    }
  }

  // 获取部门职位
  const queryRoleList = async () => {
    const res = await getRoleAllList();
    if (res) {
      setRoleList(res);
    }
  }


  useEffect(() => {
    queryDeptList();
    queryDeptMangerList();
    queryRoleList();
  }, [])

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
    form.setFieldsValue(row)
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
        id: updateId,
        ...getValues,
      }
      dispatch({
        type: 'functionAndEmployee/createDepartment',
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
      title: '层级',
      dataIndex: 'level',
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
          <Popconfirm
            title="确定删除该项数据吗？"
            onConfirm={() => handleRemove(record)}
          >
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
            label="父级部门"
            name="parentDeptId"
            rules={[
              {
                required: true,
                message: '请选择父级部门',
              },
            ]}
          >
            <Select placeholder="请选择父级部门">
              {
                deptList.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
              }
            </Select>
          </FormItem>
          {
            updateId && (
              <>
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
                  <Select mode="tags" placeholder="请选择子部门" />
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
                  <Select placeholder="请选择部门职位" >
                    {
                      roleList.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
                    }
                  </Select>
                </FormItem></>)
          }
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
              {
                deptMangerList.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
              }
            </Select>
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
