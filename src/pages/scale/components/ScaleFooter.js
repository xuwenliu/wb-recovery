import React from 'react';
import Typography from '@material-ui/core/Typography';

import { format } from 'date-fns';

function ScaleFooter({ builder, reportDate }) {
  return (
    <div
      style={{
        marginTop: '30px',
        marginLeft: '72%',
      }}
    >
      <Typography>测试人员：{builder}</Typography>
      <Typography>测试日期：{format(reportDate, 'yyyy-MM-dd')}</Typography>
    </div>
  );
}

export default ScaleFooter;
