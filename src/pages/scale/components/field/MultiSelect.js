import React, { Component } from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';

class MultiSelect extends Component {
  state = {};

  getValueArray = () => {
    const { value } = this.props;
    if (value === undefined || value === '') {
      return [];
    }
    return value.split(',');
  };

  equal = (a, b) => {
    return `${a}` === `${b}`;
  };

  onChange = (v, checked) => {
    const { onChange } = this.props;

    const ary = this.getValueArray();

    if (checked) {
      const nv = [...ary, v].join(',');
      // console.log('checked:', checked, 'new value:', nv);
      onChange(nv);
    } else {
      const nv = ary.filter(i => !this.equal(i, v)).join(',');
      // console.log('checked:', checked, ' new value:', nv);
      onChange(nv);
      // onChange(value.filter(i => i !== v));
    }
  };

  render() {
    const { scaleOptions, RenderOptionContent, value } = this.props;

    const ary = (value || '').split(',');

    return (
      <FormGroup row>
        {scaleOptions.map(option => (
          <FormControlLabel
            key={option.optionScore}
            style={{
              marginTop: '8px',
              marginBottom: '8px',
              border: '1px solid rgb(237,237,237)',
            }}
            control={
              <Checkbox
                value={option.option}
                checked={ary.findIndex(e => this.equal(e, option.option)) !== -1}
                onChange={event => {
                  // console.log('onChange:', option.option, event.target.checked);
                  this.onChange(option.option, event.target.checked);
                }}
              />
            }
            label={
              RenderOptionContent ? <RenderOptionContent option={option} /> : option.optionContent
            }
          />
        ))}
      </FormGroup>
    );
  }
}

export default MultiSelect;
