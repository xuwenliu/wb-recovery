import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

/**
 *
 * horizontal:水平
 * vertical:垂直
 */

function SingleSelect({ onChange, scaleOptions, RenderOptionContent, config = {} }) {
  const getRadioGroupStyle = () => {
    const { direction = 'vertical' } = config;

    let styles = { margin: 20 };

    if (direction === 'horizontal') {
      styles = { ...styles, flexDirection: 'row' };
    }

    return styles;
  };

  return (
    <RadioGroup style={{ ...getRadioGroupStyle() }} onChange={onChange}>
      {scaleOptions.map((option) => (
        <FormControlLabel
          style={{
            marginTop: '8px',
            marginBottom: '8px',
            border: '1px solid rgb(237,237,237)',
            borderRadius: '5px',
            cursor: 'pointer',
            minWidth: '100px',
          }}
          key={`${option.option}`}
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
