/* eslint-disable react/no-danger */
import React, { Fragment } from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function ScaleSuggestDetail({ suggest, showPlan = false, value, onChange }) {
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
          label={suggest.desc}
        />
      );
    }

    return <div>{suggest.desc}</div>;
  };

  return (
    <Fragment>
      {getField()}

      {showPlan && suggest.plan && (
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
