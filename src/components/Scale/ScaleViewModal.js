import React, { useEffect, useState } from 'react';
import { Modal, Button, Tag } from 'antd';

import { fetchScaleData } from '@/pages/scale/service/compose';
import ScaleView from './ScaleView';

function ScaleViewModal({ value = [], onChange, disabled = false }) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);

  const queryData = async () => {
    setData(await fetchScaleData());
  };

  const getName = (code) => {
    const index = data.findIndex((i) => i.code == code);

    if (index !== -1) {
      return data[index].name;
    }

    return code;
  };

  useEffect(() => {
    queryData();
    return () => {};
  }, []);

  return (
    <>
      {value.map((v) => (
        <Tag
          disabled={disabled}
          style={{ margin: '5px' }}
          closable
          onClose={(e) => {
            e.preventDefault();
            onChange(value.filter((i) => i !== v));
          }}
        >
          {getName(v)}
        </Tag>
      ))}
      <Button
        disabled={disabled}
        onClick={() => {
          setVisible(!visible);
        }}
      >
        设定
      </Button>
      <Modal
        title="评估工具"
        destroyOnClose
        visible={visible}
        width="75%"
        onCancel={() => {
          setVisible(false);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setVisible(false);
            }}
          >
            关闭
          </Button>,
        ]}
      >
        <ScaleView data={data} types={[]} value={value} onChange={onChange} />
      </Modal>
    </>
  );
}

export default ScaleViewModal;
