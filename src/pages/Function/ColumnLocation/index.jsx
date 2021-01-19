import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import ParentCard from './components/ParentCard';
import MedicineCheckCard from './components/MedicineCheckCard';
import ComprehensiveCard from './components/ComprehensiveCard';
import Carousel from './components/Carousel';

const ColumnLocation = (props) => {
  return (
    <PageContainer>
      <ParentCard />
      <MedicineCheckCard />
      <ComprehensiveCard />
      <Carousel />
    </PageContainer>
  );
};

export default ColumnLocation;
