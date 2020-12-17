import React, { useEffect } from 'react';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart7({ list = [], patientId }) {
  useEffect(() => {
    if (list && list.length > 0) {
      clearCanvas('view8');
      lateralView('view8', list, '侧面图（三）6.认知', '认知', null, false);
    }
  }, [list]);

  return (
    <>
      <canvas
        width="1000"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view8"
      />
    </>
  );
}
export default Chart7;
