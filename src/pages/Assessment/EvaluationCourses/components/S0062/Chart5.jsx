import React, { useEffect } from 'react';
import SubmitForm from '../SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart5({ list = [], name, guide, patientId }) {
  useEffect(() => {
    clearCanvas('view6');
    lateralView(guide.code, 'view6', list, `侧面图（三）4.${name}`, name, null, false);
  }, [list]);

  return (
    <>
      <canvas
        width="1000"
        height="700"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view6"
      />
      <SubmitForm list={list} guide={guide} name={name} patientId={patientId} scaleType={3} />
    </>
  );
}
export default Chart5;
