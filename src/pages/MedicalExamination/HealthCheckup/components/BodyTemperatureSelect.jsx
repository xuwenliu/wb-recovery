import React, { useState } from 'react';
import { Input, Select } from 'antd';

const numList = []; // 35-41
const pointList = []; // 0-9

for (let i = 35; i <= 41; i++) {
  numList.push(i);
}
for (let i = 0; i <= 9; i++) {
  pointList.push(i);
}

const BodyTemperatureSelect = ({ value, onChange }) => {
  const [intNum, setIntNum] = useState();
  const [pointNum, setPointNum] = useState();

  const intChange = (val) => {
    setIntNum(val);
    onChange(val + (pointNum ? (pointNum / 10) : 0));
  };
  const pointChange = (val) => {
    setPointNum(val);
    onChange(intNum + val / 10);
  };
  return (
    <Input.Group compact>
      <Select onChange={intChange}>
        {numList.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
      <span style={{ margin: '0 8px', verticalAlign: 'bottom' }}>.</span>
      <Select onChange={pointChange}>
        {pointList.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
      <span style={{ margin: '0 8px', verticalAlign: 'bottom' }}>度</span>
    </Input.Group>
  );
};

export default BodyTemperatureSelect;
