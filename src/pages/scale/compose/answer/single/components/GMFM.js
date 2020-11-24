import React from 'react';

import Scale from '@/pages/scale/components/ScaleAnswer';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

function QuestionContent({ question }) {
  const { tips, questionNo, questionContent } = question;
  const { 方法 = '', 位置 = '', title } = JSON.parse(questionContent);
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
        <Typography paragraph>方法:</Typography>
        <Typography paragraph variant="body2" color="textSecondary" component="p">
          {方法.replace(/[/n]/g, '\n')}
        </Typography>
        <Typography paragraph>位置:</Typography>
        <Typography paragraph variant="body2" color="textSecondary" component="p">
          {位置.replace(/[/n]/g, '\n')}
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
