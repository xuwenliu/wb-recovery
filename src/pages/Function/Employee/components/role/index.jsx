import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Modal,
  message,
  Input,
  Form,
  Popconfirm,
  Tooltip,
  Select,
  Tree,
  Switch,
} from 'antd';

import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import {
  getRoleList,
  getDeptAllList,
  getRoleAllPermissionList,
} from '@/pages/Function/Employee/service';
import { connect } from 'umi';
const FormItem = Form.Item;
import { getAuth } from '@/utils/utils';

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
  const auth = getAuth();
  const { submitting } = props;
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [deptList, setDeptList] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [checkedNodes, setCheckedNodes] = useState([]);
  const [treeData, setTreeData] = useState([]);

  //获取所属部门
  const queryDeptList = async () => {
    const res = await getDeptAllList();
    if (res) {
      setDeptList(res);
    }
  };

  // 获取设置权限
  const queryRoleAllPermissionList = async () => {
    const res = await getRoleAllPermissionList();
    if (res) {
      setTreeData(res);
    }
  };

  useEffect(() => {
    if (props.tab == 3) {
      queryDeptList();
      queryRoleAllPermissionList();
      actionRef?.current?.reload();
    }
  }, [props.tab]);

  // 新增
  const handleAdd = async () => {
    setVisible(true);
    queryRoleAllPermissionList();
    setCheckedKeys([]);
    setCheckedNodes([]);
  };

  // 删除
  const handleRemove = async (row) => {
    const { dispatch } = props;
    dispatch({
      type: 'functionAndEmployee/removeRoleType',
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
  const updateEditData = (newData) => {
    newData.forEach((item) => {
      const data = getList(treeData, item.key, { field: 'canEdit', value: item.canEdit });
      setTreeData(data);
    });
  };
  // 编辑
  const handleUpdate = async (row) => {
    const hide = message.loading('加载中...');
    const { dispatch } = props;
    updateId = row.id;
    dispatch({
      type: 'functionAndEmployee/getInfoRoleType',
      payload: {
        id: row.id,
      },
      callback: (data) => {
        hide();
        if (data) {
          const keys = data.permissionVos?.map((item) => item.key);
          setCheckedKeys(keys);
          setCheckedNodes(data.permissionVos || []);
          updateEditData(data.permissionVos); // 用上次提交的数据来更新所有权限里面对应的数据
          form.setFieldsValue(data);
          setVisible(true);
        }
      },
    });
  };

  // 取消
  const handleCancel = () => {
    form.resetFields();
    updateId = '';
    setCheckedKeys([]);
    setCheckedNodes([]);
    setVisible(false);
  };

  // 提交
  const handleOk = async () => {
    const { dispatch } = props;
    const values = await form.validateFields(); //校验
    if (values) {
      const getValues = form.getFieldsValue(); // 获取最新文本值
      const permissions = [];
      if (checkedNodes.length === 0) {
        return message.info('请设置权限');
      }
      checkedNodes.forEach((item) => {
        permissions.push({
          canEdit: item.canEdit,
          permissionId: item.id,
        });
      });
      const postData = {
        roleId: updateId,
        ...getValues,
        permissions,
      };
      dispatch({
        type: 'functionAndEmployee/createRoleType',
        payload: postData,
        callback: (res) => {
          if (!res) return;
          message.success(`${postData.roleId ? '修改' : '新增'}成功`);
          handleCancel();
          actionRef?.current?.reload();
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
      render: (_, record) => {
        if (record.permissionNames?.length > 20) {
          return (
            <Tooltip title={record.permissionNames}>
              <span>{record.permissionNames.slice(0, 20)}...</span>
            </Tooltip>
          );
        }
        return record.permissionNames;
      },
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>
        auth?.canEdit && (
          <>
            <Button
              onClick={() => handleUpdate(record)}
              size="small"
              type="primary"
              className="mr8"
            >
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

  const onCheck = (checkedKeys, { checked, checkedNodes, node }) => {
    console.log('checkedNodes', checkedNodes);
    setCheckedNodes(checkedNodes);
    setCheckedKeys(checkedKeys);
  };

  const getList = (arr, key, { field, value }) => {
    return arr?.map((item) => {
      if (item.key === key) {
        item[field] = value;
        return item;
      } else {
        getList(item.children, key, { field, value });
      }
      return item;
    });
  };

  const actionChange = (checked, record, field) => {
    const newTreeData = getList(treeData, record.key, {
      field,
      value: checked,
    });
    setTreeData(newTreeData);
    setCheckedNodes(
      getList(checkedNodes, record.key, {
        field,
        value: checked,
      }),
    );
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
          auth?.canEdit && (
            <Button key="add" type="primary" onClick={handleAdd}>
              <PlusOutlined /> 新增
            </Button>
          ),
        ]}
        request={(params, sorter, filter) => getRoleList({ ...params, body: params.code })}
        columns={columns}
      />
      <Modal
        title="角色信息"
        width={600}
        visible={visible}
        onCancel={handleCancel}
        bodyStyle={{
          maxHeight: 500,
          overflowY: 'auto',
        }}
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
            // name="permissionIds"
            // rules={[
            //   {
            //     required: true,
            //     message: '请选择权限',
            //   },
            // ]}
          >
            {/* <Checkbox.Group options={roleList} /> */}
            <Tree
              checkable
              blockNode
              treeData={treeData}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              titleRender={(record) => {
                return (
                  <>
                    {record.title}
                    {!record.children && (
                      <div style={{ float: 'right' }}>
                        {/* <Switch
                          className="mr8"
                          checkedChildren="查看"
                          unCheckedChildren="关闭"
                          key="view"
                          onChange={(checked) => actionChange(checked, record, 'view')}
                          checked={record.view}
                        >
                          查看
                        </Switch> */}
                        {record.haveEdit && (
                          <Switch
                            key="edit"
                            checkedChildren="编辑"
                            unCheckedChildren="关闭"
                            onChange={(checked) => actionChange(checked, record, 'canEdit')}
                            checked={record.canEdit}
                          >
                            编辑
                          </Switch>
                        )}
                      </div>
                    )}
                  </>
                );
              }}
            />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndEmployee/createRoleType'],
}))(Role);
