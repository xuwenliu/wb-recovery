import React, { useEffect } from 'react';
import AutoComplete from '@/components/AutoComplete';
import { Space, List, Typography, Tabs, Select, Checkbox, Empty } from 'antd';
import { formatDateFromTime } from '@/utils/format';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

function Demo1({
  handleSearch,
  listRecords,
  getSimpleSuggest,
  recordsLoading,
  suggestsLoading,
  scaleDemo: {
    objects = {
      content: [],
    },
    records = {
      content: [],
    },
    suggests = [],
  },
}) {
  useEffect(() => {
    return () => {};
  }, []);

  console.log('suggests:', suggests);

  return (
    <div style={{ padding: '15px' }}>
      <Title level={4}>教学课程评量</Title>
      <AutoComplete
        label="人员代码"
        onInputChange={(value) => {
          handleSearch(value);
        }}
        onChange={({ value }) => {
          listRecords(value);
        }}
        options={objects.content.map((i) => {
          return {
            value: i.id,
            label: `${i.number}.${i.name}`,
          };
        })}
      />
      <Tabs defaultActiveKey="scales" onChange={(key) => {}}>
        <TabPane tab="训练建议" key="scales">
          <Space direction="vertical">
            <Select
              style={{ width: 300 }}
              loading={recordsLoading}
              onChange={(value) => {
                getSimpleSuggest(value);
              }}
            >
              {records.content.map(({ id, scaleName, reportDate }) => (
                <Option key={id} value={id}>
                  {scaleName} {formatDateFromTime(reportDate)}
                </Option>
              ))}
            </Select>
            <List
              loading={suggestsLoading}
              header={<div>Header</div>}
              bordered
              dataSource={suggests}
              renderItem={(suggest) => (
                <List.Item
                  extra={
                    <Checkbox
                      onChange={(e) => {
                        // eslint-disable-next-line no-console
                        console.log(suggest.no, e.target.checked);
                      }}
                    />
                  }
                >
                  {suggest.desc}
                </List.Item>
              )}
            />
          </Space>
        </TabPane>
        <TabPane tab="教学评量" key="records">
          金童家量表的答題
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Demo1;
