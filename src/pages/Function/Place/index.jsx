import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Tooltip, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getSitePage } from './service';
import { history, connect } from 'umi';

const Place = ({ dispatch }) => {
  const actionRef = useRef();
  const columns = [
    {
      title: '场地编号',
      dataIndex: 'code',
      formItemProps: {
        placeholder: '请输入场地编号',
      },
    },
    {
      title: '场地名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        placeholder: '请输入场地名称',
      },
    },
    {
      title: '场地位置',
      dataIndex: 'place',
      ellipsis: true,
      search: false,
    },
    {
      title: '场地说明',
      dataIndex: 'description',
      search: false,
      ellipsis: true,
    },
    {
      title: '器材说明',
      dataIndex: 'equipment',
      search: false,
      ellipsis: true,
      render: (_, record) => {
        return <span dangerouslySetInnerHTML={{ __html: record.equipment }}></span>;
      },
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

  const handleRemove = async (row) => {
    dispatch({
      type: 'functionAndPlace/remove',
      payload: {
        siteId: row.id,
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
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={(params, sorter, filter) =>
          getSitePage({ ...params, body: { code: params.code, name: params.name } })
        }
        columns={columns}
      />
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndPlace/remove'],
}))(Place);
