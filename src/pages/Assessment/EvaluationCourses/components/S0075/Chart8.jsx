import React, { useEffect } from 'react';
import SubmitForm from '../SubmitForm';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart8({ list = [], name, guide, patientId }) {
  useEffect(() => {
    clearCanvas('view9');
    lateralView(guide.code, 'view9', list, `领域七：${name}侧面图`, name, null, false);
  }, [list]);

  return (
    <>
      <canvas
        width="1200"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view9"
      />
      <SubmitForm list={list} guide={guide} name={name} patientId={patientId} scaleType={6} />
    </>
  );
}
export default Chart8;
