/* eslint-disable prefer-destructuring */
import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { Chart, Geom, Axis, Legend, Tooltip, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TesteeInfo from '@/pages/scale/components/TesteeInfo';
import ScaleSuggestList from '@/pages/scale/components/ScaleSuggestList';
import { defaultBlock } from '@/utils/publicStyles';

const useStyles = makeStyles({
  ...defaultBlock,
});

const sortMapping = {
  视觉追踪: 1,
  上肢关节活动能力: 2,
  抓握能力: 3,
  操作能力: 4,
  手眼协调: 5,
  总分: 6,
};

const sorting = (a, b) => {
  return sortMapping[a.name] - sortMapping[b.name];
};

const columns = [
  { id: 'name', label: '评估能区', minWidth: 170 },
  { id: '标准分', label: '标准分', minWidth: 100 },
  { id: '原始分', label: '原始分', minWidth: 100 },
  { id: '能力值', label: '能力值', minWidth: 100 },
  { id: '难度值', label: '难度值', minWidth: 100 },
];

const getInfo = (report) => {
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

  const [checks, setChecks] = useState([]);

  const { reports, user, testeeInfo, suggests } = props;

  const buildModel = () => {
    const model = {
      info: {}, // 受測者資訊
      data: [],
    };

    const { data } = model;

    reports.forEach((report) => {
      const info = getInfo(report);
      Object.keys(info).forEach((key) => {
        const values = info[key];
        data.push({ name: key, ...values });
      });
    });

    return model;
  };

  const { data } = buildModel();

  const obj = {};
  const obj1 = {};
  const arr = [];
  data.forEach((item) => {
    // const key = `${item.name}`
    // const value = item.原始分
    // const value1 = item.标准分
    // obj[key] = value;
    // obj1[key] = value1
    obj[`${item.name}`] = item.原始分;
    obj1[`${item.name}`] = item.标准分;
  });
  arr.push(
    {
      name: '原始分',
      ...obj,
    },
    {
      name: '标准分',
      ...obj1,
    },
  );
  console.log('arr:', arr);
  const ds = new DataSet();
  const dv = ds.createView().source(arr);
  dv.transform({
    type: 'fold',
    fields: ['视觉追踪', '上肢关节活动能力', '抓握能力', '操作能力', '手眼协调'],
    // 展开字段集
    key: '项目',
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
          <Typography className={classes.heading}>评估内容</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <Grid container spacing={2}>
            <Paper style={{ width: '100%', margin: '1%', paddingTop: '5px' }} variant="outlined">
              <Grid item>
                <Chart data={dv} height={300} forceFit>
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
                    {Object.keys(data.sort(sorting)).map((key) => {
                      const row = data[key];
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                          {columns.map((column) => {
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
          <ExpansionPanelSummary>
            <Typography className={classes.heading}>训练目标</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.root}>
            <ScaleSuggestList
              items={suggests}
              showType={false}
              showSubScale={false}
              /**
              value={checks}
              onChange={vs => {
                setChecks(vs);
              }}
               */
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )}
    </div>
  );
}

export default Page;
