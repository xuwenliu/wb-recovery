/* eslint-disable prefer-destructuring */
import React from 'react';
import { uniqueId } from 'lodash/util';

function Page({ data = [] }) {
  const style = { padding: '5px', margin: '5px' };

  return (
    <div style={{ padding: '10px' }}>
      {data.map(({ name, children }) => (
        <div key={uniqueId()} style={{ ...style }}>
          <h5>侧面图（三）{name}</h5>
          <div>
            {children.map(child => (
              <div
                key={uniqueId()}
                style={{ ...style, display: 'inline-block', border: '1px dashed #000' }}
              >
                {child.children.map(question => (
                  <div
                    style={{ ...style, display: 'inline-block', border: '1px dashed #000' }}
                    key={uniqueId()}
                  >
                    {question.name} {question.score} 分
                  </div>
                ))}
                <div>{child.name}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Page;
