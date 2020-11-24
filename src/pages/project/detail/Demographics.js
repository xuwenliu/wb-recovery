import React, { useState } from 'react';
import { Button } from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import ProList from '@ant-design/pro-list';

import SystemModal from './SystemModal';
import CustomModal from './CustomModal';
import Preview from './Preview';

function Demographics({ dispatch, demographics, value = [], onChange }) {
  const [modal, setModal] = useState();

  const save = (values) => {
    dispatch({
      type: 'projectDetail/saveDemographics',
      payload: { values: { code: '123', ...values } },
      callback: () => {
        setModal();
      },
    });
  };

  return (
    <div>
      <ProList
        headerTitle="人口学变量"
        toolBarRender={() => {
          return [
            <Button
              key="system"
              icon={<PlusOutlined />}
              onClick={() => {
                setModal('system');
              }}
            >
              系统预设
            </Button>,
            <Button
              key="custom"
              icon={<PlusOutlined />}
              onClick={() => {
                setModal('custom');
              }}
            >
              自定义变量
            </Button>,
          ];
        }}
        rowKey="name"
        dataSource={value}
        metas={{
          description: {
            render: (_value, record) => {
              return <Preview record={record} />;
            },
          },
          actions: {
            render: (text, row) => [<a key="link">移除</a>],
          },
        }}
      />
      <CustomModal
        dispatch={dispatch}
        demographics={demographics}
        visible={modal === 'custom'}
        cancel={() => {
          setModal();
        }}
        ok={(values) => {
          save(values);
        }}
      />
      <SystemModal
        dispatch={dispatch}
        demographics={demographics}
        visible={modal === 'system'}
        cancel={() => {
          setModal(false);
        }}
        ok={(checks) => {
          onChange([...value, ...checks]);
          setModal(true);
        }}
      />
    </div>
  );
}

export default Demographics;
