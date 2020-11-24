import React, { useEffect } from 'react';

import { drawDashLine } from '../../util';
import DEFINE from './define';

const { sortData } = DEFINE;

/**
 * 兩個圖表主要差異在排序和左右對齊
 */
function ByItemOrder({ answers, total, width }) {
  const panding = 20;
  const contentwidth = width - panding * 2; // 左右間距
  const size = 18; // 中文最小 12px
  const bottom = 100; // 底部

  const height = (size + 2) * answers[0].answerQuestions.length + bottom;

  const drawStep = ctx => {
    // console.log('panding:', panding, 'contentWidth:', contentwidth, 'width:', width);
    ctx.textAlign = 'center';

    // 分隔線
    const lineY = height - size * 2;
    ctx.moveTo(panding, lineY);
    ctx.lineTo(width - panding, lineY);
    ctx.stroke();

    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach(step => {
      const x = (step * contentwidth) / 100;
      const y = height - 10;
      // console.log(step, 'x:', panding + x, 'y:', y);

      ctx.moveTo(panding + x, lineY); 
      ctx.lineTo(panding + x, lineY+ 5); // 5為標線的高度
      ctx.stroke();

      ctx.fillText(step, panding + x, y); // 分數
    });
  };

  const drawLine = ctx => {
    // 實線
    const x1 = (total.score * contentwidth) / 100;
    ctx.moveTo(x1, 0);
    ctx.lineTo(x1, height - bottom);
    ctx.stroke();
    // 虛線 setLineDash
    const x2 = (total.range.min * contentwidth) / 100;
    drawDashLine(ctx, x2, 0, x2, height - bottom, 5);
    const x3 = (total.range.max * contentwidth) / 100;
    drawDashLine(ctx, x3, 0, x3, height - bottom, 5);
  };

  const drawOption = (no,ctx, x, y, text, answer) => {
    ctx.fillText(`${text}`, x, y); // 選項數字
    
    if (text === answer) {
      ctx.beginPath();
      ctx.arc(x + 3, y - 3, 6, 0, 2 * Math.PI); // 3 為圓半徑 6 的一半
      ctx.stroke();
    }
  };

  let align = 'right';

  const drawaAnswer = ctx => {
    sortData(1, answers)
      .sort((a, b) => a.sort - b.sort)
      .forEach(({ no, title, answer, values }, index) => {
        const dispyay = `${no}.${title}`;
        if (no === 52) {
          align = 'left';
        }

        const space =
          align === 'right'
            ? contentwidth - ctx.measureText(dispyay).width - panding
            : panding;

        const y = 20 + index * (size + 2); 

        ctx.fillText(dispyay, space, y); // x,y

        //console.log(dispyay,space,title);

        // 選項
        Object.keys(values).forEach(key => {
          const x = (values[key] / 100) * contentwidth;
          drawOption(no,ctx, x, y, key, answer);
          // console.log(no,'text:',key,'answer:',answer ,values[key] );
        });
      });
  };

  useEffect(() => {
    const c = document.getElementById('canvas');
    const ctx = c.getContext('2d');
    ctx.font = `bold ${size}px`;
    // ctx.rect(0, 0, width, height);

    drawLine(ctx);
    drawaAnswer(ctx);
    drawStep(ctx);

    return () => {};
  }, []);

  return (
    <canvas id="canvas" width={width} height={height} style={{ border: '1px solid #000000;' }} />
  );
}

export default ByItemOrder;