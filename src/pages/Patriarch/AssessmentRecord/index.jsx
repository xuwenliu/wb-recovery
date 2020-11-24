/* eslint-disable no-lonely-if */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';

import { Button, DatePicker, Select } from 'antd';
import ProTable from '@ant-design/pro-table';

import { PageContainer } from '@ant-design/pro-layout';

// import ScaleTypeDropDown from '@/pages/scale/components/type/ScaleTypeDropDown';
import ScaleReportModal from '@/components/Scale/ScaleReportModal';

import router from '@/utils/router';
import moment from 'moment';

const { RangePicker } = DatePicker;

const AssessmentRecord = ({ patriarchAssessmentRecord, dispatch }) => {
  const { types, records } = patriarchAssessmentRecord;

  const actionRef = useRef();

  const [report, setReport] = useState();

  const columns = [
    {
      title: '答题时间',
      dataIndex: 'reportDate',
      render: (value) => {
        if (isNaN(value) === false) {
          return moment(value).format('YYYY-MM-DD');
        }
        return '';
      },
      renderFormItem: () => {
        return <RangePicker />;
      },
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      search: false,
    },
    {
      title: '报告编号',
      dataIndex: 'number',
      search: false,
    },
    {
      title: '量表类型',
      dataIndex: 'scaleName',
      renderFormItem: () => {
        return (
          <Select placeholder="量表类型">
            {types
              ? types.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))
              : ''}
          </Select>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Button
          size="small"
          type="success"
          onClick={() => {
            if (record.reportDate) {
              setReport({ scale: record.scale, id: record.id });
            } else {
              if (record.subScale) {
                router.push(
                  `/scale/compose/answer/single?compose=${record.scale}&id=${record.id}&subScale=${record.subScale}`,
                );
              } else {
                router.push({
                  pathname: '/scale/compose/answer',
                  query: { compose: record.scale, id: record.id, name: record.scaleName },
                });
              }
            }
          }}
        >
          {record.reportDate ? '查看量表结果' : '继续答题'}
        </Button>
      ),
    },
  ];

  const search = (params) => {
    dispatch({
      type: 'patriarchAssessmentRecord/searchRecords',
      payload: params,
    });
  };

  useEffect(() => {
    dispatch({
      type: 'patriarchAssessmentRecord/listType',
    });
    return () => {
      dispatch({
        type: 'patriarchAssessmentRecord/clear',
        payload: {},
      });
    };
  }, []);
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
        }}
        dataSource={records ? records.content : []}
        columns={columns}
        onSubmit={search}
      />
      <ScaleReportModal
        report={report}
        onClose={() => {
          setReport();
        }}
      />
    </PageContainer>
  );
};
export default connect(({ patriarchAssessmentRecord, loading }) => ({
  loading: loading.effects['patriarchAssessmentRecord/listType'],
  patriarchAssessmentRecord,
}))(AssessmentRecord);
