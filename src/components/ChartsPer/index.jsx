import React, { useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import moment from 'moment';

import charts from '@/utils/canvas';
const ChartsPer = ({ graphData, gender }) => {
  function clearCanvas(canvas) {
    var c = document.getElementById(canvas);
    var cxt = c.getContext('2d');
    cxt.clearRect(0, 0, c.width, c.height);
  }

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
        <Col span={12}>
          <canvas id="myCanvas1" width="900" height="1200" style={{ width: '100%' }}></canvas>
        </Col>
        <Col span={12}>
          <canvas id="myCanvas2" width="900" height="1200" style={{ width: '100%' }}></canvas>
        </Col>
      </Row>
    </Card>
  );
};

export default ChartsPer;
