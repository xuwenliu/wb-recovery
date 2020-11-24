// 就诊记录列表组件

import { Button, Select } from 'antd';
import React, { useState, useRef, useEffect } from 'react';

import ProTable from '@ant-design/pro-table';
import { getRecord } from '@/pages/Patriarch/MedicalRecord/service';
import { getAllProblem } from '@/pages/MedicalExamination/DiagnosisPrescription/service';

import moment from 'moment';
import { history } from 'umi';

const MedicalRecordList = ({ patientId }) => {
  const actionRef = useRef();
  const [allProblemList, setAllProblemList] = useState([]);
  const [allCode, setAllCode] = useState([]);

  const queryRecordList = async (params) => {
    // if (!patientId) {
    //   return {
    //     data: [],
    //     total: 0,
    //   };
    // }
    const res = await getRecord({
      ...params,
      body: {
        patientId,
        jiGou: params.jiGou,
        problemId: params.problemId, // 就诊内容
        startTime: params.time ? moment(params.time[0]).valueOf() : null,
        endTime: params.time ? moment(params.time[1]).valueOf() : null,
      },
    });
    if (res) {
      return res;
    }
  };
  const queryAllProblemList = async () => {
    const res = await getAllProblem();
    setAllProblemList(res);
  };

  const handleViewDetail = (row) => {
    history.push({
      pathname: '/medicalexamination/diagnosisprescription/detail',
      query: {
        id: row.recordId,
      },
    });
  };

  const columns = [
    {
      title: '就诊时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (_, record) => {
        return moment(record.createTime).format('YYYY-MM-DD');
      },
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      search: false,
    },
    {
      title: '就诊编号',
      dataIndex: 'visitingCode',
      search: false,
    },
    {
      title: '就诊内容',
      dataIndex: 'problemInfo',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select placeholder="请选择就诊内容">
            {allProblemList.map((item, index) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },

    {
      title: '就诊机构',
      dataIndex: 'organizeName',
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
      title: '医师初步判断',
      dataIndex: 'judgmentInfo',
      ellipsis: true,
      search: false,
    },
    {
      title: '治疗处方',
      dataIndex: 'prescriptionInfo',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => handleViewDetail(record)} type="success">
            查看详情
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (patientId) {
      queryAllProblemList();
      actionRef.current?.reload();
    }
  }, [patientId]);

  return (
    <ProTable
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 80,
      }}
      request={(params, sorter, filter) => queryRecordList(params)}
      columns={columns}
    />
  );
};

export default MedicalRecordList;