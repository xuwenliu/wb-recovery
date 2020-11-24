import React from 'react';

import Scale from '@/pages/scale/components/ScaleAnswer';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

function replact(value, a, b) {
  if (value) {
    return value.replace(a, b);
  }

  return '';
}

function QuestionContent({ question }) {
  console.log('FMFM ', question);

  const { tips, questionNo, questionContent = {} } = question;
  const { 辅助物 = '', 方法 = '', 评分 = '', 难度值 = '', title = '' } = JSON.parse(
    questionContent
  );

  return (
    <Card>
      <CardHeader
        title={tips}
        subheader={
          <span>
            {questionNo}.{title}
          </span>
        }
      />
      <CardContent>
        <Typography paragraph>辅助物:</Typography>
        <Typography paragraph variant="body2" color="textSecondary" component="p">
          {replact(辅助物, /[/n]/g, '\n')}
        </Typography>
        <Typography paragraph>方法:</Typography>
        <Typography paragraph variant="body2" color="textSecondary" component="p">
          {replact(方法, /[/n]/g, '\n')}
        </Typography>
        {评分 ? (
          <div>
            <Typography paragraph>评分:</Typography>
            <Typography paragraph variant="body2" color="textSecondary" component="p">
              {replact(评分, /[/n]/g, '\n')}
            </Typography>
          </div>
        ) : null}
        <Typography paragraph>难度值:</Typography>
        <Typography paragraph variant="body2" color="textSecondary" component="p">
          {replact(难度值, /[/n]/g, '\n')}
        </Typography>
      </CardContent>
    </Card>
  );
}

function Page({ model, answer, submit }) {
  return (
    <Scale model={model} submit={submit} answer={answer} renderQuestionContent={QuestionContent} />
  );
}

export default Page;
