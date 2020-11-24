import React from 'react';

import { Cascader } from 'antd';

const options = (types) => {
  if (types) {
    const op = types.map((t) => ({ value: t.id, label: t.name }));
    return op;
  }
  return [];
};

function ScaleTypeDropDown({ types }) {
  return <Cascader options={options(types)} placeholder="Please select" />;
}

export default ScaleTypeDropDown;
