import { Tabs, Card } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import BaseInfo from './components/BaseInfo';
import Password from './components/Password';
import LoginRecord from './components/LoginRecord';

const { TabPane } = Tabs;

const Account = ({ location }) => {
  const [tab, setTab] = useState('1');
  const tabChange = (tab) => {
    setTab(tab);
  };
  useEffect(() => {
    const { tab } = location.query;
    tabChange(tab || '1');
  }, []);
  return (
    <PageContainer>
      <Card>
        <Tabs activeKey={tab} onChange={tabChange}>
          <TabPane tab="基本资料" key="1">
            <BaseInfo tab={tab} />
          </TabPane>
          <TabPane tab="密码管理" key="2">
            <Password tab={tab} />
          </TabPane>
          <TabPane tab="专业设定" key="3"></TabPane>
          <TabPane tab="登录记录" key="4">
            <LoginRecord tab={tab} />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default Account;
