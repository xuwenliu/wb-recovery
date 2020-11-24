/* eslint-disable prefer-destructuring */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { uniqueId } from 'lodash/util';

import TesteeInfo from '@/pages/scale/components/TesteeInfo';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableCellWidth: {
    width: '15%',
  },
  root: {
    display: 'block',
  },
  heading: {
    fontSize: '18px',
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

    const [answer] = answers.filter(i => i.scaleName !== '高危因素');

    answer.answerQuestions.forEach(q => {
      const [opt] = q.answerOptions.filter(o => o.option * 1 === q.objectAnswer * 1);

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
    const [report] = reports.filter(i => i.scaleName !== '高危因素');
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
            总分：{report.score} {report.scoreExplain.join()}
            <p style={{ margin: '10px' }}>具體情況請諮詢專家</p>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary>
          <Typography className={classes.heading}>达标</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableBody>
                {items.success.map(item => (
                  <TableRow key={uniqueId()}>
                    <TableCell align="left">{item.questionContent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      {items.fail.length > 0 && (
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary>
            <Typography className={classes.heading}>未达标</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.root}>
            <TableContainer component={Paper}>
              <Table className={classes.table}>
                <TableBody>
                  {items.fail.map(item => (
                    <TableRow key={uniqueId()}>
                      <TableCell align="left">{item.questionContent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )}
    </div>
  );
}

export default Page;
