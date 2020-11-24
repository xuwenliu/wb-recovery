import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { createForm } from 'rc-form';

import ProjectLimit from '@/pages/scale/components/limit/ProjectLimit';

import Header from '@/components/AppHeader';
import MixAnswer from '@/pages/scale/components/mix/MixAnswer';
import MixReport from '@/pages/scale/components/mix/MixReport';

const useStyles = makeStyles(theme => ({
  button: {
    margin: 20,
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  card: {
    margin: theme.spacing(3),
    minWidth: 120,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  media: {
    height: 140,
  },
}));

function Page(props) {
  const classes = useStyles();
  const {
    match: {
      params: { code },
    },
    form,
    scaleProjectMix: { record, scales, reports },
    dispatch,
  } = props;

  const fetch = () => {
    dispatch({
      type: 'scaleProjectMix/fetch',
      payload: { code },
      callback: ({ id, works = [] }) => {
        if (id) {
          works.forEach(work => {
            dispatch({
              type: 'scaleProjectMix/fetchScale',
              payload: {
                id: work.target,
              },
            });
          });
        }
      },
    });
  };

  const submit = () => {
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'scaleProjectMix/create',
          payload: {
            project: record.project,
            values,
          },
          callback: () => {
            fetch();
          },
        });
      }
    });
  };

  const answer = answers => {
    answers.forEach(item => {
      console.log(dispatch, 'submit :', item);
      dispatch({
        type: 'scaleProjectMix/submitAnswer',
        payload: {
          project: record.id,
          compose: item.id,
          scale: item.scale,
          answerValues: item.values,
        },
        callback: () => {
          console.log('callback...');
        },
      });
    });
  };

  const content = () => {
    if (record.id == null) {
      return (
        <div>
          <Card className={classes.card}>
            <CardContent>
              <Typography color="textSecondary">{record.description}</Typography>
              <ProjectLimit
                form={form}
                object={{}}
                project={{ name: record.name }}
                limits={record.limits}
              />
            </CardContent>
          </Card>
          <div className={classes.button}>
            <Button variant="contained" color="primary" onClick={submit} fullWidth>
              確定
            </Button>
          </div>
        </div>
      );
    }

    if (reports && reports.length > 0) {
      return <MixReport reports={reports} />;
    }

    if (scales && scales.length === record.works.length) {
      return <MixAnswer scales={scales} submit={answer} />;
    }
  };

  useEffect(() => {
    fetch();
    /**
    ['5fa138c32ab79c0001c0e45d', 
    '5fa138c32ab79c0001c0e45e', 
    '5fa138c32ab79c0001c0e45f'].forEach(
      id => {
        dispatch({
          type: 'scaleProjectMix/fetchReport',
          payload: { id },
        });
      }
    );
     */

    return () => {
      dispatch({
        type: 'scaleProjectMix/clear',
        payload: {},
      });
    };
  }, []);

  return (
    <Fragment>
      <Header backIcon={false}>{record && record.name}</Header>
      {record && content()}
    </Fragment>
  );
}

const warp = createForm({})(Page);

export default connect(({ scaleProjectMix, loading }) => ({
  scaleProjectMix,
  loading: loading.models.scaleProjectMix,
  loadingScale: loading.effects['scaleProjectMix/fetchScale'],
}))(warp);
