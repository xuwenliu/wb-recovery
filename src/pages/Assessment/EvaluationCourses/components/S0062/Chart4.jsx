import React, { useEffect } from 'react';
import SubmitForm from '../SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart4({ list = [], name, guide, patientId }) {
  useEffect(() => {
    clearCanvas('view5');
    lateralView(guide.code, 'view5', list, `侧面图（三）3.${name}`, name, null, false);
  }, [list]);

  return (
    <>
      <canvas
        width="1000"
        height="700"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view5"
      />
      <SubmitForm list={list} guide={guide} name={name} patientId={patientId} scaleType={2} />
    </>
  );
}
export default Chart4;
