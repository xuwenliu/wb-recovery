import { PlusOutlined } from '@ant-design/icons';
import { Button, Switch, message } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getPatientInfoList, recallSpecial, setSpecial } from './service';
import { connect, history } from 'umi';
import moment from 'moment';
import { getAuth } from '@/utils/utils';

const handleAdd = async () => {
  history.push({
    pathname: '/patriarch/childrenrecord/edit',
  });
};

const handleUpdate = async (row, type) => {
  history.push({
    pathname: '/patriarch/childrenrecord/edit',
    query: {
      id: row.id,
      type: type,
    },
  });
};

const ChildrenRecord = (props) => {
  const actionRef = useRef();

  const queryProjectList = async (params) => {
    console.log(params);
    const res = await getPatientInfoList({
      ...params,
      body: {
        code: params.caseCodeV,
        startTime: params.createDocumentTime ? moment(params.createDocumentTime[0]).valueOf() : '',
        endTime: params.createDocumentTime ? moment(params.createDocumentTime[1]).valueOf() : '',
      },
    });
    if (res) {
      return res;
    }
  };

  const onSpecialChange = async (checked, record) => {
    // checked=true 设置为个案 false=取消设置
    const callFunc = checked ? setSpecial : recallSpecial;
    const res = await callFunc({
      patientId: record.id,
    });
    if (res) {
      message.success('操作成功');
      actionRef?.current?.reload();
    }
  };

  const columns = [
    {
      title: '建档时间',
      dataIndex: 'createDocumentTime',
      valueType: 'dateRange',
      render: (_, record) => {
        return moment(record.createDocumentTime).format('YYYY-MM-DD');
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '病例编号',
      dataIndex: 'caseCodeV',
    },
    {
      title: '性别',
      dataIndex: 'genderName',
      search: false,
    },
    {
      title: '民族',
      dataIndex: 'ethnicName',
      search: false,
    },
    {
      title: '家庭成员',
      dataIndex: 'familyMemberNames',
      search: false,
    },
    {
      title: '成员关系',
      dataIndex: 'familyMemberType',
      search: false,
    },
    {
      title: '是否个案',
      dataIndex: 'isSpecial',
      search: false,
      render: (_, record) => {
        return (
          <Switch
            disabled={!getAuth()?.canEdit}
            onChange={(checked) => onSpecialChange(checked, record)}
            checked={record.isSpecial}
            checkedChildren="是"
            unCheckedChildren="否"
          />
        );
      },
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {getAuth()?.canEdit && (
            <Button
              onClick={() => handleUpdate(record, 1)}
              size="small"
              type="primary"
              className="mr8"
            >
              编辑
            </Button>
          )}

          <Button size="small" onClick={() => handleUpdate(record, 2)} type="success">
            查看详情
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <PageContainer>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 80,
          }}
          toolBarRender={() => [
            getAuth()?.canEdit && (
              <Button key="add" type="primary" onClick={handleAdd}>
                <PlusOutlined /> 新增
              </Button>
            ),
          ]}
          request={(params, sorter, filter) => queryProjectList(params)}
          columns={columns}
        />
      </PageContainer>
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['patriarchChildrenRecord/create'],
}))(ChildrenRecord);
