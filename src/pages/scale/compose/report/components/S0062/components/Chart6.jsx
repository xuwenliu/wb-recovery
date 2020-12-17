import React, { useEffect } from 'react';
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
    </>
  );
}
export default Chart6;
