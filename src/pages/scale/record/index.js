import React, { useEffect, Fragment } from 'react';
import router from '@/utils/router';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Header from '@/components/AppHeader';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import Divider from '@material-ui/core/Divider';
import { connect } from 'dva';
import { formatDateFromTime } from '@/utils/format';

function ScaleRecord({ dispatch, scaleRecord: { records = [] } }) {
  const view = id => {
    router.push({
      pathname: `/scale/report/${id}`,
    });
  };

  const fetch = (params = {}) => {
    dispatch({
      type: 'scaleRecord/fetch',
      payload: { ...params },
    });
  };

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleRecord/clear',
        payload: {},
      });
    };
  }, []);

  return (
    <Fragment>
      <Header>答題紀錄</Header>
      <div style={{ margin: 20 }} title="..">
        <Paper elevation={0}>
          <List>
            {records.map((record, index) => (
              <Fragment key={record.id}>
                <ListItem
                  button
                  onClick={() => {
                    view(record.id);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={record.scaleName}
                    secondary={formatDateFromTime(record.reportDate)}
                  />
                </ListItem>
                {index < records.length - 1 ? <Divider variant="inset" component="li" /> : null}
              </Fragment>
            ))}
          </List>
        </Paper>
      </div>
    </Fragment>
  );
}

export default connect(({ scaleRecord, loading }) => ({
  loading: loading.effects['scaleRecord/fetch'],
  scaleRecord,
}))(ScaleRecord);
