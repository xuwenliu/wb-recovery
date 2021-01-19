import React, { useEffect, Fragment } from 'react';

import styles from '@/utils/classStyle';

import router from '@/utils/router';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Header from '@/components/AppHeader';
import NoData from '@/components/NoData';
import LoadingBox from '@/components/LoadingBox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
// import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import FormControl from '@material-ui/core/FormControl';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { formatDateFromTime } from '@/utils/format';
import { makeStyles } from '@material-ui/core/styles';
import { findNameByCode } from '@/pages/scale/util/code';
import Pagination from '@/components/Pagination';

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    height: '40px',
    marginTop: '10px',
    marginLeft: theme.spacing(20),
  },
  Typography: {
    marginTop: '0%',
    marginLeft: '7%',
    marginBottom: '3%',
  },
  paper: {
    paper: {
      padding: theme.spacing(1),
      // marginTop: '-8.6%',
      // marginLeft: '56%',
      marginBottom: '3%',
      display: 'flex',
      // textAlign: 'center',
      //  width: 300,
    },
  },
  formControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: '30%',
  },
  button: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));
function Index({
  scaleCompose: { compose, records, totalPages },
  dispatch,
  loading,
  form,
  match: {
    params: { code },
  },
}) {
  const { getFieldDecorator } = form;
  const [page, setPage] = React.useState(1);
  const testeeinfo = (id) => {
    router.push({
      pathname: '/scale/compose/testeeinfo',
      query: { compose, id },
    });
  };

  const report = ({ id, scaleName }) => {
    router.push({
      pathname: '/scale/compose/report',
      query: { compose, id, name: scaleName },
    });
  };

  /**
   * 判斷跳轉的路徑
   */
  const checkNext = ({ id, scaleName, subScale }) => {
    /**
     * 如果是單一報表.直接跳轉到答題頁面
     */
    if (subScale) {
      router.push({
        pathname: '/scale/compose/answer/single',
        query: { compose, id, subScale, name: scaleName },
      });
    } else {
      router.push({
        pathname: '/scale/compose/answer',
        query: { compose, id, name: scaleName },
      });
    }
  };

  const getListItem = (record) => {
    const { reportDate } = record;
    if (reportDate) {
      return report(record);
    }
    return checkNext(record);
  };

  const getButtonGroup = (record) => {
    const { reportDate } = record;

    const buttons = [];

    if (reportDate) {
      buttons.push(
        <Button
          key="report"
          onClick={() => {
            report(record);
          }}
        >
          报告
        </Button>,
      );
    } else {
      buttons.push(
        <Button
          key="answer"
          onClick={() => {
            checkNext(record);
          }}
        >
          答题
        </Button>,
      );
    }

    return buttons;
  };

  useEffect(() => {
    dispatch({
      type: 'scaleCompose/fetchIdByCode',
      payload: { code },
    });
    return () => {
      dispatch({
        type: 'scaleCompose/clear',
        payload: {},
      });
    };
  }, []);
  const classes = useStyles();
  /**
  if (loading === undefined) {
    return true;
  } */

  const handleClick = () => {
    form.validateFields((err, values) => {
      console.log('values:', values);
      if (!err) {
        console.log(values, compose);
        dispatch({
          type: 'scaleCompose/fetchAll',
          payload: { id: compose, values },
        });
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'scaleCompose/fetchAll',
          payload: { values, id: compose, pagination: { page: newPage - 1, size: 8 } },
        });
      }
    });
    setPage(newPage);
  };

  return (
    <Fragment>
      <Header returnUrl="/home">
        {findNameByCode({ code })}
        <Button
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: '16px',
            lineHeight: '48px',
            fontWeight: 'bold',
          }}
          aria-label="delete"
          onClick={() => {
            testeeinfo();
          }}
          fontSize="large"
        >
          新增答题
        </Button>
      </Header>
      {/* <div style={{ margin: 10 }}> */}
      <div>
        <LoadingBox loading={loading} data={records}>
          <Paper elevation={3}>
            <Paper className={classes.paper}>
              <FormControl className={classes.formControl}>
                {getFieldDecorator('number')(<TextField label="报告编号" type="search" />)}
              </FormControl>
              <FormControl className={classes.formControl}>
                {getFieldDecorator('text')(<TextField label="人员编号/姓名" type="search" />)}
              </FormControl>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={handleClick}
              >
                <SearchIcon />
                查询
              </Button>
            </Paper>
            {records && records.length ? (
              <List>
                {records.map((record, index) => (
                  <Fragment key={record.id}>
                    <ListItem
                      button
                      onClick={() => {
                        getListItem(record);
                      }}
                    >
                      <ListItemAvatar>
                        {/* {record.reportDate ? (
                          <Avatar style={styles.avatar}>
                            <AssignmentTurnedInIcon />
                          </Avatar>
                        ) : (
                          <Avatar>
                            <AssignmentLateIcon  />
                          </Avatar>
                          )} */}
                        <Avatar>
                          <AssignmentLateIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        style={styles.lineControl}
                        //  primary={record.userName}
                        primary={
                          <Fragment>
                            {record.number}
                            <Typography
                              component="span"
                              variant="body1"
                              style={styles.inline}
                              color="textPrimary"
                            >
                              {' '}
                              — {record.userName}
                            </Typography>
                          </Fragment>
                        }
                        secondary={formatDateFromTime(record.reportDate)}
                      />
                      <ListItemSecondaryAction>
                        <ButtonGroup variant="text" size="large">
                          {getButtonGroup(record)}
                        </ButtonGroup>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {/* {index < records.length - 1 ? <Divider variant="inset" component="li" /> : null} */}
                    <Divider variant="inset" component="li" />
                  </Fragment>
                ))}
              </List>
            ) : (
              <NoData />
            )}
            <Pagination totalPages={totalPages} page={page} onChange={handleChangePage} />
          </Paper>
        </LoadingBox>
      </div>
    </Fragment>
  );
}
const warp = createForm({})(Index);
export default connect(({ scaleCompose, loading }) => ({
  loading: loading.effects['scaleCompose/fetchAll'],
  scaleCompose,
}))(warp);
