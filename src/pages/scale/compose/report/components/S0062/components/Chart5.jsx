import React, { useEffect } from 'react';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart5({ list = [], patientId }) {
  useEffect(() => {
    if (list && list.length > 0) {
      clearCanvas('view6');
      lateralView('view6', list, '侧面图（三）4.生活自理', '生活自理', null, false);
    }
  }, [list]);

  return (
    <>
      <canvas
        width="1000"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view6"
      />
    </>
  );
}
export default Chart5;
