import React, { useEffect } from 'react';
import SubmitForm from '../SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart7({ list = [], name, guide, patientId }) {
  useEffect(() => {
    clearCanvas('view8');
    lateralView(guide.code, 'view8', list, `领域六：${name}侧面图`, name, null, false);
  }, [list]);

  return (
    <>
      <canvas
        width="1200"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view8"
      />
      <SubmitForm list={list} guide={guide} name={name} patientId={patientId} scaleType={5} />
    </>
  );
}
export default Chart7;
