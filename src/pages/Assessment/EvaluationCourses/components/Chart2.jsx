import React, { useEffect } from 'react';
import SubmitForm from './SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart2({ list = [], patientId }) {
  useEffect(() => {
    if (list && list.length > 0) {
      clearCanvas('view3');
      lateralView('view3', list, '侧面图（三）1.感官知觉', '感官知觉', null, false);
    }
  }, [list]);
  return (
    <>
      <canvas
        width="1000"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view3"
      />
      <SubmitForm list={list} name="感官知觉" patientId={patientId} scaleType={8} />
    </>
  );
}
export default Chart2;
