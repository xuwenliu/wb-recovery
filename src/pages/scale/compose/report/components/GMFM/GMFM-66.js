import React, { useEffect, useRef } from 'react';

import Paper from '@material-ui/core/Paper';
import ByItemOrder from './ByItemOrder';
import ByDifficultyOrder from './ByDifficultyOrder';

function GFMF66({ answers, total, width }) {
  const ref = useRef(null);
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <Paper ref={ref} style={{ textAlign: 'center' }}>
      <div
        style={{
          padding: '15px',
          fontSize: '25px',
          fontWeight: 'bold',
          textAlign: 'left',
        }}
      >
        Item Map by Item Order
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2,33.33%)',
          gridRowGap: '0',
          gridColumnGap: '20%',
          marginLeft: '3rem',
          marginBottom: '50px',
          fontSize: '18px',
          textAlign: 'left',
        }}
      >
        <div>GFMF-66 Score:</div>
        <div>{total.score}</div>
        <div>Standard Error:</div>
        <div>{total.error}</div>
        <div>95% Confidence Interval:</div>
        <div>
          {total.range.min} to {total.range.max}
        </div>
      </div>
      <ByItemOrder answers={answers} total={total} width={width} />

      <div
        style={{
          padding: '15px',
          fontSize: '25px',
          fontWeight: 'bold',
          textAlign: 'left',
        }}
      >
        Item Map by Difficulty Order
      </div>
      <ByDifficultyOrder answers={answers} total={total} width={width} />
    </Paper>
  );
}

export default GFMF66;
