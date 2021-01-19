/* eslint-disable prefer-destructuring */
import React, { useEffect, useState, useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TesteeInfo from '@/pages/scale/components/TesteeInfo';
import ScaleSuggestList from '@/pages/scale/components/ScaleSuggestList';

import { getData } from './util';

import Result from './Result';
import View1 from './View1';
import View2 from './View2';
import View3 from './View3';

import Chart1 from './components/Chart1';
import Chart2 from './components/Chart2';
import Chart3 from './components/Chart3';
import Chart4 from './components/Chart4';
import Chart5 from './components/Chart5';
import Chart6 from './components/Chart6';
import Chart7 from './components/Chart7';
import Chart8 from './components/Chart8';

import { defaultBlock } from '@/utils/publicStyles';

const useStyles = makeStyles({
  ...defaultBlock,
});

function Page(props) {
  const classes = useStyles();
  const body = useRef(null);

  const [width, setWidth] = useState(0);
  const { reports, user, testeeInfo, suggests, answers } = props;

  useEffect(() => {
    setWidth(body.current.clientWidth * 0.9);
    return () => {};
  }, []);

  const data = getData({ reports, answers });

  console.log('data:', data);

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
          <Typography className={classes.heading}>评量结果表</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <Result data={data} />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      {/**
         *  <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary>
          <Typography className={classes.heading}>综合发展侧面图(一)</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <View1 data={data} />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary>
          <Typography className={classes.heading}>综合发展侧面图(二)</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <View2 data={data} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
         */}

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary>
          <Typography className={classes.heading}>综合发展侧面图</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <Chart1 list={data} />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary>
          <Typography className={classes.heading}>综合发展侧面图(三)</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          {/**
           * <View3 data={data} />;
           */}

          <Chart2 list={data} />
          <Chart3 list={data} />
          <Chart4 list={data} />
          <Chart5 list={data} />
          <Chart6 list={data} />
          <Chart7 list={data} />
          <Chart8 list={data} />
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
