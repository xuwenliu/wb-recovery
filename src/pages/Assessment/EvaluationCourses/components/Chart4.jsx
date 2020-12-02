import React, { useEffect } from 'react';
import SubmitForm from './SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart4({ list = [], patientId }) {
  useEffect(() => {
    if (list && list.length > 0) {
      clearCanvas('view5');
      lateralView('view5', list, '侧面图（三）3.精细动作', '精细动作', null, false);
    }
  }, [list]);

  return (
    <>
      <canvas
        width="1000"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view5"
      />
      <SubmitForm list={list} name="精细动作" patientId={patientId} scaleType={2}/>
    </>
  );
}
export default Chart4;
