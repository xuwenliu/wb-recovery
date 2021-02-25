import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, Form, Popconfirm, Tooltip, Select, TreeSelect } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getGroupList, getDeptTree } from '@/pages/Function/Employee/service';

import { getCommonEnums } from '@/services/common';
import { connect } from 'umi';
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
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

const Group = (props) => {
  const auth = getAuth();
  const { submitting } = props;
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [employeeList, setEmployeeList] = useState([]); // 所有部门及其员工树
  const [groupTypeList, setGroupTypeList] = useState([]); // 评估类型

  //获取评估类型
  const queryGroupType = async () => {
    const res = await getCommonEnums({
      enumName: 'AssessGroupType',
    });
    if (res) {
      setGroupTypeList(Object.values(res));
    }
  };

  // 查询所有员工
  const queryEmployeeAllList = async () => {
    const res = await getDeptTree();
    console.log('res', res);
    if (res) {
      setEmployeeList(res);
    }
  };

  useEffect(() => {
    if (props.tab == 4) {
      queryGroupType();
      queryEmployeeAllList();
      actionRef?.current?.reload();
    }
  }, [props.tab]);

  // 删除
  const handleRemove = async (row) => {
    const { dispatch } = props;
    dispatch({
      type: 'functionAndEmployee/removeGroupType',
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
      type: 'functionAndEmployee/getInfoGroupType',
      payload: {
        id: row.id,
      },
      callback: (data) => {
        console.log('data', data);
        if (data) {
          const values = (data.employees || []).map((item) => {
            item.label = item.name;
            item.value = item.id;
            return item;
          });
          data.employeeIds = values.map((item) => item.value);
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
      };
      dispatch({
        type: 'functionAndEmployee/createGroupType',
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
      render: (_, record) => {
        return groupTypeList.filter((item) => item.code === record.groupType)[0]['codeCn'];
      },
    },
    {
      title: '小组人员',
      dataIndex: 'employees',
      search: false,
      render: (_, record) => {
        return record.employees?.map((item) => item.name).join();
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

  const getTreeNode = () => {
    return employeeList?.map((one) => (
      <TreeNode key={one.id} checkable={false} disableCheckbox title={one.name}>
        {one.children?.map((two) => (
          <TreeNode key={two.id} checkable={false} disableCheckbox title={two.name}>
            {two.employeeVos?.map((three) => (
              <TreeNode key={three.id} value={three.id} title={three.name}></TreeNode>
            ))}
          </TreeNode>
        ))}
        {/* 有可能一级部门下有员工 */}
        {one.employeeVos?.map((two) => (
          <TreeNode key={two.id} value={two.id} title={two.name}></TreeNode>
        ))}
      </TreeNode>
    ));
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
            <Button
              key="add"
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              <PlusOutlined /> 新增
            </Button>
          ),
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
            name="groupType"
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
            label="选择成员"
            name="employeeIds"
            rules={[
              {
                required: true,
                message: '请选择成员',
              },
            ]}
          >
            <TreeSelect
              showSearch={false}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              placeholder="请选择成员"
              allowClear
              multiple
              treeCheckable
            >
              {getTreeNode()}
            </TreeSelect>
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndEmployee/createGroupType'],
}))(Group);
