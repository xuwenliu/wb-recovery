/* eslint-disable prefer-destructuring */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import { uniqueId } from 'lodash/util';

import TesteeInfo from '@/pages/scale/components/TesteeInfo';
import { defaultBlock } from '@/utils/publicStyles';

const useStyles = makeStyles({
  ...defaultBlock,
  tableCellWidth: {
    width: '15%',
  },
  content: {
    padding: 5,
    letterSpacing: 1,
  },
});

function Page(props) {
  const classes = useStyles();

  const { reports, user, testeeInfo, answers } = props;

  const getItems = () => {
    const result = {
      success: [],
      fail: [],
    };

    const [answer] = answers.filter((i) => i.scaleName !== '高危因素');

    answer.answerQuestions.forEach((q) => {
      const [opt] = q.answerOptions.filter((o) => o.option * 1 === q.objectAnswer * 1);

      const value = {
        questionNo: q.questionNo,
        questionContent: q.questionContent,
        objectAnswer: q.objectAnswer,
        opt,
      };

      if (opt && opt.optionScore * 1 !== 0) {
        result.fail.push(value);
      } else {
        result.success.push(value);
      }
    });

    return result;
  };

  const getReport = () => {
    const [report] = reports.filter((i) => i.scaleName !== '高危因素');
    const [result] = report.scoringResults;
    return result;
  };

  const items = getItems();

  const report = getReport();

  return (
    <div>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary>
          <Typography className={classes.heading}>个案信息</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <TesteeInfo user={user} testeeInfo={testeeInfo} />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary>
          <Typography className={classes.heading}>报告结果</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <div>
            <p style={{ margin: '10px' }}>{report.scoreExplain.join()}</p>
            <p style={{ margin: '10px' }}>具體情況請諮詢專家</p>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary>
          <Typography className={classes.heading}>达标</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          {items.success.map((item) => (
            <Card>
              <CardContent>
                <Typography key={uniqueId()} align="left" className={classes.content}>
                  {item.questionContent}
                </Typography>
              </CardContent>
              <Divider />
            </Card>
          ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>

      {items.fail.length > 0 && (
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary>
            <Typography className={classes.heading}>未达标</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.root}>
            {items.fail.map((item) => (
              <Card>
                <CardContent>
                  <Typography key={uniqueId()} align="left" className={classes.content}>
                    {item.questionContent}
                  </Typography>
                </CardContent>
                <Divider />
              </Card>
            ))}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )}
    </div>
  );
}

export default Page;
