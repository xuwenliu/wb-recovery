import React from 'react';
import { Alert } from 'antd';

function AlertWrap({ children, ...others }) {
  return <Alert message={children} {...others} />;
}

export default AlertWrap;
