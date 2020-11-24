import React, { useEffect } from 'react';
import { uniqueId } from 'lodash/util';

function Page({ data }) {
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div style={{ padding: '10px' }}>
      {data.map(({ name, children }) => (
        <div style={{ padding: ' 5px', border: '1px dashed #000' }} key={uniqueId()}>
          {children.map(child => (
            <div style={{ padding: ' 5px', border: '1px dashed #000' }} key={uniqueId()}>
              {child.name} {child.score}分
            </div>
          ))}
          {name}
        </div>
      ))}
    </div>
  );
}

export default Page;
