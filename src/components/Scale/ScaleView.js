import React from 'react';

import { Tree } from 'antd';

function ScaleView({ data, value, onChange }) {
  const getTreeData = () => {
    const tree = [];

    if (data && data.length > 0) {
      const mapping = {};
      const treeData = {};
      data.forEach((ele) => {
        ele.type.split(':').forEach((t) => {
          const [top, sub] = t.split('.');
          if (treeData[top] === undefined) {
            treeData[top] = {};
          }
          if (sub) {
            if (treeData[top][sub] === undefined) {
              treeData[top][sub] = { children: [] };
            }
            if (mapping[`${top}-${sub}`] === undefined) {
              mapping[`${top}-${sub}`] = [];
            }
            mapping[`${top}-${sub}`].push(ele);
          } else {
            if (mapping[top] === undefined) {
              mapping[top] = [];
            }
            mapping[top].push(ele);
          }
        });
      });

      Object.keys(treeData).forEach((key) => {
        const top = {
          title: key,
          key,
          checkable: false,
          children: [],
        };

        if (mapping[key]) {
          top.children = [
            ...top.children,
            ...mapping[key].map((i) => {
              return { title: i.name, key: i.code };
            }),
          ];
        }

        Object.keys(treeData[key]).forEach((ck) => {
          const sub = {
            title: ck,
            key: `${key}-${ck}`,
            checkable: false,
            children: [],
          };

          if (mapping[`${key}-${ck}`]) {
            sub.children = [
              ...sub.children,
              ...mapping[`${key}-${ck}`].map((i) => {
                return { title: i.name, key: i.code };
              }),
            ];
          }

          top.children.push(sub);
        });

        tree.push(top);
      });
    }

    return tree;
  };

  const tree = getTreeData();

  console.log('defaultSelectedKeys:', value);

  return (
    <Tree
      checkable
      checkStrictly
      defaultExpandedKeys={value}
      defaultCheckedKeys={value}
      treeData={tree}
      onCheck={(checkedKeys, { checked, node }) => {
        const { key } = node;
        if (checked) {
          onChange([...value, key]);
        } else {
          onChange(value.filter((i) => i === key));
        }
      }}
    />
  );
}

export default ScaleView;
