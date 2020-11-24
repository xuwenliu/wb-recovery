import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Tabs, Card } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import BaseInfo from './components/BaseInfo';
import Password from './components/Password';
// import Role from './components/role';
import LoginRecord from './components/LoginRecord';

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
          <TabPane tab="基本资料" key="1">
            <BaseInfo tab={tab} />
          </TabPane>
          <TabPane tab="密码管理" key="2">
            <Password tab={tab} />
          </TabPane>
          <TabPane tab="专业设定" key="3">
            {/* <Role tab={tab} /> */}
          </TabPane>
          <TabPane tab="登录记录" key="4">
            <LoginRecord tab={tab} />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default TableList;
