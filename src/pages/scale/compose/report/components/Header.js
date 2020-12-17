import React from 'react';

import router from '@/utils/router';
import Button from '@material-ui/core/Button';
import Header from '@/components/AppHeader';
import { replace } from 'lodash/string';
import useMediaQuery from '@material-ui/core/useMediaQuery';

function Page({ user = {}, name, id, dispatch }) {
  const fileName = `${name}_${user.name}.pdf`;
  const download = () => {
    const url = window.document.location.href;
    let page = replace(url, 'scale/compose/report', 'scale/compose/print');
    page = replace(url, 'localhost', 'cr.ts-health.cn');

    console.log(page);

    dispatch({
      type: 'download/execute',
      payload: {
        name: fileName,
        fileName,
        page,
      },
    });
  };

  const mediaType = useMediaQuery('print'); // 判断媒体类型是不是打印

  return (
    <Header onLoadType={mediaType}>
      <div style={{ textAlign: 'center', verticalAlign: 'middle' }}>{name}</div>
      {!mediaType ? (
        <>
          <Button
            style={{
              position: 'absolute',
              top: 0,
              right: 60,
              fontSize: '16px',
              lineHeight: '48px',
              fontWeight: 'bold',
            }}
            aria-label="delete"
            onClick={() => {
              router.push({
                pathname: `/scale/suggest/${id}`,
                query: {},
              });
            }}
            fontSize="large"
          >
            训练目标
          </Button>
          <Button
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              fontSize: '16px',
              lineHeight: '48px',
              fontWeight: 'bold',
            }}
            onClick={() => {
              download();
            }}
            fontSize="large"
          >
            下载
          </Button>
        </>
      ) : (
        ''
      )}
    </Header>
  );
}

export default Page;
