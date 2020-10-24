import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryRule, updateRule, addRule, removeRule } from './service';
import { history } from 'umi';

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
    type: 'functionAndPlace/remove',
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

const TableList = () => {
  const actionRef = useRef();
  const columns = [
    {
      title: '场地编号',
      dataIndex: 'number',
      formItemProps: {
        placeholder: '请输入场地编号/名称',
      },
    },
    {
      title: '场地名称',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '场地位置',
      dataIndex: 'location',
      search: false,
    },
    {
      title: '场地说明',
      dataIndex: 'desc',
      search: false,
    },
    {
      title: '器材说明',
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
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => handleAdd()}>
            <PlusOutlined /> 新建
          </Button>
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
