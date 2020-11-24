import { PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import React, { useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { history, connect } from 'umi';

import { getCollectiveEduPage } from './service';

const CollectivePlan = ({ dispatch }) => {
  const actionRef = useRef();

  const handleAdd = async () => {
    history.push({
      pathname: '/rehabilitation/collectiveplan/edit',
    });
  };
  const handleUpdate = async (row) => {
    history.push({
      pathname: '/rehabilitation/collectiveplan/edit',
      query: {
        id: row.id,
      },
    });
  };

  const handleRemove = async (row) => {
    dispatch({
      type: 'rehabilitationAndCollectivePlan/remove',
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

  const columns = [
    {
      title: '主题名称',
      dataIndex: 'topicName',
    },
    {
      title: '月份',
      dataIndex: 'month',
      render: (_, record) => {
        return record.month + '月';
      },
    },
    {
      title: '活动名称',
      dataIndex: 'eventName',
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
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => handleAdd()}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={(params, sorter, filter) => getCollectiveEduPage(params)}
        columns={columns}
      />
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['rehabilitationAndCollectivePlan/remove'],
}))(CollectivePlan);
