import React from 'react';
import { TreeSelect } from 'antd';

const WORK_TYPE = 'Scale';

function ScaleWork({ value = [], onChange, scales }) {
  const onChangeValue = (changeValues, label, extra) => {
    const { triggerNode = {} } = extra;
    const { props = {} } = triggerNode;

    // 目錄不能加入到清單中
    if (props.children && props.children.length === 0) {
      // 扁平化量表
      let list = [];
      Object.keys(scales).forEach((key) => {
        const children = scales[key];
        children.forEach((child) => {
          list = [{ type: WORK_TYPE, target: child.id, name: child.name }, ...list];
        });
      });

      // 依照勾選的內容過濾
      const newValue = list.filter((item) => changeValues.indexOf(item.name) >= 0);

      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const treeData = [];

  Object.keys(scales).forEach((key) => {
    const items = scales[key];
    const tag = {
      title: key,
      value: key,
      key,
      children: [],
    };

    items.forEach((item) => {
      tag.children.push({
        title: item.name,
        value: item.name,
        key: item.id,
      });
    });

    treeData.push(tag);
  });

  return (
    <TreeSelect
      value={value.map((item) => item.name)}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      multiple
      onChange={onChangeValue}
      treeData={treeData}
    />
  );
}

export default ScaleWork;
