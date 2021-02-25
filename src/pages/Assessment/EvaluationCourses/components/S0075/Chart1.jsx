import React, { useEffect } from 'react';
import { lateralView, clearCanvas } from '@/utils/canvas';
import { Button } from 'antd';
function Chart1({ list = [], guide }) {
  useEffect(() => {
    const fix_score = {
      视觉应用: 28,
      听觉应用: 24,
      触觉应用: 36,
      味嗅觉刺激: 16,
      前庭及本体觉刺激: 24,
      姿势控制: 56,
      移动能力: 60,
      简单运动技能: 60,
      抓放能力: 32,
      操作能力: 80,
      简单劳作及书写技能: 76,
      饮食: 44,
      如厕: 36,
      清洁与卫生: 60,
      穿著: 64,
      言语机转: 28,
      语言理解: 92,
      口语表达: 100,
      沟通能力: 72,
      物体恒存概念: 12,
      简单因果概念: 12,
      基本物概念: 28,
      颜色概念: 20,
      形状概念: 20,
      比较概念: 16,
      空间概念: 16,
      符号概念: 20,
      数概念: 24,
      顺序概念: 12,
      模仿: 12,
      记忆: 24,
      配对分类: 16,
      逻辑思考: 12,
      解决问题: 16,
      简单阅读: 20,
      自我概念: 28,
      环境适应: 40,
      人际互动: 32,
      游戏特质: 20,
    };

    clearCanvas('view1');
    lateralView(guide.code, 'view1', list, '整体发展侧面图', null, fix_score, false);
  }, [list]);
  return (
    <div>
      <canvas
        width="1200"
        height="600"
        style={{ marginTop: 30, width: '100%', border: '1px solid #ddd' }}
        id="view1"
      />
      <Button
        style={{ margin: 20 }}
        type="primary"
        onClick={() => {
          window.print();
        }}
      >
        打印
      </Button>
    </div>
  );
}
export default Chart1;
