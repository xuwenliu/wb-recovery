import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getClass } from './service';
import { history, connect } from 'umi';
import { getAuth } from '@/utils/utils';

const handleAdd = async () => {
  history.push({
    pathname: '/educational/curriculum/edit',
  });
};

const handleUpdate = async (row) => {
  history.push({
    pathname: '/educational/curriculum/edit',
    query: {
      id: row.id,
    },
  });
};

const Curriculum = ({ dispatch }) => {
  const auth = getAuth();
  const actionRef = useRef();
  const columns = [
    {
      title: '课程编号',
      dataIndex: 'code',
      formItemProps: {
        placeholder: '请输入课程编号/名称',
      },
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '课程说明',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
      render: (_, record) => {
        return <span dangerouslySetInnerHTML={{ __html: record.description }}></span>;
      },
    },
    {
      title: '课程器材',
      ellipsis: true,
      dataIndex: 'equipment',
      search: false,
      render: (_, record) => {
        return <span dangerouslySetInnerHTML={{ __html: record.equipment }}></span>;
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

  const handleRemove = async (row) => {
    dispatch({
      type: 'educationalAndCurriculum/remove',
      payload: {
        classId: row.id,
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
          auth?.canEdit && (
            <Button key="add" type="primary" onClick={() => handleAdd()}>
              <PlusOutlined /> 新增
            </Button>
          ),
        ]}
        request={(params, sorter, filter) => getClass({ ...params, body: params.code })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['educationalAndCurriculum/remove'],
}))(Curriculum);
