/* eslint-disable prefer-destructuring */
import React, { useEffect, useState, useRef } from 'react';

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
import { Chart, Geom, Axis, Guide, Tooltip, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import TesteeInfo from '@/pages/scale/components/TesteeInfo';
import ScaleSuggestList from '@/pages/scale/components/ScaleSuggestList';
import GMFM66 from './GMFM-66';

import { defaultBlock } from '@/utils/publicStyles';

const useStyles = makeStyles({
  ...defaultBlock,
});

const columns = [
  { id: 'name', label: '评估能区', minWidth: 170 },
  { id: '原始分', label: '原始分', minWidth: 100 },
  { id: '标准分', label: '标准分', minWidth: 100 },
  { id: '结果', label: '结果（%）', minWidth: 100 },
];

const sortMapping = {
  卧位与翻身: 1,
  坐位: 2,
  爬与跪: 3,
  站立位: 4,
  '行走、跑、跳': 5,
  总分: 6,
};

const sortData = ary => {
  return ary.sort((a, b) => sortMapping[a.name] - sortMapping[b.name]);
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
  const body = useRef(null);

  const [width, setWidth] = useState(0);
  const { reports, user, testeeInfo, suggests, answers } = props;

  const buildModel = () => {
    const model = {
      info: {},
      data: [],
      chartData: [],
      total: {},
    };

    const { data, chartData, total } = model;

    reports
      .sort((a, b) => a.scaleType.localeCompare(b.scaleType, 'zh-CN'))
      .forEach(report => {
        model.scaleName = report.scaleName;
        const info = getInfo(report);
        Object.keys(info).forEach(key => {
          const values = info[key];

          data.push({ name: key, ...values });

          if (key !== '总分') {
            chartData.push({ name: key, ...values });
          } else {
            const {
              总分: { 能力值 },
            } = info;
            const [SCORE, ERROR] = 能力值.split('|');
            // 能力值 46.67|1.05
            total.score = SCORE; // 標準分
            total.error = ERROR; //
            total.range = {
              min: (SCORE * 1 - ERROR * 2).toFixed(2),
              max: (SCORE * 1 + ERROR * 2).toFixed(2),
            }; // 標準分加減兩個標準差
          }
        });
      });
    return model;
  };

  const { scaleName, data, chartData, total } = buildModel();

  const obj = {};
  const obj1 = {};
  const arr = [];
  chartData.forEach(item => {
    const key = `${item.name}`;
    const value = item.原始分;
    const value1 = item.标准分;
    obj[key] = value;
    obj1[key] = value1;
  });
  arr.push(
    {
      name: '原始分',
      ...obj,
    },
    {
      name: '标准分',
      ...obj1,
    }
  );

  const ds = new DataSet();
  const dv = ds.createView().source(arr);
  dv.transform({
    type: 'fold',
    fields: ['卧位与翻身', '坐位', '爬与跪', '站立位', '行走、跑、跳'],
    // 展开字段集
    key: '项目',
    // key字段
    value: '分数', // value字段
  });

  useEffect(() => {
    setWidth(body.current.clientWidth * 0.9);
    return () => {};
  }, []);

  return (
    <div ref={body}>
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
          <Typography className={classes.heading}>评估内容</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <Grid container spacing={2}>
            <Paper style={{ width: '100%', margin: '1%', paddingTop: '5px' }} variant="outlined">
              <Grid item>
                <Chart data={dv} forceFit>
                  <Axis name="项目" />
                  <Axis name="分数" />
                  <Legend />
                  <Tooltip
                    crosshairs={{
                      type: 'y',
                    }}
                  />
                  <Geom
                    type="interval"
                    position="项目*分数"
                    color="name"
                    adjust={[
                      {
                        type: 'dodge',
                        marginRatio: 1 / 32,
                      },
                    ]}
                  />
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
                    {Object.keys(sortData(data)).map(key => {
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

      {scaleName === 'GMFM66' && width && <GMFM66 answers={answers} total={total} width={width} />}

      {suggests && (
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>训练目标</Typography>
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
