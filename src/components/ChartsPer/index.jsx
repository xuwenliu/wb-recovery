import React, { useEffect } from 'react';
import { Card, Row, Col } from 'antd';

import { charts, clearCanvas } from '@/utils/canvas';
const ChartsPer = ({ graphData, gender }) => {
  useEffect(() => {
    console.log('graphData', graphData);
    let genderInt = gender === '男' ? 1 : 2;
    let height = null;
    let weight = null;
    let head = null;
    let age = 1;
    if (graphData) {
      head = graphData.mouthHead;
      if (
        graphData.mouthHeight &&
        graphData.mouthHeight.length > 0 &&
        graphData.mouthWeight &&
        graphData.mouthWeight.length > 0
      ) {
        age = 1;
        height = graphData.mouthHeight;
        weight = graphData.mouthWeight;
      }
      if (
        graphData.ageHeight &&
        graphData.ageHeight.length > 0 &&
        graphData.ageWeight &&
        graphData.ageWeight.length > 0
      ) {
        age = 2;
        height = graphData.ageHeight;
        weight = graphData.ageWeight;
      }
    }
    clearCanvas('myCanvas1');
    clearCanvas('myCanvas2');
    // 性别 年龄 曲线类型
    charts('myCanvas1', genderInt, age, 1, { height, weight }); // 身高体重百分比图
    charts('myCanvas2', genderInt, age, 3, { head }); // 头围
  }, [graphData]);
  return (
    <Card>
      <Row>
        <canvas id="myCanvas1" width="1000" height="1200"></canvas>
        <canvas id="myCanvas2" width="1000" height="1200"></canvas>
      </Row>
    </Card>
  );
};

export default ChartsPer;
