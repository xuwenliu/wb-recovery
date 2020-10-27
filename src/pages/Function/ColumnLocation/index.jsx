import { Form, Card, Select, Row, Col, Divider, Input, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import './style.less';
import ParentCard from './components/ParentCard';
import MedicineCheckCard from './components/MedicineCheckCard';
import ComprehensiveCard from './components/ComprehensiveCard';

const ColumnLocation = (props) => {
  return (
    <PageContainer>
      {/* <ParentCard /> */}
      {/* <MedicineCheckCard /> */}
      <ComprehensiveCard />
    </PageContainer>
  );
};

export default ColumnLocation;
