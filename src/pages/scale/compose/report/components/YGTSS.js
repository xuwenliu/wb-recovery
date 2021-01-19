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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
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

import { defaultBlock } from '@/utils/publicStyles';

const useStyles = makeStyles({
  ...defaultBlock,
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

  const getTotalItems = (report, group) => {
    const item = {};

    report.scoringResults.forEach(({ scope, scoreName, score }) => {
      if (scope === 'DIMENSIONS') {
        if (scoreName.startsWith(group)) {
          const name = scoreName.substring(group.length, scoreName.length);
          if (name.length === 0) {
            item[group] = score;
          }
        }
      }
    });
    return item;
  };

  const getTotalScore = (report) => {
    const totalScore = {};
    report.scoringResults.forEach(({ scope, scoreName, score }) => {
      if (scope === 'TOTAL_SCORE') {
        if (scoreName === '总分') {
          totalScore[scoreName] = score;
        }
      }
    });
    return totalScore;
  };
  const getOtherScore = (report) => {
    const OtherScore = {};
    report.scoringResults.forEach(({ scope, scoreName, score }) => {
      if (scope === 'DIMENSIONS') {
        if (scoreName === '功能损伤') {
          OtherScore[scoreName] = score;
        }
      }
    });
    return OtherScore;
  };

  const [report] = reports;
  const data1 = [getItems(report, GROUP1)];
  const data2 = [getItems(report, GROUP2)];

  const totalData1 = [getTotalItems(report, GROUP1)];
  const totalData2 = [getTotalItems(report, GROUP2)];
  const totalData3 = [getOtherScore(report)];

  const score1 = Number(totalData1.map((i) => i.运动性抽动严重度));
  const score2 = Number(totalData2.map((i) => i.发声性抽动严重度));
  const score3 = Number(totalData3.map((i) => i.功能损伤));
  const totalScore = [getTotalScore(report)];
  const buttonScore1 = score1 + score3;
  const buttonScore2 = score2 + score3;

  console.log('report:', report);

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
          <Typography className={classes.heading}>测试结果</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={6} />
                  <TableCell align="center">严重程度</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center" rowSpan={2}>
                    运动性
                  </TableCell>
                  <TableCell align="center">数量</TableCell>
                  <TableCell align="center">频率</TableCell>
                  <TableCell align="center">强度</TableCell>
                  <TableCell align="center">复杂性</TableCell>
                  <TableCell align="center">干扰性</TableCell>
                  {totalData1.map((row) => (
                    <TableCell align="center" rowSpan={2} key={uniqueId()}>
                      {row.运动性抽动严重度}
                    </TableCell>
                  ))}
                </TableRow>
                {data1.map((row) => (
                  <TableRow key={uniqueId()}>
                    <TableCell align="center">{row.数量}</TableCell>
                    <TableCell align="center">{row.频率}</TableCell>
                    <TableCell align="center">{row.强度}</TableCell>
                    <TableCell align="center">{row.复杂性}</TableCell>
                    <TableCell align="center">{row.干扰性}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell align="center" rowSpan={2}>
                    发声性
                  </TableCell>
                  <TableCell align="center">数量</TableCell>
                  <TableCell align="center">频率</TableCell>
                  <TableCell align="center">强度</TableCell>
                  <TableCell align="center">复杂性</TableCell>
                  <TableCell align="center">干扰性</TableCell>
                  {totalData2.map((row) => (
                    <TableCell align="center" rowSpan={2} key={uniqueId()}>
                      {row.发声性抽动严重度}
                    </TableCell>
                  ))}
                </TableRow>
                {data2.map((row) => (
                  <TableRow key={uniqueId()}>
                    <TableCell align="center">{row.数量}</TableCell>
                    <TableCell align="center">{row.频率}</TableCell>
                    <TableCell align="center">{row.强度}</TableCell>
                    <TableCell align="center">{row.复杂性}</TableCell>
                    <TableCell align="center">{row.干扰性}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    总分：
                  </TableCell>
                  <TableCell align="center">{totalScore.map((row) => row.总分)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7}>结论</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>简单运动性</TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
                    <FormControlLabel
                      control={
                        buttonScore1 < 25 ? (
                          <CheckBoxIcon color="primary" />
                        ) : (
                          <CheckBoxOutlineBlankIcon />
                        )
                      }
                      label="轻度"
                    />
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
                    <FormControlLabel
                      control={
                        buttonScore1 >= 25 && buttonScore1 <= 50 ? (
                          <CheckBoxIcon color="primary" />
                        ) : (
                          <CheckBoxOutlineBlankIcon />
                        )
                      }
                      label="中度"
                    />
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
                    <FormControlLabel
                      control={
                        buttonScore1 > 50 ? (
                          <CheckBoxIcon color="primary" />
                        ) : (
                          <CheckBoxOutlineBlankIcon />
                        )
                      }
                      label="重度"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>复杂运动性</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>简单发声性</TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
                    <FormControlLabel
                      control={
                        buttonScore2 < 25 ? (
                          <CheckBoxIcon color="primary" />
                        ) : (
                          <CheckBoxOutlineBlankIcon />
                        )
                      }
                      label="轻度"
                    />
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
                    <FormControlLabel
                      control={
                        buttonScore2 >= 25 && buttonScore2 <= 50 ? (
                          <CheckBoxIcon color="primary" />
                        ) : (
                          <CheckBoxOutlineBlankIcon />
                        )
                      }
                      label="中度"
                    />
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
                    <FormControlLabel
                      control={
                        buttonScore2 > 50 ? (
                          <CheckBoxIcon color="primary" />
                        ) : (
                          <CheckBoxOutlineBlankIcon />
                        )
                      }
                      label="重度"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>复杂发声性</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

export default Page;
