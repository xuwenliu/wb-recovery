/* eslint-disable prefer-destructuring */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

import { uniqueId } from 'lodash/util';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TesteeInfo from '@/pages/scale/components/TesteeInfo';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
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

  const { reports, user, testeeInfo } = props;

  const getRecords = () => {
    const [report] = reports;
    const records = [];
    report.scoringResults.forEach(({ scoreName, score }) => {
      const [name, field] = scoreName.split('.');

      if (field && field === '均分') {
        records.push({
          name,
          average: score * 1,
        });
      }
    });
    return records;
  };

  const records = getRecords();

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
          <TableContainer key={uniqueId()} component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>项目</TableCell>
                  <TableCell align="center">分值</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map(row => (
                  <TableRow key={uniqueId()}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.average}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

export default Page;
