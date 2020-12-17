import React, { useEffect } from 'react';
import { lateralView, clearCanvas } from '@/utils/canvas';

function Chart1({ list = [] }) {
  useEffect(() => {
    const fix_score = {
      感官知觉: 63,
      粗大动作: 75,
      精细动作: 42,
      生活自理: 72,
      沟通: 168,
      认知: 63,
      社会技能: 144,
    };
    const fix_score2 = {
      视觉的运用: 24,
      听觉的运用: 12,
      触觉的运用: 9,
      前庭觉的运用: 9,
      本体绝的运用: 9,
      姿势控制: 15,
      移动力: 24,
      运动与游戏技能: 36,
      抓放能力: 12,
      作业能力: 12,
      工具的使用: 18,
      饮食: 18,
      穿着: 18,
      入厕: 6,
      身体清洁: 30,
      内在语言: 18,
      听的能力: 24,
      说的能力: 27,
      读的能力: 30,
      写的能力: 33,
      非语言沟通: 36,
      物体的恒存性: 3,
      记忆力: 12,
      配对与分类: 27,
      顺序: 6,
      解决问题: 15,
      数的应用: 21,
      人际关系: 18,
      家事技能: 18,
      社区技能: 18,
      休闲活动: 27,
      身心健康: 9,
      安全: 21,
      职前技能: 12,
    };

    if (list && list.length > 0) {
      clearCanvas('view1');
      clearCanvas('view2');

      lateralView('view1', list, '综合发展侧面图（一）', null, fix_score, true);
      lateralView('view2', list, '综合发展侧面图（二）', null, fix_score2, false);
    }
  }, [list]);
  return (
    <div>
      <canvas
        width="1000"
        height="600"
        style={{ marginTop: 30, width: '100%', border: '1px solid #ddd' }}
        id="view1"
      />
      <canvas
        width="1000"
        height="600"
        style={{ margin: '30px 0', width: '100%', border: '1px solid #ddd' }}
        id="view2"
      />
    </div>
  );
}
export default Chart1;
