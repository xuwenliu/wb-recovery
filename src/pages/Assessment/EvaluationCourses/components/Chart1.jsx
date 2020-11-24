import React, { useState, useEffect } from 'react';
import { Chart } from '@antv/g2';

function Chart1({ list = [] }) {
  console.log('list', list);
  const init = () => {
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 400,
    });

    chart.data(list);
    chart.scale({
      name: {
        range: [0, 1],
      },
      score: {
        min: 0,
        nice: true,
      },
    });

    chart.tooltip({
      showCrosshairs: true, // 展示 Tooltip 辅助线
      shared: true,
    });

    chart.line().position('name*score');
    chart.point().position('name*score');

    chart.render();
  };

  useEffect(() => {
    if (list.length != 0) {
      init();
    }
  }, [list]);
  return (
    <div>
      <div style={{ width: '100%', height: 400 }} id="container" />
    </div>
  );
}
export default Chart1;
