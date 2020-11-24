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
          <Result data={data} />;
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded>
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

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary>
          <Typography className={classes.heading}>综合发展侧面图(三)</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>
          <View3 data={data} />;
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
