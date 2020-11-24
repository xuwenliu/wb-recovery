/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

import Scale from '@/pages/scale/components/ScaleAnswer';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardContent from '@material-ui/core/CardContent';
// import Image from '@/components/Common/Image';

const ageMap = {
  '0-6岁儿童能力发展检核表（5岁）': '5',
  '0-6岁儿童能力发展检核表（3岁）': '3',
  '0-6岁儿童能力发展检核表（2岁6个月）': '2_6',
  '0-6岁儿童能力发展检核表（4岁）': '4',
  '0-6岁儿童能力发展检核表（6岁）': '6',
  '0-6岁儿童能力发展检核表（2岁）': '2',
  '0-6岁儿童能力发展检核表（3岁6个月）': '3_6',
};

const imageMap = {
  '2_4': ['杯子.jpg','飞机.jpg','铅笔.jpg','鞋子.jpeg','钥匙.jpg','鱼.jpeg'],
  '2_8': ['杯子.jpg','飞机.jpg','铅笔.jpg','鞋子.jpeg','钥匙.jpg','鱼.jpeg'],
  '3_5': ['小蜜蜂.jpg', '花盆.jpeg'],
  '3_6_5': ['小蜜蜂.jpg', '花盆.jpeg'],
  '3_6_8': ['杯子.jpg','飞机.jpg','铅笔.jpg','鞋子.jpeg','钥匙.jpg','鱼.jpeg'],
  '3_6_9': ['大圆圈和小圆圈.png'],
  '3_6_10': ['红色.jpg', '黄色.png', '蓝色.jpeg', '绿色.jpeg'],
  '3_8': ['杯子.jpg','飞机.jpg','铅笔.jpg','鞋子.jpeg','钥匙.jpg','鱼.jpeg'],
  '3_9': ['杯子.jpg','飞机.jpg','铅笔.jpg','鞋子.jpeg','钥匙.jpg','鱼.jpeg'],
  '4_6': ['红色.jpg', '黄色.png', '蓝色.jpeg', '绿色.jpeg'],
  '4_9': ['杯子.jpg','飞机.jpg','铅笔.jpg','鞋子.jpeg','钥匙.jpg','鱼.jpeg'],
  '4_10': ['十个小黑点.jpg'],
  '5_5': ['菱形.jpg','三角形.jpeg','十字.jpeg','正方形.jpg'],
  '5_7': ['红色.jpg', '黄色.png', '蓝色.jpeg', '绿色.jpeg'],
  '5_8': ['十个小黑点.jpg'],
  '5_9': ['数字.jpg'],
  '6_3': ['工字.jpg', '木字.png', '人字.jpeg', '田字.png'],
  '6_6': ['十个小黑点.jpg'],
};

const getImageList = ({ model, question }) => {
  const age = ageMap[model.scaleName];
  const list = imageMap[`${age}_${question.questionNo}`];
  if (list) {
    return list.map(i => {
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
      <div style={{display:'grid',gridTemplateColumns: '50% 50%', justifyItems: 'center'}}>
        {images.map(image => (
          <img src={`/images/scale/taipei2/${image}`} width="50%"/>
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
