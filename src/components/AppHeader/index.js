import React, { PureComponent } from 'react';
import { PageHeader } from 'antd';
// import { PageContainer } from '@ant-design/pro-layout';

// import router from '@/utils/router';

const Header = ({ contents, onLoadType }) => {
  // const goBack = (url) => {
  //   if (!url) {
  //     router.goBack();
  //   } else {
  //     router.push(url);
  //   }
  // };
  return (
    <PageHeader
      style={{ height: 40, marginBottom: 10, padding: 0 }}
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
      title={contents}
    >
      {/* {contents} */}
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
