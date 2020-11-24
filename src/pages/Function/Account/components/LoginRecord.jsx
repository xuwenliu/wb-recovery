import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getLoginRecord } from '../service';

const LoginRecord = (props) => {
  const actionRef = useRef();
  const columns = [
    {
      title: '登录时间',
      dataIndex: 'createDocumentTime',
      valueType: 'dateRange',
    },
    {
      title: '登录IP',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '登录设备',
      dataIndex: 'code',
      search: false,
    },
    {
      title: '登录时长',
      dataIndex: 'content',
      search: false,
    },
    {
      title: '登录地点',
      dataIndex: 'content',
      search: false,
    },

    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => (
    //     <>
    //       <Button size="small" onClick={() => handleUpdate(record, 1)} type="success">
    //         查看登录详情
    //       </Button>
    //     </>
    //   ),
    // },
  ];

  return (
    <ProTable
      actionRef={actionRef}
      rowKey="id"
      search={false}
      request={(params, sorter, filter) => getLoginRecord(params)}
      columns={columns}
    />
  );
};

export default LoginRecord;
