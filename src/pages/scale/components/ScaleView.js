import React, { useState, useEffect } from 'react';

import { List, Checkbox, Col, Row, Spin } from 'antd';

function ScaleView({ types = [], scales = { content: [] }, searchScale, scalesLoading }) {
  const [select, setSelect] = useState([]);

  const selectTopAndChild = (parent, child) => {
    if (child) {
      setSelect([parent, child]);
      searchScale({ scaleType: `${parent.name}.${child.name}` });
    } else {
      const children = types.filter((i) => i.parentId === parent.id);
      if (children.length > 0) {
        setSelect([parent, children[0]]);
      } else {
        setSelect([parent]);
        searchScale({ scaleType: `${parent.name}` });
      }
    }
  };

  useEffect(() => {
    if (types.length > 0) {
      const children = types.filter((i) => i.parentId === types[0].id);

      if (children.length > 0) {
        selectTopAndChild(types[0], children[0]);
      } else {
        selectTopAndChild(types[0]);
      }
    }
    return () => {};
  }, [types]);

  const [parent = {}, child = {}] = select;

  console.log('select:', parent, child);

  return (
    <Row gutter={16}>
      <Col span={7}>
        <List
          bordered
          dataSource={types.filter((i) => i.parentId === null)}
          renderItem={(type) => (
            <List.Item
              onClick={() => {
                /**
                 * 如果沒有第二層.直接查詢
                 * */
                const children = types.filter((i) => i.parentId === type.id);
                if (children.length > 0) {
                  selectTopAndChild(type);
                } else {
                  searchScale({ scaleType: `${type.name}` });
                }
              }}
            >
              {type.id === parent.id && '*'} {type.name}
            </List.Item>
          )}
        />
      </Col>
      <Col span={7}>
        <List
          bordered
          dataSource={types.filter((i) => i.parentId === (parent ? parent.id : ''))}
          renderItem={(type) => (
            <List.Item
              onClick={() => {
                selectTopAndChild(parent, type);
              }}
            >
              {type.id === child.id && '*'} {type.name}
            </List.Item>
          )}
        />
      </Col>
      <Col span={10}>
        {scalesLoading ? (
          <Spin />
        ) : (
          <Checkbox.Group style={{ width: '100%' }}>
            {scales.content.map(({ id, scaleName }) => (
              <Row key={id}>
                <Col span={24}>
                  <Checkbox
                    value={id}
                    onChange={(e) => {
                      // eslint-disable-next-line no-console
                      console.log(scaleName, e.target.checked);
                    }}
                  >
                    {scaleName}
                  </Checkbox>
                </Col>
              </Row>
            ))}
          </Checkbox.Group>
        )}
      </Col>
    </Row>
  );
}

export default ScaleView;
