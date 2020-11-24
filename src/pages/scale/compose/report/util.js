/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-properties */
//求斜边长度
function getBeveling(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

export function drawDashLine(context, x1, y1, x2, y2, dashLen) {
  const len = dashLen === undefined ? 5 : dashLen;
  //得到斜边的总长度
  const beveling = getBeveling(x2 - x1, y2 - y1);
  //计算有多少个线段
  const num = Math.floor(beveling / len);

  for (let i = 0; i < num; i++) {
    context[i % 2 === 0 ? 'moveTo' : 'lineTo'](
      x1 + ((x2 - x1) / num) * i,
      y1 + ((y2 - y1) / num) * i
    );
  }
  context.stroke();
}
