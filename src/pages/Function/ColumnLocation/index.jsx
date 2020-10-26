import { Form, Card, Select, Row, Col, Divider, Input, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import './style.less';
import ParentCard from './components/ParentCard';
import MedicineCheckCard from './components/MedicineCheckCard';

const ColumnLocation = (props) => {
  return (
    <PageContainer>
      {/* <ParentCard /> */}
      <MedicineCheckCard />
    </PageContainer>
  );
};

export default ColumnLocation;
