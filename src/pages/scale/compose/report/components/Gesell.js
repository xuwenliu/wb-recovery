/* eslint-disable prefer-destructuring */
import React from 'react';

import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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
import TesteeInfo from '@/pages/scale/components/TesteeInfo';
import { Chart, Geom, Axis, Guide, Legend, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';

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

const columns = [
  { id: 'item', label: '测试能区', minWidth: 150 },
  { id: '实际年龄', label: '实际年龄', minWidth: 100 },
  { id: '发育月龄', label: '发育月龄', minWidth: 100 },
  { id: '发育商', label: '发育商（DQ）', minWidth: 100 },
  { id: 'explain', label: '评价', minWidth: 100 },
];

function Page(props) {
  const classes = useStyles();

  const { reportDate, user, testeeInfo, totalReport } = props;

  const buildModel = () => {
    const model = {
      info: {}, // 受測者資訊
      data: [],
    };

    const { data } = model;

    const map = {};

    totalReport.scoringResults
      // 排序會讓相同項目排在一起
      .sort((a, b) => a.scoreName.localeCompare(b.scoreName, 'zh-CN'))
      .forEach((result) => {
        const { scoreName, score, scoreExplain } = result;
        const [item, name] = scoreName.split('|');
        const list = map[item] || {};

        if (name === '发育商' || name === '发育月龄' || name === '实际年龄') {
          list[name] = score;
          if (name === '发育商') {
            list.explain = scoreExplain.join('');
          }
          map[item] = list;
        }
        // data.push(info);
      });

    Object.keys(map).forEach((name) => {
      data.push({ item: name, ...map[name] });
    });

    return model;
  };

  const { data } = buildModel();

  const obj = {};
  const obj1 = {};
  const arr = [];
  data.forEach((item) => {
    obj[`${item.item}`] = Number(item.实际年龄);
    obj1[`${item.item}`] = Number(item.发育月龄);
  });
  arr.push(
    {
      name: '实际年龄',
      ...obj,
    },
    {
      name: '发育月龄',
      ...obj1,
    },
  );

  const ds = new DataSet();
  const dv = ds.createView().source(arr);
  dv.transform({
    type: 'fold',
    fields: ['大运动', '个人——社会', '精细动作', '适应性', '语言'],
    // 展开字段集
    key: '栏位',
    // key字段
    value: '分数', // value字段
  });

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
          <Typography className={classes.heading}>评估结果</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <Grid container spacing={2}>
            <Paper style={{ width: '100%', margin: '1%', paddingTop: '5px' }} variant="outlined">
              <Grid item>
                <Chart data={dv} height={300} forceFit>
                  <Axis name="栏位" />
                  <Axis name="分数" />
                  <Legend />
                  <Tooltip
                    crosshairs={{
                      type: 'y',
                    }}
                  />
                  <Geom
                    type="interval"
                    position="栏位*分数"
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
                      {columns.map((column) => (
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
                    {data.map((row) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                          {columns.map((column) => {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.label === '发育商' ? `${row[column.id]} %` : row[column.id]}
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
