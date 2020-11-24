// 职业三级联动

import { Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { getParentSectionChildren } from '@/pages/Function/ColumnLocation/service';

const { Option } = Select;

const ProfessionSelect = ({ value = {}, onChange, professionList }) => {
  console.log('value', value);
  const [largeList, setLargeList] = useState([]);
  const [mediumList, setMediumList] = useState([]);
  const [smallList, setSmallList] = useState([]);

  const [large, setLarge] = useState('');
  const [medium, setMedium] = useState('');
  const [small, setSmall] = useState('');

  const queryParentSectionChildren = async (type, parentId) => {
    const res = await getParentSectionChildren({ parentId });
    switch (type) {
      case 2:
        setMediumList(res);
        break;
      case 3:
        setSmallList(res);
        break;
    }
  };

  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({ large, medium, small, ...value, ...changedValue });
    }
  };

  const onLargeChange = (id, noClear) => {
    if (noClear) {
      triggerChange({ large: id });
    } else {
      triggerChange({ large: id, medium: '', small: '' });
    }
    queryParentSectionChildren(2, id);
  };
  const onMediumChange = (id, noClear) => {
    if (noClear) {
      triggerChange({ medium: id });
    } else {
      triggerChange({ medium: id, small: '' });
    }
    queryParentSectionChildren(3, id);
  };
  const onSmallChange = (id) => {
    triggerChange({ small: id });
  };

  useEffect(() => {
    if (professionList?.length > 0) {
      setLargeList(professionList);
    }
  }, [professionList]);

  // 修改的时候赋值
  useEffect(() => {
    if (value.large) {
      onLargeChange(value.large, true);
    }
    if (value.medium) {
      onMediumChange(value.medium, true);
    }
  }, [value.large, value.medium]);

  return (
    <>
      <Select
        style={{ width: '30%', marginRight: 8 }}
        value={value.large || large}
        onChange={(id) => onLargeChange(id, false)}
        placeholder="请选择大类"
      >
        {largeList.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Select
        style={{ width: '30%', marginRight: 8 }}
        value={value.medium || medium}
        onChange={(id) => onMediumChange(id, false)}
        placeholder="请选择中类"
      >
        {mediumList.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Select
        style={{ width: '30%', marginRight: 8 }}
        value={value.small || small}
        onChange={onSmallChange}
        placeholder="请选择小类"
      >
        {smallList.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default ProfessionSelect;
