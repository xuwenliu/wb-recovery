/* eslint-disable no-unused-vars */
/* eslint-disable import/no-cycle */
/* eslint-disable no-shadow */
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

import { Chart, Geom, Axis, Tooltip, Guide } from 'bizcharts';

import { format } from 'date-fns';
// import report from '..';

const totalScore = {
  '0-3岁.社会功能': 44,
  '0-3岁.粗大动作': 110,
  '0-3岁.认知能力': 98,
  '0-3岁.社交性沟通': 84,
  '0-3岁.精细动作': 56,
  '0-3岁.适应能力': 64,
  '3-6岁.适应能力': 80,
  '3-6岁.精细动作': 28,
  '3-6岁.社交性沟通': 86,
  '3-6岁.认知能力': 184,
  '3-6岁.粗大动作': 36,
  '3-6岁.社会功能': 66,
};

const cols = {
  value: {
    min: 0,
    max: 100,
    ticks: [0, 20, 40, 60, 80, 100],
  },
};

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
  { id: 'date', label: '测验日期', minWidth: 170 },
  { id: 'max', label: '满分', minWidth: 170 },
  { id: 'total', label: '总分', minWidth: 170 },
  { id: 'percentage', label: '百分比', minWidth: 170 },
];

const getRow = ({ scaleType, scaleName, reportDate, TOTAL_SCORE, 百分比 }) => {
  return {
    date: format(reportDate, 'yyyy-MM-dd'),
    max: totalScore[`${scaleType}.${scaleName}`],
    total: TOTAL_SCORE,
    percentage: `${百分比}%`,
    value: 百分比 * 1, // TOTAL_SCORE * 1,
  };

};

const getInfo = (reportDate, report) => {
  const { scaleType, scaleName, scoringResults } = report;

  const info = {
    scaleType,
    scaleName,
  };

  scoringResults.forEach(({ scoreName, score }) => {
    info[scoreName] = score;
  });
  
  // console.log('info:',info);

  info.rows = [getRow({ scaleType, scaleName, reportDate, ...info })];

  return info;
};

const getHistoryInfo = history => {
  const result = {};

  history.forEach(({ reportDate, reports }) => {
    reports.forEach(report => {
      const { scaleType, scaleName } = report;

      const key = `${scaleType}_${scaleName}`;

      if (result[key] === undefined) {
        result[key] = [];
      }

      const info = getInfo(reportDate, report);
      result[key].push(getRow({ scaleType, scaleName, reportDate, ...info }));
    });
  });

  return result;
};

function Page(props) {
  const classes = useStyles();

  const { reportDate, reports, history, user, testeeInfo, suggests } = props;

  const hi = getHistoryInfo(history);

  const buildModel = () => {
    const model = {
      info: {}, // 受測者資訊
      data: [],
    };

    const { data } = model;

    reports
      .sort((a, b) => a.scaleType.localeCompare(b.scaleType, 'zh-CN'))
      .forEach(report => {
        const { scaleType, scaleName } = report;
        const info = getInfo(reportDate, report);
        const key = `${scaleType}_${scaleName}`;
        const h = hi[key] || [];
        info.rows = [...info.rows, ...h]
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((row, index) => ({ ...row, title: `${index + 1}` }));
        data.push(info);
      });

    return model;
  };

  const { data } = buildModel();

  console.log('data:',data);

  return (
    <div>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel0a-header"
        >
          <Typography className={classes.heading}>个案信息</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <TesteeInfo user={user} testeeInfo={testeeInfo} />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      {data.map(({ scaleName, rows }) => (
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} id="panel2a-header">
            <Typography className={classes.heading}>{scaleName}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.root}>
            <Grid container spacing={2}>
              <Paper style={{ width: '100%', margin: '1%', paddingTop: '5px' }} variant="outlined">
                <Grid item>
                  <Chart height={300} data={rows} scale={cols} forceFit>
                    <Axis name="title"/>
                    <Axis name="value"/>
                    <Tooltip shared/>
                    <Geom type="interval" position="title*value" size={['value', [35, 45]]} />
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
                      {rows.map(row => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                            {columns.map(column => {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {row[column.id]}
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
      ))}
      {suggests && (
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>训练目标</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.root}>
            <ScaleSuggestList items={suggests} showPlan />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )}
    </div>
  );
}

export default Page;
