/* eslint-disable prefer-destructuring */
import React from 'react';

import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TesteeInfo from '@/pages/scale/components/TesteeInfo';
import ScaleSuggestList from '@/pages/scale/components/ScaleSuggestList';

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

const columns = [
  { id: 'scaleName', label: '名称', minWidth: 170 },
  { id: '相当月龄', label: '相当月龄', minWidth: 100 },
  { id: '发育商', label: '发育商', minWidth: 100 },
];

const getInfo = (reportDate, report) => {
  const { scaleType, scaleName, scoringResults } = report;

  const info = {
    scaleType,
    scaleName,
    date: format(reportDate, 'yyyy-MM-dd'),
  };

  scoringResults.forEach(({ scoreName, score }) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(score)) {
      info[scoreName] = score;
    } else {
      info[scoreName] = score * 1;
    }
  });

  return info;
};

function Page(props) {
  const classes = useStyles();

  const { reportDate, reports, user, testeeInfo, suggests } = props;

  const buildModel = () => {
    const model = {
      info: {}, // 受測者資訊
      data: [],
    };

    const { data } = model;

    reports
      .filter(a => a.scaleName !== '评估状态')
      .sort((a, b) => a.scaleType.localeCompare(b.scaleType, 'zh-CN'))
      .forEach(report => {
        const info = getInfo(reportDate, report);
        data.push(info);
      });

    return model;
  };

  const { data } = buildModel();

  return (
    <div>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>个案信息</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <TesteeInfo user={user} testeeInfo={testeeInfo} />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>评估结果</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <Grid container spacing={2}>
            <Paper style={{ width: '100%', margin: '1%', paddingTop: '5px' }} variant="outlined">
              <Grid item>
                <Chart data={data} forceFit>
                  <Axis name="scaleName" />
                  <Axis name="发育商" />
                  <Geom type="interval" position="scaleName*发育商" shape="square" />
                  <Guide>
                    <Guide.Region
                      // start={['min', 8]} // 辅助框起始位置，值为原始数据值，支持 callback
                      // end={['max', 12]} // 辅助框结束位置，值为原始数据值，支持 callback
                      style={{
                        lineWidth: 0, // 辅助框的边框宽度
                        fill: '#f80', // 辅助框填充的颜色
                        fillOpacity: 0.1, // 辅助框的背景透明度
                        stroke: '#ccc', // 辅助框的边框颜色设置
                      }} // 辅助框的图形样式属性
                    />
                  </Guide>
                </Chart>
              </Grid>
              <TableContainer className={classes.container}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns.map(column => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map(row => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                          {columns.map(column => {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {
                                  column.label === '发育商' ?
                                  `${row[column.id]  } %` : row[column.id] 
                                }
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

export default Page;
