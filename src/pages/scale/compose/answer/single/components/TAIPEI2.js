/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

import Scale from '@/pages/scale/components/ScaleAnswer';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardContent from '@material-ui/core/CardContent';
// import Image from '@/components/Common/Image';

const ageMap = {
  '0-6岁儿童能力发展检核表 5岁（4岁11个月16天-5岁11个月15天）': '5',
  '0-6岁儿童能力发展检核表 3岁（2岁11个月16天-3岁5个月15天）': '3',
  '0-6岁儿童能力发展检核表 2岁6个月（2岁5个月16天-2岁11个月15天）': '2_6',
  '0-6岁儿童能力发展检核表 4岁（3岁11个月16天-4岁11个月15天）': '4',
  '0-6岁儿童能力发展检核表 6岁（5岁11个月16天-6岁11个月15天）': '6',
  '0-6岁儿童能力发展检核表 2岁（1岁11个月16天-2岁5个月15天）': '2',
  '0-6岁儿童能力发展检核表 3岁6个月（3岁5个月16天-3岁11个月15天）': '3_6',
};

const imageMap = {
  '2_4': ['杯子.png', '飞机.png', '铅笔.png', '鞋子.png', '钥匙.png', '鱼.png'],
  '2_6_8': ['杯子.png', '飞机.png', '铅笔.png', '鞋子.png', '钥匙.png', '鱼.png'],
  '3_5': ['小蜜蜂.png', '小蜜蜂.png', '花盆.png', '花盆.png'],
  '3_8': ['杯子.png', '飞机.png', '铅笔.png', '鞋子.png', '钥匙.png', '鱼.png'],
  '3_9': ['杯子.png', '飞机.png', '铅笔.png', '鞋子.png', '钥匙.png', '鱼.png'],
  '3_10': [
    '钥匙.png',
    '铅笔.png',
    '杯子.png',
    '飞机.png',
    '鞋子.png',
    '鱼.png',
    '钥匙.png',
    '铅笔.png',
  ],
  '3_6_5': ['小蜜蜂.png', '花盆.png', '小蜜蜂.png', '花盆.png'],
  '3_6_8': ['杯子.png', '飞机.png', '铅笔.png', '鞋子.png', '钥匙.png', '鱼.png'],
  '3_6_9': ['大圆圈和小圆圈.png'],
  '3_6_10': ['红色.png', '黄色.png', '蓝色.png', '绿色.png'],
  '4_6': ['红色.png', '黄色.png', '蓝色.png', '绿色.png'],
  '4_7': ['牛和四只小鸟.png'],
  '4_9': ['杯子.png', '飞机.png', '铅笔.png', '鞋子.png', '钥匙.png', '鱼.png'],
  '4_10': ['十个小黑点.jpg'],
  '5_5': ['菱形.png', '三角形.png', '十字.png', '正方形.png'],
  '5_7': ['红色.png', '黄色.png', '蓝色.png', '绿色.png'],
  '5_8': ['十个小黑点.jpg'],
  '5_9': ['数字.jpg'],
  '6_3': ['工字.png', '木字.png', '人字.png', '田字.png'],
  '6_4': ['实景.png'],
  '6_6': ['十个小黑点.jpg'],
  '6_7': ['黑点.png'],
};

const getImageList = ({ model, question }) => {
  const age = ageMap[model.scaleName];
  const list = imageMap[`${age}_${question.questionNo}`];
  if (list) {
    return list.map((i) => {
      return `${age}_${question.questionNo}/${i}`;
    });
  }

  return [];
};

function QuestionContent(params) {
  const { model, question } = params;

  const { tips, questionNo, questionContent } = question;

  const images = getImageList({ model, question });

  return (
    <Card>
      <CardHeader
        title={tips}
        subheader={
          <span>
            {questionNo}.{questionContent}
          </span>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', justifyItems: 'center' }}>
        {images.map((image) => (
          <img src={`/images/scale/taipei2/${image}`} width="50%" />
        ))}
      </div>
    </Card>
  );
}

function Page({ model, answer, submit }) {
  return (
    <Scale model={model} submit={submit} answer={answer} renderQuestionContent={QuestionContent} />
  );
}

export default Page;
