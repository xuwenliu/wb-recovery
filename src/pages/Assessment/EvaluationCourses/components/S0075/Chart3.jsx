import React, { useEffect } from 'react';
import SubmitForm from '../SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart3({ list = [], name, guide, patientId }) {
  useEffect(() => {
    clearCanvas('view4');
    lateralView(guide.code, 'view4', list, `领域二：${name}侧面图`, name, null, false);
  }, [list]);

  return (
    <>
      <canvas
        width="1200"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view4"
      />
      <SubmitForm list={list} guide={guide} name={name} patientId={patientId} scaleType={1} />
    </>
  );
}
export default Chart3;
