import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Tabs, Card } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import Department from './components/department';

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
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="角色管理" key="3">
            Content of Tab Pane 3
          </TabPane>
          <TabPane tab="评估小组" key="4">
            Content of Tab Pane 4
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default TableList;