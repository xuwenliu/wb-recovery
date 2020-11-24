import React from 'react';
import { ActivityIndicator } from 'antd-mobile';
/**
 * 剛開始 loading == false
 */
function Page({ loading, children, data }) {
  if (loading === undefined) {
    return null;
  }

  if (loading) {
    return (
      <div
        style={{
          margin: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <ActivityIndicator animating size="large" />
        <span style={{ marginTop: 8 }}>加载中...</span>
      </div>
    );
  }

  if (data === undefined) {
    return null;
  }

  return <>{children}</>;
}

export default Page;
