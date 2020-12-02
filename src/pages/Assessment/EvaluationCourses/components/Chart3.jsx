import React, { useEffect } from 'react';
import SubmitForm from './SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart3({ list = [], patientId }) {
  useEffect(() => {
    if (list && list.length > 0) {
      clearCanvas('view4');
      lateralView('view4', list, '侧面图（三）2.粗大动作', '粗大动作', null, false);
    }
  }, [list]);

  return (
    <>
      <canvas
        width="1000"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view4"
      />
      <SubmitForm list={list} name="粗大动作" patientId={patientId} scaleType={1}/>
    </>
  );
}
export default Chart3;
