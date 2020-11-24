import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import ProList from '@ant-design/pro-list';
import Preview from './Preview';

function SystemModal({ dispatch, demographics, visible, cancel, ok }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const search = () => {
    dispatch({
      type: 'projectDetail/searchDemographics',
      payload: { values: { owner: 'system' } },
    });
  };

  const handleOk = () => {
    const values = demographics.filter(
      (i) => selectedRowKeys.findIndex((key) => key === i.id) !== -1,
    );
    ok(values);
  };

  useEffect(() => {
    search();
    return () => {};
  }, []);

  return (
    <Modal
      centered
      destroyOnClose
      visible={visible}
      closable={false}
      title="系统预设变量"
      footer={[
        <Button
          key="ok"
          type="primary"
          onClick={() => {
            handleOk();
          }}
        >
          确定
        </Button>,
        <Button
          key="cancel"
          onClick={() => {
            cancel();
          }}
        >
          取消
        </Button>,
      ]}
    >
      <ProList
        metas={{
          description: {
            render: (_value, record) => {
              return <Preview record={record} />;
            },
          },
        }}
        rowKey="id"
        rowSelection={rowSelection}
        dataSource={demographics}
      />
    </Modal>
  );
}

export default SystemModal;
