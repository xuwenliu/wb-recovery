import React, { useEffect } from 'react';

import { useRequest } from '@umijs/hooks';

import { Tree, Spin } from 'antd';
import { LikeOutlined } from '@ant-design/icons';

const targetToList = (target = []) => {
  let result = [];
  target.forEach(({ key, desc, items }) => {
    result = [...result, { key, desc }];
    if (items && items.length > 0) {
      items.forEach((i) => {
        result = [...result, { key: i.key, desc: i.desc }];
      });
    }
  });

  return result;
};

const listToTarget = (list, data) => {
  // 階層低的要先處理
  const sortList = list.sort((a, b) => a.key.split('-').length - b.key.split('-').length);
  const check = {};

  sortList.forEach((i) => {
    const levels = i.key.split('-');
    if (levels.length === 3) {
      if (check[i.key] === undefined) {
        check[i.key] = {
          key: i.key,
          desc: i.desc,
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

  let result = [];

  Object.keys(check).forEach((key) => {
    const i = check[key];

    const levels = key.split('-');
    if (i.children.length === 0) {
      // 只有第三層.要把第二層當作長期目標
      const parent = `${levels[0]}-${levels[1]}`;

      const index = result.findIndex((x) => x.key === parent);
      if (index === -1) {
        result = [...result, { key: data[parent].key, desc: data[parent].desc, items: [i] }];
      } else {
        result[index].items.push(i);
      }
    } else {
      // 第四層.要把第三層當作長期目標
      const parent = `${levels[0]}-${levels[1]}-${levels[2]}`;
      const index = result.findIndex((x) => x.key === parent);
      if (index === -1) {
        result = [...result, { key: i.key, desc: i.desc, items: [...i.children] }];
      } else {
        result[index].items.push(i);
      }
    }
  });

  return result;
};

function S0075({ report, tree, value, onChange }) {
  const data = {};

  const getTitle = (title,score) => {
    if (score * 1 === 2) {
      return `${score}-${title}`;
    }
    return title;
  }

  const getIcon = (score) => {
    if (score * 1 === 3) {
      return <LikeOutlined />;
    }
    
  };
  const treeData = [...report]
    .filter((i) => i.name === tree)[0]
    .children.map((l1, i1) => {
      data[`${tree}-${i1}`] = { key: `${tree}-${i1}`, desc: l1.name };
      return {
        key: `${tree}-${i1}`,
        title: l1.name,
        checkable: false,
        children: l1.children?.map((l2, i2) => {
          data[`${tree}-${i1}-${i2}`] = {
            key: `${tree}-${i1}-${i2}`,
            desc: l2.name,
          };
          /**
           * 早期疗育标识3分和2分
           */
          return {
            key: `${tree}-${i1}-${i2}`,
            title: getTitle(l2.name,l2.score),
            icon: getIcon(l2.score),
            children: (l2.children || []).map((l3, i3) => {
              data[`${tree}-${i1}-${i2}-${i3}`] = {
                key: `${tree}-${i1}-${i2}-${i3}`,
                desc: l3.name,
              };
              return {
                key: `${tree}-${i1}-${i2}-${i3}`,
                title: l3.name,
              };
            }),
          };
        }),
      };
    });

  const list = targetToList(value);
  const keys = list.map((l) => {
    return l.key;
  });

  return (
    <Tree
      showIcon
      checkable
      checkStrictly
      checkedKeys={keys}
      defaultExpandedKeys={keys}
      defaultCheckedKeys={keys}
      treeData={treeData}
      onCheck={(checkedKeys, { checked, node }) => {
        const { key } = node;
        if (checked) {
          // 如果是第四層.要自動幫第三層勾選
          const levels = key.split('-');
          if (levels.length === 4) {
            const parentKey = `${levels[0]}-${levels[1]}-${levels[2]}`;
            if (list.findIndex((i) => i.key === parentKey) === -1) {
              onChange(listToTarget([...list, data[parentKey], data[key]], data));
            } else {
              onChange(listToTarget([...list, data[key]], data));
            }
          } else {
            onChange(listToTarget([...list, data[key]], data));
          }
        } else {
          onChange(
            listToTarget(
              list.filter((i) => i.key !== key),
              data,
            ),
          );
        }
      }}
    />
  );
}

function S0062({ report, tree, value, onChange }) {
  /**
   * 1. 长期和短期目标，如果有选择四级，则四级为短期目标，三级为长期目标；如果没有选择4级，只选择3级，则三级为短期目标，二级为长期目标。长期目标最高选择到2级，短期目标最多可以选择到3级。
   */
  const { data = [], loading } = useRequest('/data/S0062.json');

  useEffect(() => {
    return () => {};
  }, [data.length]);

  if (loading) {
    return <Spin />;
  }

  const ds = {};
  const treeData = data
    .filter((i) => i.title === tree)[0]
    .children.map((i) => {
      i.checkable = false;
      // 第二層
      i.children.map((i2) => {
        ds[i2.key] = {
          key: i2.key,
          desc: i2.title,
        };
        i2.children.map((i3) => {
          ds[i3.key] = {
            key: i3.key,
            desc: i3.title,
          };
        });
      });
      ds[i.key] = { key: i.key, desc: i.title };
      return i;
    });

  const list = targetToList(value);
  const keys = list.map((l) => {
    return l.key;
  });

  return (
    <Tree
      checkable
      checkStrictly
      checkedKeys={keys}
      defaultExpandedKeys={keys}
      defaultCheckedKeys={keys}
      treeData={treeData}
      onCheck={(checkedKeys, { checked, node }) => {
        const { key } = node;
        if (checked) {
          // 如果是第四層.要自動幫第三層勾選
          const levels = key.split('-');
          if (levels.length === 4) {
            const parentKey = `${levels[0]}-${levels[1]}-${levels[2]}`;
            if (list.findIndex((i) => i.key === parentKey) === -1) {
              onChange(listToTarget([...list, ds[parentKey], ds[key]], ds));
            } else {
              onChange(listToTarget([...list, ds[key]], ds));
            }
          } else {
            onChange(listToTarget([...list, ds[key]], ds));
          }
        } else {
          onChange(
            listToTarget(
              list.filter((i) => i.key !== key),
              ds,
            ),
          );
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

  if (guide.code === 'S0075') {
    return <S0075 {...params} />;
  }

  return <div>该量表「{guide.code}」尚未支持目标选择</div>;
}

export default Target;
