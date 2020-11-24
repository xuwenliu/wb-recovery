import React, { useEffect } from 'react';
import { connect } from 'dva';
import router from '@/utils/router';

import Alert from '@/components/Alert';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';

import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Header from '@/components/AppHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import LoadingBox from '@/components/LoadingBox';

import Button from '@material-ui/core/Button';

import styles from '@/utils/publicstyle';

// import Report from '../components/PDMS';

function Page(props) {
  const {
    loading,
    scaleComposeAnswer: { data = {} },
    dispatch,
    location: {
      query: { compose, id, current },
    },
  } = props;

  const { code, scaleName, items = [], scales = [], progress = {} } = data;

  const fetch = (params = {}) => {
    dispatch({
      type: 'scaleComposeAnswer/fetchGuide',
      payload: { ...params },
    });
  };

  const changeCurrent = value => {
    dispatch({
      type: 'scaleComposeAnswer/changeCurrent',
      payload: { current: value },
    });
    router.push({
      pathname: '/scale/compose/answer',
      query: { compose, id, current: value }, // 要讓答題頁面返回時.可以定位到之前頁籤
    });
  };

  const next = subScale => {
    router.push({
      pathname: '/scale/compose/answer/single',
      query: { compose, id, subScale, name: scaleName },
    });
  };

  const createReport = () => {
    dispatch({
      type: 'scaleComposeAnswer/createReport',
      payload: { compose, answer: id },
      callback: () => {
        router.replace({
          pathname: '/scale/compose/report',
          query: { compose, id },
        });
      },
    });
  };

  useEffect(() => {
    fetch({ compose, id, current });
    return () => {
      dispatch({
        type: 'scaleComposeAnswer/clear',
        payload: {},
      });
    };
  }, []);

  const step = items.findIndex(i => i.name === data.current);

  return (
    <>
      <Header returnUrl={`/scale/compose/${code}/list`}>{scaleName}</Header>
      <LoadingBox loading={loading} data={scales}>
        {items.length > 1 && (
          <Stepper nonLinear activeStep={step}>
            {items.map(item => (
              <Step key={item.name} completed={item.finish}>
                <StepButton
                  onClick={() => {
                    changeCurrent(item.name);
                  }}
                >
                  {item.name}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        )}

        <List
          component="nav"
          style={{ margin: 30 }}
          subheader={
            <ListSubheader>
              <Alert style={{ marginTop: 15 }} severity="warning">
                必須填寫全部量表 ({progress.count} / {progress.total} )
              </Alert>
            </ListSubheader>
          }
        >
          {scales.map(scale => (
            <ListItem
              button
              style={{ backgroundColor: '#ffffff', marginTop: 20 }}
              key={scale.name}
              onClick={() => {
                next(`${scale.category}.${scale.name}`);
              }}
            >
              <ListItemAvatar>
                {scale.finish ? (
                  <Avatar style={styles.avatar}>
                    <CheckIcon />
                  </Avatar>
                ) : (
                  <Avatar>
                    <EditIcon />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText primary={scale.name} secondary="說明" />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => {
                    next(`${scale.category}.${scale.name}`);
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <div style={{ margin: 30 }}>
          <Button
            disabled={progress.count !== progress.total}
            variant="contained"
            color="primary"
            style={{ width: '100%' }}
            onClick={() => {
              createReport();
            }}
          >
            產生報告
          </Button>
        </div>
      </LoadingBox>
    </>
  );
}

export default connect(({ scaleComposeAnswer, loading }) => ({
  loading: loading.effects['scaleComposeAnswer/fetchGuide'],
  scaleComposeAnswer,
}))(Page);
