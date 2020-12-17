/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useState, useRef } from 'react';

import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TesteeInfo from '@/pages/scale/components/TesteeInfo';
import ScaleSuggestList from '@/pages/scale/components/ScaleSuggestList';
import { uniqueId } from 'lodash/util';

import { Chart, Geom, Axis, Guide } from 'bizcharts';
import tables from './PDMS-TABLES';
import { defaultBlock } from '@/utils/publicStyles'

const { Line } = Guide;

// 定义度量
const cols = {
  value: {
    min: 0,
    max: 20,
    ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  },
};

const cols2 = {
  value: {
    min: 35,
    max: 165,
    ticks: [],
  },
};

for (let i = cols2.value.min; i <= cols2.value.max; i += 5) {
  cols2.value.ticks.push(i);
}

const getDate1Level = value => {
  if (value >= 1 && value <= 3) {
    return 1;
  }
  if (value >= 4 && value <= 5) {
    return 2;
  }
  if (value >= 6 && value <= 7) {
    return 3;
  }
  return 0;
};



const useStyles = makeStyles({
  ...defaultBlock
});


const getValue = value => {
  return value.split('|')[0];
};

function Page(props) {
  const classes = useStyles();
  const body = useRef(null);

  const { scaleName: title, reports, totalReport, id, user, testeeInfo, suggests } = props;

  const [width, setWidth] = useState(0);

  const itemStatus = () => {
    let columns = [{ id: 'action', label: '动作', minWidth: 100 }];

    const data = {};

    Object.keys(tables).forEach(key => {
      columns.push({
        id: key,
        label: key,
      });

      const numbers = tables[key];

      Object.keys(numbers).forEach(action => {
        if (data[action] === undefined) {
          data[action] = {};
        }

        const ary = numbers[action];
        data[action][key] = ary.join(',');
      });
    });

    //console.log('columns:', columns);

    return {
      columns,
      data,
    };
  };

  const buildModel = () => {
    const model = {
      info: {}, // 受測者資訊
      scoreInfo: [], // 分數紀錄
      total: {
        粗大运动: 0,
        精细运动: 0,
        score: 0,
      },
      商: {},
      百分位: {},
      data1: [],
      data2: [],
    };

    const { scoreInfo, data1, data2, total } = model;

    reports
      .sort((a, b) => a.scaleType.localeCompare(b.scaleType, 'zh-CN'))
      .forEach(report => {
        const { scaleType, scaleName, scoringResults } = report;

        const info = {
          scaleType,
          scaleName,
        };

        scoringResults.forEach(result => {
          if (result.scoreName === '标准分') {
            const score = 1 * getValue(result.score);

            info[result.scoreName] = {
              粗大运动: scaleType === '粗大运动' ? score : null,
              精细运动: scaleType === '精细运动' ? score : null,
              score,
            };

            data1.push({ title: info.scaleName, value: score, level: getDate1Level(score) });

            total.粗大运动 += info[result.scoreName].粗大运动;
            total.精细运动 += info[result.scoreName].精细运动;
            total.score += info[result.scoreName].score;
          } else {
            info[result.scoreName] = getValue(result.score);
          }
        });

        scoreInfo.push(info);
      });

    totalReport.scoringResults.forEach(result => {
      let name2 = result.scoreName;
      if (result.scoreName.endsWith('商')) {
        name2 = `${result.scoreName.substring(0, result.scoreName.length - 1)}-商`;
      } else if (result.scoreName.endsWith('百分位')) {
        name2 = `${result.scoreName.substring(0, result.scoreName.length - 3)}-百分位`;
      }

      const [action, name] = name2.split('-');

      if (name === '商' || name === '百分位') {
        model[name][action] = getValue(result.score);
        if (name === '商') {
          data2.push({ title: action, value: model[name][action] * 1 });
        }
      }
    });

    return model;
  };

  const model = buildModel();
  const { scoreInfo, data1, data2, total } = model;
  const status = itemStatus();

  useEffect(() => {
    setWidth(body.current.clientWidth * 0.9);
    return () => {};
  }, []);

  console.log('width:', width);

  return (
    <div ref={body}>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>受测者信息</Typography>
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
          <Typography className={classes.heading}>第二部分：记录分数</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>PDMS-2</TableCell>
                  <TableCell align="right">原始分</TableCell>
                  <TableCell align="right">相当年龄</TableCell>
                  <TableCell align="right">百分位</TableCell>
                  <TableCell align="center" colSpan={3}>
                    标准分
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreInfo.map(row => (
                  <TableRow key={uniqueId()}>
                    <TableCell component="th" scope="row">
                      {row.scaleName}
                    </TableCell>
                    <TableCell align="right">{row.原始总分}</TableCell>
                    <TableCell align="right">{row.相当年龄}</TableCell>
                    <TableCell align="right">{row.百分位}</TableCell>
                    <TableCell align="right">{row.标准分.粗大运动}</TableCell>
                    <TableCell align="right">{row.标准分.精细运动}</TableCell>
                    <TableCell align="right">{row.标准分.score}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    标准分总和
                  </TableCell>
                  <TableCell align="right">{total.粗大运动}</TableCell>
                  <TableCell align="right">{total.精细运动}</TableCell>
                  <TableCell align="right">{total.score}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right" />
                  <TableCell align="right">GMQ</TableCell>
                  <TableCell align="right">FMQ</TableCell>
                  <TableCell align="right">TMQ</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    发育商
                  </TableCell>
                  <TableCell align="right">{model.商.粗大运动}</TableCell>
                  <TableCell align="right">{model.商.精细运动}</TableCell>
                  <TableCell align="right">{model.商.总运动}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    百分位
                  </TableCell>
                  <TableCell align="right">{model.百分位.粗大运动}</TableCell>
                  <TableCell align="right">{model.百分位.精细运动}</TableCell>
                  <TableCell align="right">{model.百分位.总运动}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>第三部分：分数简图</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <Grid container spacing={2}>
            <Paper style={{ width: '100%', margin: '1%', paddingTop: '5px' }} variant="outlined">
              <Grid item>
                <Chart height={400} data={data1} scale={cols} forceFit>
                  <Axis name="title" />
                  <Axis name="value" />
                  <Geom
                    type="point"
                    position="title*value"
                    shape="square"
                    color={['level', ['#ff0000', '#00ff00']]}
                  />
                  <Geom type="line" position="title*value" shape="dot" />
                  <Guide>
                    <Guide.Region
                      start={['min', 8]} // 辅助框起始位置，值为原始数据值，支持 callback
                      end={['max', 12]} // 辅助框结束位置，值为原始数据值，支持 callback
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
              <Grid item>
                <Chart height={400} data={data2} scale={cols2} forceFit>
                  <Axis name="title" />
                  <Axis name="value" />
                  <Geom type="point" position="title*value" shape="square" />
                  <Geom type="line" position="title*value" shape="dot" />
                  <Guide>
                    <Guide.Region
                      start={['min', 90]} // 辅助框起始位置，值为原始数据值，支持 callback
                      end={['max', 120]} // 辅助框结束位置，值为原始数据值，支持 callback
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
            </Paper>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>项目完成情况图</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <TableContainer component={Paper}>
            {
              /**
               * https://www.zhihu.com/question/28707490
               * 要修改旋轉的中心
               */
            }
            <Table
              className={classes.table}
              style={{ transform2: 'rotate(90deg)', height: `${width*0.9}px` }}
              size="small"
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  {status.columns.map(column => (
                    <TableCell
                      key={uniqueId()}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(status.data).map(key => {
                  const row = status.data[key];
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={uniqueId()}>
                      <TableCell>{key}</TableCell>
                      {status.columns.map(column => {
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
        </ExpansionPanelDetails>
      </ExpansionPanel>
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
