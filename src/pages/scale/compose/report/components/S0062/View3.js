/* eslint-disable prefer-destructuring */
import React, { useEffect } from 'react';
import { uniqueId } from 'lodash/util';

function Chart() {
  const id = uniqueId();

  const getStyle = () => {
    return { height: '300', width: '300' };
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      <canvas
        id={id}
        width={300}
        height={300}
        style={{ display: 'none2', border: '1px solid #000000;' }}
      />
      <div style={getStyle()}>chart</div>
    </>
  );
}

function Page({ data = [] }) {
  const style = { padding: '5px', margin: '5px' };

  return (
    <div style={{ padding: '10px' }}>
      {data.map(({ name, children }) => (
        <div key={uniqueId()} style={{ ...style }}>
          <h5>侧面图（三）{name}</h5>
          <div>
            <Chart />
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
