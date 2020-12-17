/* eslint-disable prefer-destructuring */
import React from 'react';

import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Slider from '@material-ui/core/Slider';
import TesteeInfo from '@/pages/scale/components/TesteeInfo';
import ScaleSuggestList from '@/pages/scale/components/ScaleSuggestList';

import {defaultBlock} from '@/utils/publicStyles'

import Slider2 from '../Slider';

const useStyles = makeStyles({
  ...defaultBlock
});


const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 60,
    label: '60',
  },
  {
    value: 80,
    label: '80',
  },
  {
    value: 100,
    label: '100',
  },
];

const scoreScope = {
  自理能力: [
    { name: '进食功能受限', range: '0.0-20.0' },
    { name: '初步参与生活自理', range: '20.1-40.0' },
    { name: '初步更衣功能', range: '41.1-50.0' },
    { name: '基本盥洗与更衣', range: '50.1-70.0' },
    { name: '进阶梳洗与更衣', range: '70.1-80.0' },
    { name: '进阶生活自理', range: '80.1-100' },
  ],
  移动能力: [
    { name: '动作能力受限', range: '0.0-10.0' },
    { name: '初步动作', range: '10.1-20.0' },
    { name: '初步移动', range: '20.1-40.0' },
    { name: '家中移动', range: '41.1-50.0' },
    { name: '社区移动受限', range: '50.1-60.0' },
    { name: '进阶转位', range: '60.1-70.0' },
    { name: '进阶社区移动', range: '70.1-100' },
  ],
  社会技能: [
    { name: '初步定位与观察', range: '0.0-25.0' },
    { name: '初步沟通与互动', range: '25.1-40.0' },
    { name: '基本语言理解与表达', range: '40.1-50.0' },
    { name: '问题解决', range: '50.1-60.0' },
    { name: '进阶游戏与安全意识萌芽', range: '60.1-70.0' },
    { name: '自我责任', range: '70.1-100' },
  ],
};

// // N,C,R,E 排序
const sortMapping = {
  '无环境改造（N）': 1,
  '一般孩子所设计（C）': 2,
  '复健辅具（R）': 3,
  '延伸性（E）': 4,
};

// 环境改造
const getTerraforming = report => {
  const { scaleName, scoringResults } = report;

  const result = { scaleName, items: [] };

  scoringResults.forEach(({ scoreName, score }) => {
    result.items.push({ scoreName, score });
  });

  result.items.sort((a, b) => sortMapping[a.scoreName] - sortMapping[b.scoreName]);

  return result;
};

const getScoreExplains = report => {
  let result = [];

  const { scoringResults } = report;

  scoringResults.forEach(({ scoreName, scoreExplain }) => {
    if (scoreName === '总量尺分') {
      result = [...result, ...scoreExplain];
    }
  });

  return result;
};

// 分數組成. 功能性技巧和照顾者协助
const getScoreCompose = report => {
  const { scaleType, scaleName, scoringResults } = report;

  const result = { scaleType, scaleName };

  scoringResults.forEach(({ scoreName, score }) => {
    if (scoreName === 'TOTAL_SCORE') {
      result.raw = score;
    }
    if (scoreName === '总标准分') {
      const values = score.split('|');
      result.standard = values[0];
      if (values.length === 2) {
        result.standardError = values[1];
      }
      // 5|1 min:3,max:7 ,分數-誤差*2 = 15
      // >90 min:90,max:90
      // <10 min:0:max:10

      if (result.standard.indexOf('<') !== -1) {
        result.standardRange = {
          min: 0,
          max: parseInt(result.standard.replace('<', '') * 1, 10),
        };
      } else if (result.standard.indexOf('>') !== -1) {
        result.standardRange = {
          min: parseInt(result.standard.replace('>', '') * 1, 10),
          max: 90,
        };
      } else {
        result.standardRange = {
          min: parseInt(result.standard - 2 * result.standardError, 10),
          max: parseInt(result.standard + 2 * result.standardError, 10),
        };
      }
    }
    if (scoreName === '总量尺分') {
      const values = score.split('|');
      result.mark = values[0];
      if (values.length === 2) {
        result.markError = values[1];
      }
      if (result.mark.indexOf('<') !== -1) {
        result.markRange = {
          min: 0,
          max: parseInt(result.mark.replace('<', '') * 1, 10),
        };
      } else if (result.mark.indexOf('>') !== -1) {
        result.markRange = {
          min: parseInt(result.mark.replace('>', '') * 1, 10),
          max: 90,
        };
      } else {
        result.markRange = {
          min: parseInt(result.mark - 2 * result.markError, 10),
          max: parseInt(result.mark + 2 * result.markError, 10),
        };
      }
    }

    // 計算分數領域
  });

  return result;
};

function Report(props) {
  const classes = useStyles();
  const { reports, user, testeeInfo, suggests } = props;

  const buildModel = () => {
    const model = {
      scoreExplains: [],
      scoreCompose: [],
      terraforming: [],
      scoringOverview: [],
      scope: scoreScope,
    };

    reports.forEach(report => {
      const { scoreCompose, terraforming } = model;

      const { scaleType } = report;
      if (scaleType === '功能性技巧' || scaleType === '照顾者协助') {
        scoreCompose.push(getScoreCompose(report));
      }
      if (scaleType === '环境改造') {
        terraforming.push(getTerraforming(report));
      }

      model.scoreExplains = model.scoreExplains.concat(getScoreExplains(report));
    });

    return model;
  };

  const model = buildModel();
  const { scoreCompose, terraforming, scope, scoreExplains } = model;

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

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>分 数 总 结</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <hr /><Slider2 /><hr />
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    领域
                  </TableCell>
                  <TableCell align="right">原始分</TableCell>
                  <TableCell align="right">标准分</TableCell>
                  <TableCell align="right">标准误</TableCell>
                  <TableCell align="right">刻度分</TableCell>
                  <TableCell align="right">标准误</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreCompose.map(row => (
                  <TableRow key={row.scaleType + row.scaleName}>
                    <TableCell component="th" scope="row">
                      {row.scaleType}
                    </TableCell>
                    <TableCell align="right">{row.scaleName}</TableCell>
                    <TableCell align="right">{row.raw}</TableCell>
                    <TableCell align="right">{row.standard}</TableCell>
                    <TableCell align="right">{row.standardError}</TableCell>
                    <TableCell align="right">{row.mark}</TableCell>
                    <TableCell align="right">{row.markError}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>环境改造频率</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <Grid container spacing={2}>
            {terraforming.map(row => (
              <Paper
                key={row.scaleName}
                style={{ width: '31%', margin: '1%', paddingTop: '5px' }}
                variant="outlined"
              >
                <Grid item>
                  <h3 style={{ textAlign: 'center' }}>{row.scaleName}</h3>
                  {row.items.map(i => (
                    <ListItem key={i.scoreName}>
                      <ListItemText primary={i.scoreName} />
                      <ListItemSecondaryAction>{i.score}</ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </Grid>
              </Paper>
            ))}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>分数领域</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '18%' }} align="center">
                    量表
                  </TableCell>
                  <TableCell style={{ width: '18%' }} align="center">
                    领域
                  </TableCell>
                  <TableCell style={{ width: '32%' }} align="center">
                    常模標準分數
                  </TableCell>
                  <TableCell style={{ width: '32%' }} align="center">
                    量尺分數
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreCompose.map(row => (
                  <TableRow key={row.scaleType + row.scaleName}>
                    <TableCell align="center">{row.scaleType}</TableCell>
                    <TableCell align="center">{row.scaleName}</TableCell>
                    <TableCell align="center">
                      <Slider
                        value={[row.standardRange.min, row.standardRange.max]}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={0}
                        max={100}
                        marks={marks}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Slider
                        value={[row.markRange.min, row.markRange.max]}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={0}
                        max={100}
                        marks={marks}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>功能性技巧 刻度分范围</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <Grid container spacing={2}>
            {Object.keys(scope).map(key => (
              <Paper
                key={key}
                style={{ width: '31%', margin: '1%', paddingTop: '5px' }}
                variant="outlined"
              >
                <Grid item>
                  <h3 style={{ textAlign: 'center' }}>{key}</h3>
                  {scope[key].map(i => (
                    <ListItem key={i.name}>
                      <ListItemText
                        primary={
                          scoreExplains.findIndex(s => s === i.name) === -1 ? null : <CheckIcon />
                        }
                      />
                      <ListItemSecondaryAction>{i.name}</ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </Grid>
              </Paper>
            ))}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      {suggests && (
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary>
            <Typography className={classes.heading}>可发展技能</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.root}>
            <ScaleSuggestList items={suggests} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )}
    </div>
  );
}

export default Report;
