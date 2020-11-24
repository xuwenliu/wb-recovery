import React, { Fragment, useEffect } from 'react';

import SAS from './reports/SAS';
import SDS from './reports/SDS';
import ScaleReport from '@/pages/scale/components/ScaleReport';

export default function page({ reports }) {
  useEffect(() => {}, [reports]);

  const getView = report => {
    if (report.scaleName === '抑郁自评量表(SDS)') {
      return <SDS report={report} />;
    }

    if (report.scaleName === '焦虑自评量表（SAS）') {
      return <SAS report={report} />;
    }

    return <ScaleReport report={report} />;
  };

  return (
    <Fragment>
      {reports.map(report => (
        <div key={report.id}>{getView(report)}</div>
      ))}
    </Fragment>
  );
}
