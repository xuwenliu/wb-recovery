/* eslint-disable react/no-danger */
import React, { Fragment } from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Desc = ({ suggest }) => {
  return <div dangerouslySetInnerHTML={{ __html: suggest.desc }} />;
};

function ScaleSuggestDetail({ suggest, index, showPlan = false, value, onChange }) {
  const getStr = item => {
    const val = item.substr(item.indexOf('.') + 1, item.length);
    return val;
  };
  const getField = () => {
    if (onChange) {
      return (
        <FormControlLabel
          key={suggest.no}
          style={{
            marginTop: '8px',
            marginBottom: '8px',
            border: '1px solid rgb(237,237,237)',
          }}
          control={
            <Checkbox
              value={suggest.no}
              checked={value.findIndex(i => i.no === suggest.no) !== -1}
              onChange={event => {
                if (event.target.checked) {
                  onChange([...value, suggest]);
                } else {
                  onChange(value.filter(i => i.no !== suggest.no));
                }
              }}
            />
          }
          label={<Desc suggest={suggest} />}
        />
      );
    }

    return <Desc suggest={suggest} />;
  };

  return (
    <Fragment>
      {getField()}

      {/**
       * 是否顯示詳細計畫.exp:AEPS 的計畫
       */
      showPlan && suggest.plan && (
        <div
          style={{
            whiteSpace: 'normal',
            wordBreak: 'break-all',
            overflow: 'hidden',
            padding: '15px',
            margin: '15px',
          }}
          dangerouslySetInnerHTML={{ __html: suggest.plan }}
        />
      )}
    </Fragment>
  );
}

export default ScaleSuggestDetail;
