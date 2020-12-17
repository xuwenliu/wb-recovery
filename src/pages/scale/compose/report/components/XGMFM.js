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
import { Chart, Geom, Axis, Guide } from 'bizcharts';

import TesteeInfo from '@/pages/scale/components/TesteeInfo';
import ScaleSuggestList from '@/pages/scale/components/ScaleSuggestList';

// import { format } from 'date-fns';
import {defaultBlock} from '@/utils/publicStyles'

const useStyles = makeStyles({
  ...defaultBlock
});


const columns = [
  { id: 'name', label: '评估能区', minWidth: 170 },
  { id: '原始分', label: '原始分', minWidth: 100 },
  { id: '标准分', label: '标准分', minWidth: 100 },
  { id: '结果', label: '结果（%）', minWidth: 100 },
];

// TODO .圖表不顯示總分
const cols = {
  value: {
    min: 0,
    max: 100
  }
};

const getInfo = report => {
  const { scoringResults } = report;

  const info = {};

  scoringResults.forEach(({ scoreName, score }) => {
    const [name, field = 'score'] = scoreName.split('.');
    if (info[name] === undefined) {
      info[name] = {};
    }

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(score)) {
      info[name][field] = score;
    } else {
      info[name][field] = score * 1;
    }    
  });
  return info;
};

function Page(props) {
  const classes = useStyles();

  const { reports, user, testeeInfo, suggests } = props;

  const buildModel = () => {
    const model = {
      info: {}, 
      data: [],
      chartData:[],
    };

    const { data,chartData } = model;

    reports
      .sort((a, b) => a.scaleType.localeCompare(b.scaleType, 'zh-CN'))
      .forEach(report => {
        const info = getInfo(report);
        Object.keys(info).forEach(key => {
          const values = info[key];
          data.push({ name: key, ...values });
          if (key !== '总分') {
            chartData.push({ name: key, ...values });
          }
        });
      });

    return model;
  };

  const { data,chartData } = buildModel();

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
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>评估内容</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <Grid container spacing={2}>
            <Paper style={{ width: '100%', margin: '1%', paddingTop: '5px' }} variant="outlined">
              <Grid item>
                <Chart data={chartData} forceFit>
                  <Axis name="name" />
                  <Axis name="结果" />
                  <Geom type="interval" position="name*结果" />
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
                    {Object.keys(data).map(key => {
                      const row = data[key];
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
      {suggests && (
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>评估</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.root}>
            <ScaleSuggestList items={suggests} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )}
    </div>
  );
}

export default Page;
