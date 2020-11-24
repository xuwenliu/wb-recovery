import React, { useEffect, Fragment } from 'react';

import Header from '@/components/AppHeader';
import Report from '@/pages/scale/components/ScaleReport';

import { connect } from 'dva';

function ScaleReport({
  dispatch,
  scaleReport: { record },
  match: {
    params: { id },
  },
}) {
  useEffect(() => {
    dispatch({
      type: 'scaleReport/fetch',
      payload: { id },
    });
    return () => {
      dispatch({
        type: 'scaleReport/clear',
        payload: {},
      });
    };
  }, []);

  return (
    <Fragment>
      <Header>報告</Header>
      {record ? <Report report={record} /> : null}
    </Fragment>
  );
}

export default connect(({ scaleReport, loading }) => ({
  loading: loading.effects['scaleReport/fetch'],
  scaleReport,
}))(ScaleReport);
