import React, { useState } from 'react';

import Scale from '@/pages/scale/components/ScaleAnswer';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Image from '@/components/Common/Image';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

function QuestionContent({ question }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const { questionContent } = question;
  const {
    image,
    target,
    group,
    question: ques,
    通过标准,
    施测说明,
    方法,
    标准,
    指导,
    步骤,
    注意,
  } = JSON.parse(questionContent);
  // console.log('questionContent==>', JSON.parse(questionContent));
  // console.log('Content==>', questionContent);
  const expandContent = () => {
    if (通过标准) {
      return (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          <Typography paragraph>通过标准:</Typography>
          <Typography paragraph variant="body2" color="textSecondary" component="p">
            {通过标准.replace(/[/n]/g, '\n')}
          </Typography>
          {施测说明 ? (
            <div>
              <Typography paragraph>施测说明:</Typography>
              <Typography paragraph variant="body2" color="textSecondary" component="p">
                {施测说明.replace(/[/n]/g, '\n')}
              </Typography>
            </div>
          ) : null}
          {方法 ? (
            <div>
              <Typography paragraph>方法:</Typography>
              <Typography paragraph variant="body2" color="textSecondary" component="p">
                {方法.replace(/[/n]/g, '\n')}
              </Typography>
            </div>
          ) : null}
        </div>
      );
    }
    if (标准) {
      return (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          <Typography paragraph>标准:</Typography>
          <Typography paragraph variant="body2" color="textSecondary" component="p">
            {标准.replace(/[/n]/g, '\n')}
          </Typography>
          {指导 ? (
            <div>
              <Typography paragraph>指导:</Typography>
              <Typography paragraph variant="body2" color="textSecondary" component="p">
                {指导.replace(/[/n]/g, '\n')}
              </Typography>
            </div>
          ) : null}
          <Typography paragraph>步骤:</Typography>
          <Typography paragraph variant="body2" color="textSecondary" component="p">
            {步骤 && 步骤.replace(/[/n]/g, '\n')}
          </Typography>
          {注意 ? (
            <div>
              <Typography paragraph>注意:</Typography>
              <Typography paragraph variant="body2" color="textSecondary" component="p">
                {注意.replace(/[/n]/g, '\n')}
              </Typography>
            </div>
          ) : null}
        </div>
      );
    }
    return null;
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }; 
  return (
    <Card className={classes.root}>
      <CardHeader title={group} subheader={target} />
      {image ? (
        <Image
          src={`/images/scale/aeps/${image}`}
          title="Paella dish"
        />
      ) : null}
      <CardContent>
        <Typography>{ques}</Typography>
      </CardContent>
      {通过标准 || 标准 ? (
        <CardActions disableSpacing>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
      ) : null}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>{expandContent()}</CardContent>
      </Collapse>
    </Card>
  );
}

function RenderOptionContent({ option }) {
  const { optionContent } = option;
  const { title } = JSON.parse(optionContent);
  return title;
}

function Page({ model, answer, submit }) {
  return (
    <Scale
      model={model}
      submit={submit}
      answer={answer}
      renderQuestionContent={QuestionContent}
      renderOptionContent={RenderOptionContent}
    />
  );
}

export default Page;
