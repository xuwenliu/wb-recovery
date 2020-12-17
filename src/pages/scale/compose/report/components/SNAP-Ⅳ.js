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
import { defaultBlock } from '@/utils/publicStyles';

const useStyles = makeStyles({
  ...defaultBlock,
});

/**
   注意力分散：教师2.56 父母1.78
   多动/冲动：教师1.78 父母1.44
   注意力分散+多动/冲动：教师2.00 父母1.67  
   对立违抗：教师1.38 父母1.88
 */

const sortIndex = {
  注意力分散: 1,
  '多动/冲动': 2,
  '注意力分散+多动/冲动': 3,
  对立违抗性障碍: 4,
  品行障碍: 5,
  创伤后应激障碍: 6,
  适应障碍: 7,
};

const ref = {
  'SNAP-Ⅳ-家长评估量表': {
    注意力分散: 1.78,
    '多动/冲动': 1.44,
    对立违抗性障碍: 1.88,
    '注意力分散+多动/冲动': 1.67,
  },
  'SNAP-Ⅳ-教师评估量表': {
    注意力分散: 2.56,
    '多动/冲动': 1.78,
    对立违抗性障碍: 1.38,
    '注意力分散+多动/冲动': 2.0,
  },
};

function Page(props) {
  const classes = useStyles();

  const { reports, user, testeeInfo } = props;
  const [report] = reports;

  const getRecords = () => {
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

    return records.sort((a, b) => {
      return sortIndex[a.name] - sortIndex[b.name];
    });
  };

  /**
   * 注意力分散+多动 是否等於 注意力不集中+多动/冲动
   * 分數是否等於 [注意力分散+多动] 相加
   */

  const records = getRecords();

  const mapping = ref[report.scaleName];

  console.log('mapping:', mapping);
  console.log('records:', records);

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
                  <TableCell align="center">结果</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map(row => (
                  <TableRow key={uniqueId()}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.average}</TableCell>
                    <TableCell align="center">
                      {row.average > mapping[row.name] && '阴性'}
                    </TableCell>
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
