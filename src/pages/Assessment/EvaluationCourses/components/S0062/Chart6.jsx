import React, { useEffect } from 'react';
import SubmitForm from '../SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart6({ list = [], name, guide, patientId }) {
  useEffect(() => {
    console.log('tab6',list)
    clearCanvas('view7');
    lateralView(guide.code, 'view7', list, `侧面图（三）5.${name}`, name, null, false);
  }, [list]);

  return (
    <>
      <canvas
        width="1000"
        height="700"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view7"
      />
      <SubmitForm list={list} guide={guide} name={name} patientId={patientId} scaleType={4} />
    </>
  );
}
export default Chart6;
