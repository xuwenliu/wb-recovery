/* eslint-disable prefer-destructuring */
import React from 'react';

import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

import { uniqueId } from 'lodash/util';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TesteeInfo from '@/pages/scale/components/TesteeInfo';

import DefaultReportTable from './DefaultReportTable';

import { Chart, Geom, Axis, Guide } from 'bizcharts';

import { format } from 'date-fns';

/**
const cols = {
  value: {
    min: 0,
    max: 100,
    ticks: [0, 20, 40, 60, 80, 100],
  },
};
 */

import {defaultBlock} from '@/utils/publicStyles'

const useStyles = makeStyles({
  ...defaultBlock
});

function Page(props) {
  const classes = useStyles();

  const { reports, user, testeeInfo } = props;
  const GROUP1 = '运动性抽动严重度';
  const GROUP2 = '发声性抽动严重度';

  const getItems = (report, group) => {
    const item = {};

    report.scoringResults.forEach(({ scope, scoreName, score }) => {
      if (scope === 'DIMENSIONS') {
        if (scoreName.startsWith(group)) {
          const name = scoreName.substring(group.length, scoreName.length);
          if (name.length > 0) {
            item[name] = score;
          }
        }
      }
    });
    return item;
  };

  const [report] = reports;
  const data1 = [getItems(report, GROUP1)];
  const data2 = [getItems(report, GROUP2)];

  console.log('data2:', data2);

  // const { data } = buildModel();

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
          <Typography className={classes.heading}>记录分数</Typography>
        </ExpansionPanelSummary>
        {/**
           * <ExpansionPanelDetails className={classes.root}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
              <TableBody>
                <TableRow>
                  <TableCell cowSpan={2}>数值</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={4}>轻 度(＜25分)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>简单运动性</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>复杂运动性</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>简单发声性</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>复杂发声性</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
           */}

        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary>
            <Typography className={classes.heading}>运动性抽动</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.root}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>数量</TableCell>
                    <TableCell>频率</TableCell>
                    <TableCell>强度</TableCell>
                    <TableCell>复杂性</TableCell>
                    <TableCell>干扰性</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data1.map(row => (
                    <TableRow key={uniqueId()}>
                      <TableCell>{row.数量}</TableCell>
                      <TableCell>{row.频率}</TableCell>
                      <TableCell>{row.强度}</TableCell>
                      <TableCell>{row.复杂性}</TableCell>
                      <TableCell>{row.干扰性}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary>
            <Typography className={classes.heading}>发声性抽动</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.root}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>数量</TableCell>
                    <TableCell>频率</TableCell>
                    <TableCell>强度</TableCell>
                    <TableCell>复杂性</TableCell>
                    <TableCell>干扰性</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data2.map(row => (
                    <TableRow key={uniqueId()}>
                      <TableCell>{row.数量}</TableCell>
                      <TableCell>{row.频率}</TableCell>
                      <TableCell>{row.强度}</TableCell>
                      <TableCell>{row.复杂性}</TableCell>
                      <TableCell>{row.干扰性}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </ExpansionPanel>
    </div>
  );
}

export default Page;
