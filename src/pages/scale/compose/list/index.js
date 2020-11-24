import React, { useEffect, Fragment } from 'react';

import styles from '@/utils/publicstyle';

import router from '@/utils/router';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Header from '@/components/AppHeader';
import NoData from '@/components/NoData';
import LoadingBox from '@/components/LoadingBox';

import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import Avatar from '@material-ui/core/Avatar';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Divider from '@material-ui/core/Divider';

import { connect } from 'dva';
import { formatDateFromTime } from '@/utils/format';
import { findNameByCode } from '@/pages/scale/util/code';

function Index({
  scaleCompose: { compose, records },
  dispatch,
  loading,
  match: {
    params: { code },
  },
}) {
  const testeeinfo = id => {
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

  const getListItem = record => {
    const { reportDate } = record;
    if (reportDate) {
      return report(record);
    }
    return checkNext(record);
  };

  const getButtonGroup = record => {
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
        </Button>
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
        </Button>
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

  /**
  if (loading === undefined) {
    return true;
  } */

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
      <div style={{ margin: 20 }}>
        <LoadingBox loading={loading} data={records}>
          <Paper elevation={3}>
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
                        {record.reportDate ? (
                          <Avatar style={styles.avatar}>
                            <AssignmentTurnedInIcon />
                          </Avatar>
                        ) : (
                          <Avatar>
                            <AssignmentLateIcon />
                          </Avatar>
                        )}
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
                            > — {record.userName}
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
                    {index < records.length - 1 ? <Divider variant="inset" component="li" /> : null}
                  </Fragment>
                ))}
              </List>
            ) : (
              <NoData />
            )}
          </Paper>
        </LoadingBox>
      </div>
    </Fragment>
  );
}

export default connect(({ scaleCompose, loading }) => ({
  loading: loading.effects['scaleCompose/fetchAll'],
  scaleCompose,
}))(Index);
