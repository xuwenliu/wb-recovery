import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

function SingleSelect({ onChange, scaleOptions, RenderOptionContent }) {
  return (
    <RadioGroup style={{ margin: 20 }} onChange={onChange}>
      {scaleOptions.map(option => (
        <FormControlLabel
          style={{
            marginTop: '8px',
            marginBottom: '8px',
            border: '1px solid rgb(237,237,237)',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          key={`${option.optionScore}`}
          value={`${option.option}`}
          control={
            <Radio
              style={{ cursor: 'pointer' }}
              checkedIcon={<CheckCircleIcon color="primary" />}
            />
          }
          label={
            RenderOptionContent ? <RenderOptionContent option={option} /> : option.optionContent
          }
        />
      ))}
    </RadioGroup>
  );
}

export default SingleSelect;
