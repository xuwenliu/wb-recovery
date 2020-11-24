
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import MedicalRecordList from '@/components/MedicalRecordList';

const MedicalRecord = (props) => {
  return (
    <PageContainer>
      <MedicalRecordList />
    </PageContainer>

  );
};

export default MedicalRecord;
