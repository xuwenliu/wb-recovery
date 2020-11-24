import React, { useState } from 'react';
import { AutoComplete } from 'antd';

function AutoCompleteWrap({ label, onInputChange, onChange, options }) {
  const [value, setValue] = useState('');

  return (
    <AutoComplete
      value={value}
      options={options}
      style={{ width: 200 }}
      onSelect={(value) => {
        const [item] = options.filter((i) => i.value === value);
        setValue(item.label);
        onChange({ value });
      }}
      onSearch={(txt) => {
        setValue(txt);
        if (txt.length > 0) {
          onInputChange(txt);
        }
      }}
      placeholder={label}
    />
  );
}

export default AutoCompleteWrap;
