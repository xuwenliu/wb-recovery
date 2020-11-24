// 测评记录列表组件
import { Button, Select } from 'antd';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getRecord } from '@/pages/Patriarch/MedicalRecord/service';
import moment from 'moment';

const AssessmentRecordList = (props) => {
  const actionRef = useRef();
  const [contentList, setContentList] = useState([]);
  const [allCode, setAllCode] = useState([]);

  const queryRecordList = async (params) => {
    const res = await getRecord({
      ...params,
      body: {
        jiGou: params.jiGou,
        content: params.content,
        startTime: params.createDocumentTime ? moment(params.createDocumentTime[0]).valueOf() : null,
        endTime: params.createDocumentTime ? moment(params.createDocumentTime[1]).valueOf() : null,
      },
    });
    if (res) {
      return res;
    }
  };

  const columns = [
    {
      title: '答题时间',
      dataIndex: 'createDocumentTime',
      valueType: 'dateRange',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '报告编号',
      dataIndex: 'code',
      search: false,
    },
    {
      title: '量表类型',
      dataIndex: 'content',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select placeholder="请选择就诊内容">
            {contentList.map((item, index) => (
              <Select.Option value={item} key={index}>
                {item}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },

    {
      title: '就诊机构',
      dataIndex: 'jiGou',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select placeholder="请选择就诊机构">
            {allCode.map((item, index) => (
              <Select.Option value={item} key={index}>
                {item}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Button size="small" onClick={() => handleUpdate(record, 1)} type="success">
          查看量表结果
        </Button>
      ),
    },
  ];

  return (
    <ProTable
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 80,
      }}
      dataSource={[]}
      // request={(params, sorter, filter) => queryRecordList(params)}
      columns={columns}
    />
  );
};

export default AssessmentRecordList;
