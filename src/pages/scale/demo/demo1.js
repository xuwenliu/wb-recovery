import React, { useEffect } from 'react';

import { Typography, Tabs, Spin, Table } from 'antd';

import { formatDateFromTime } from '@/utils/format';

import ScaleView from '@/pages/scale/components/ScaleView';

const { Title } = Typography;
const { TabPane } = Tabs;

function Demo1({
  typeLoading,
  scalesLoading,
  recordsLoading,
  listType,
  searchScale,
  listRecords,
  scaleDemo: {
    types = [],
    scales = {
      content: [],
    },
    records = {
      content: [],
    },
  },
}) {
  useEffect(() => {
    // listScales();
    listType();
    return () => {};
  }, []);

  return (
    <div style={{ padding: '15px' }}>
      <Title level={4}>医学诊断与处方</Title>
      <Tabs
        defaultActiveKey="scales"
        onChange={(key) => {
          if (key === 'scales') {
            listType();
          } else {
            listRecords();
          }
        }}
      >
        <TabPane tab="指定评估量表" key="scales">
          {typeLoading ? (
            <Spin />
          ) : (
            <ScaleView
              types={types}
              scales={scales}
              searchScale={searchScale}
              scalesLoading={scalesLoading}
            />
          )}
        </TabPane>
        <TabPane tab="檢核自評" key="test">
          量表答題
        </TabPane>
        <TabPane tab="測評紀錄" key="records">
          <Table
            loading={recordsLoading}
            dataSource={records.content}
            columns={[
              {
                title: '答题时间',
                dataIndex: 'reportDate',
                render: (value) => {
                  return formatDateFromTime(value);
                },
              },
              {
                title: '姓名',
                dataIndex: 'userName',
              },
              {
                title: '报告编号',
                dataIndex: 'number',
              },
              {
                title: '量表类型',
                dataIndex: 'scaleName',
              },
              {
                title: '操作',
              },
            ]}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Demo1;
