import { Tabs, Card } from 'antd';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import Department from './components/department';
import People from './components/people';
import Role from './components/role';
import Group from './components/group';

const { TabPane } = Tabs;

const TableList = () => {
  const [tab, setTab] = useState(1);
  const tabChange = (tab) => {
    setTab(tab);
  };
  return (
    <PageContainer>
      <Card>
        <Tabs defaultActiveKey="1" onChange={tabChange}>
          <TabPane tab="部门管理" key="1">
            <Department tab={tab} />
          </TabPane>
          <TabPane tab="人员管理" key="2">
            <People tab={tab} />
          </TabPane>
          <TabPane tab="角色管理" key="3">
            <Role tab={tab} />
          </TabPane>
          <TabPane tab="评估小组" key="4">
            <Group tab={tab} />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default TableList;
