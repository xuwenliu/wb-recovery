import React, { useEffect } from 'react';
import SubmitForm from '../SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart2({ list = [], name, guide, patientId }) {
  useEffect(() => {
    clearCanvas('view3');
    lateralView(guide.code, 'view3', list, `领域一：${name}侧面图`, name, null, false);
  }, [list]);
  return (
    <>
      <canvas
        width="1200"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view3"
      />
      <SubmitForm list={list} guide={guide} name={name} patientId={patientId} scaleType={8} />
    </>
  );
}
export default Chart2;
