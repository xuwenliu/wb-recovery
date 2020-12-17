import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getLoginRecord } from '../service';
import moment from 'moment';

const LoginRecord = (props) => {
  const actionRef = useRef();
  const columns = [
    {
      title: '登录时间',
      dataIndex: 'createTime',
      search: false,
      render: (_, record) => {
        return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '登录IP',
      dataIndex: 'ipAddress',
      search: false,
    },
    // {
    //   title: '登录设备',
    //   dataIndex: 'device',
    //   search: false,
    // },
    {
      title: '登录时长',
      dataIndex: 'duration',
      search: false,
    },
    {
      title: '登录地点',
      dataIndex: 'location',
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
