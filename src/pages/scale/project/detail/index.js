import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import router from '@/utils/router';
import { makeStyles } from '@material-ui/core/styles';
import styles from '@/utils/publicstyle';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import EditIcon from '@material-ui/icons/Edit';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import { createForm } from 'rc-form';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import ProjectLimit from '@/pages/scale/components/limit/ProjectLimit';
import { formatDateFromTime } from '@/utils/format';

// import Profile from '@/pages/scale/file/T12355';

import Header from '@/components/AppHeader';

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
    scaleProjectDetail: { record },
    dispatch,
  } = props;

  const answer = scaleId => {
    router.push({
      pathname: `/scale/collect/${scaleId}`,
      query: {
        scaleId,
        code,
        project: record.project,
      },
    });
  };

  const fetch = () => {
    dispatch({
      type: 'scaleProjectDetail/fetch',
      payload: { code },
    });
  };

  const submit = () => {
    form.validateFields((err, values) => {
      // return;
      // eslint-disable-next-line no-unreachable
      if (!err) {
        const { 出生年月日, ...others } = values;

        let vs = { ...others };

        if (出生年月日) {
          vs = { ...vs, 出生年月日: formatDateFromTime(出生年月日) };
        }

        console.log('values', vs);

        dispatch({
          type: 'scaleProjectDetail/create',
          payload: {
            project: record.project,
            values: vs,
          },
          callback: () => {
            fetch();
          },
        });
      } else {
        console.log('err:', err);
      }
    });
  };

  const content = () => {
    if (record.id) {
      return (
        <div className={classes.demo}>
          <Paper elevation={0}>
            {record.works.map((work, index) => (
              <Fragment key={work.id}>
                <List>
                  <ListItem
                    onClick={() => {
                      answer(work.target);
                    }}
                  >
                    <ListItemAvatar>
                      {work.finish ? (
                        <Avatar style={styles.avatar}>
                          <AssignmentTurnedInIcon />
                        </Avatar>
                      ) : (
                        <Avatar>
                          <AssignmentIcon />
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText primary={work.name} />
                    <ListItemSecondaryAction>
                      <ChevronRightIcon />
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < record.works.length - 1 ? <Divider variant="middle" /> : null}
                </List>
              </Fragment>
            ))}
          </Paper>
        </div>
      );
    }

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography color="textSecondary">{record.description}</Typography>
            {/**
               *  <ProjectLimit
              form={form}
              object={{}}
              project={{ name: record.name }}
              limits={record.limits}
            />
               */}

            {/**
               * <Profile form={form} />
               * 
               * <ProjectLimit
              form={form}
              object={{}}
              project={{ name: record.name }}
              limits={record.limits}
            />
               */}
            <ProjectLimit
              form={form}
              object={{}}
              project={{ name: record.name }}
              limits={record.limits}
            />

            {/* <Profile form={form} /> */}
          </CardContent>
        </Card>
        <div className={classes.button}>
          <Button variant="contained" color="primary" onClick={submit} fullWidth>
            確定
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleProjectDetail/clear',
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

export default connect(({ scaleProjectDetail, loading }) => ({
  scaleProjectDetail,
  loading: loading.models.scaleProjectDetail,
}))(warp);
