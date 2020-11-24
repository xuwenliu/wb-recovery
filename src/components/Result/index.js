import React from 'react';
import { Result } from 'antd';

function ResultWrap({ title, extra }) {
  return <Result title={title} extra={extra} />;
}

export default ResultWrap;
