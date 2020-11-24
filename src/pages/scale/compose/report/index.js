/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import CircularProgress from '@material-ui/core/CircularProgress';
import LoadingBox from '@/components/LoadingBox';
import Header from './components/Header';

import { getCmponent } from './components';

function Page(props) {
  const {
    loading,
    scaleComposeReport: { data = {} },
    dispatch,
    location: {
      query: { compose, id, name },
    },
  } = props;

  const fetch = (params = {}) => {
    dispatch({
      type: 'scaleComposeReport/fetchGuide',
      payload: { ...params },
    });
  };

  const getUI = () => {
    const UI = getCmponent(data.code);

    return UI === null ? null : <UI {...data} />;
  };

  useEffect(() => {
    fetch({ compose, id, takeAnswer: true });
    return () => {
      dispatch({
        type: 'scaleComposeReport/clear',
        payload: {},
      });
    };
  }, []);

  const { user, scaleName, shortName, reports } = data;

  return (
    <>
      <Header user={user} name={scaleName || name} id={id} dispatch={dispatch} />
      <LoadingBox loading={loading} data={reports}>
        {getUI()}
      </LoadingBox>
    </>
  );
}

export default connect(({ scaleComposeReport, loading }) => ({
  loading: loading.effects['scaleComposeReport/fetchGuide'],
  scaleComposeReport,
}))(Page);
