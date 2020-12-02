import React, { useEffect } from 'react';
import SubmitForm from './SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart6({ list = [], patientId }) {
  useEffect(() => {
    if (list && list.length > 0) {
      clearCanvas('view7');
      lateralView('view7', list, '侧面图（三）5.沟通', '沟通', null, false);
    }
  }, [list]);

  return (
    <>
      <canvas
        width="1000"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view7"
      />
      <SubmitForm list={list} name="沟通" patientId={patientId} scaleType={4}/>
    </>
  );
}
export default Chart6;
