import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import './style.less';
import ParentCard from './components/ParentCard';
import MedicineCheckCard from './components/MedicineCheckCard';
import ComprehensiveCard from './components/ComprehensiveCard';
import ImportDataCard from './components/ImportDataCard';

const ColumnLocation = (props) => {
  return (
    <PageContainer>
      <ParentCard />
      <MedicineCheckCard />
      <ComprehensiveCard />
      <ImportDataCard />
    </PageContainer>
  );
};

export default ColumnLocation;
