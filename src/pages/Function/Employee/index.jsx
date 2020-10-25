import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Tabs, Card } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import Department from './components/department';
import People from './components/people';
import Role from './components/role';
import Group from './components/group';

const { TabPane } = Tabs;

const TableList = () => {
  const tabChange = (tab) => {};
  return (
    <PageContainer>
      <Card>
        <Tabs defaultActiveKey="1" onChange={tabChange}>
          <TabPane tab="部门管理" key="1">
            <Department />
          </TabPane>
          <TabPane tab="人员管理" key="2">
            <People />
          </TabPane>
          <TabPane tab="角色管理" key="3">
            <Role />
          </TabPane>
          <TabPane tab="评估小组" key="4">
            <Group />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default TableList;
