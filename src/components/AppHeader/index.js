import React, { PureComponent } from 'react';
import { PageHeader, Button } from 'antd';
// import { PageContainer } from '@ant-design/pro-layout';

import { IconButton } from '@material-ui/core';
import router from '@/utils/router';

const Header = ({ contents, returnUrl, onClick, onLoadType }) => {
  const goBack = (url) => {
    if (!url) {
      router.goBack();
    } else {
      router.push(url);
    }
  };
  return (
    <PageHeader
      extra={
        onLoadType
          ? []
          : [
              /**
                * <Button
                aria-label="delete"
                onClick={() => {
                  if (onClick) {
                    onClick();
                  } else {
                    goBack(returnUrl);
                  }
                }}
              >
                back
              </Button>,
                */
            ]
      }
    >
      {contents}
    </PageHeader>
  );
};

class Page extends PureComponent {
  render() {
    const { children, returnUrl, onClick, onLoadType = false } = this.props;
    return (
      <Header contents={children} returnUrl={returnUrl} onClick={onClick} onLoadType={onLoadType} />
    );
  }
}
export default Page;
