import React, { useEffect } from 'react';
import { uniqueId } from 'lodash/util';

function Page({ data }) {
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div style={{ padding: '10px' }}>
      {data.map(({ name, score }) => (
        <div style={{ padding: ' 5px', border: '1px dashed #000' }} key={uniqueId()}>
          {name} {score}分
        </div>
      ))}
    </div>
  );
}

export default Page;
