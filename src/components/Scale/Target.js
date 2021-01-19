import React, { useState, useEffect } from 'react';

import { useRequest } from '@umijs/hooks';

import { Tree, Spin } from 'antd';

function S0062({ tree, value, onChange }) {
  /**
   * 1. 长期和短期目标，如果有选择四级，则四级为短期目标，三级为长期目标；如果没有选择4级，只选择3级，则三级为短期目标，二级为长期目标。长期目标最高选择到2级，短期目标最多可以选择到3级。
   */
  const { data = [], loading } = useRequest('/data/S0062.json');

  useEffect(() => {
    return () => {};
  }, [data.length]);

  const targetToList = (target = {}) => {
    /**
     * {
     *  '1-2-3':[]
     * }
     */
    let result = [];
    Object.keys(target).forEach((name) => {
      const levels = name.split('-');
      if (levels.length === 2) {
        result = [...result, ...target[name]];
      }
      if (levels.length === 3) {
        result = [...result, name, ...target[name]];
      }
    });
    return result;
  };

  const listToTarget = (list) => {
    const sortList = list.sort((a, b) => a.split('-').length - b.split('-').length);
    const check = {};

    sortList.forEach((i) => {
      const levels = i.split('-');
      if (levels.length === 3) {
        if (check[i] === undefined) {
          check[i] = {
            children: [],
          };
        }
      }
      if (levels.length === 4) {
        const parent = `${levels[0]}-${levels[1]}-${levels[2]}`;
        if (check[parent]) {
          check[parent].children.push(i);
        }
      }
    });

    const result = {};

    Object.keys(check).forEach((name) => {
      const i = check[name];
      const levels = name.split('-');
      if (i.children.length === 0) {
        // 只有第三層.要把第二層當作長期目標
        const parent = `${levels[0]}-${levels[1]}`;
        if (result[parent] === undefined) {
          result[parent] = [];
        }
        result[parent].push(name);
      } else {
        // 第四層.要把第三層當作長期目標
        const parent = `${levels[0]}-${levels[1]}-${levels[2]}`;
        if (result[parent] === undefined) {
          result[parent] = [];
        }
        result[parent] = [...result[parent], ...i.children];
      }
    });

    return result;
  };

  if (loading) {
    return <Spin />;
  }

  const treeData = data
    .filter((i) => i.title === tree)[0]
    .children.map((i) => {
      i.checkable = false;
      return i;
    });

  const list = targetToList(value);

  return (
    <Tree
      checkable
      checkStrictly
      checkedKeys={list}
      defaultExpandedKeys={list}
      defaultCheckedKeys={list}
      treeData={treeData}
      onCheck={(checkedKeys, { checked, node }) => {
        const { key } = node;
        console.log(node);
        if (checked) {
          // 如果是第四層.要自動幫第三層勾選
          const levels = key.split('-');
          if (levels.length === 4) {
            const parentKey = `${levels[0]}-${levels[1]}-${levels[2]}`;
            if (list.findIndex((i) => i === parentKey) === -1) {
              onChange(listToTarget([...list, parentKey, key]));
            } else {
              onChange(listToTarget([...list, key]));
            }
          } else {
            onChange(listToTarget([...list, key]));
          }
        } else {
          onChange(listToTarget(list.filter((i) => i !== key)));
        }
      }}
    />
  );
}

function Target(params) {
  const { guide = {} } = params;

  if (guide.code === 'S0062') {
    return <S0062 {...params} />;
  }

  return <div />;
}

export default Target;
