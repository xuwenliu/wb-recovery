import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';

import { getGuide } from '@/pages/scale/service/compose';
import { getCmponent } from '@/pages/scale/compose/report/components';

const getData = ({ guide }) => {
  const {
    code,
    scaleName,
    shortName,
    reportDate,
    totalReport,
    reports,
    user,
    testeeInfo,
    suggests,
    answers,
  } = guide;
  const result = {
    code,
    scaleName,
    shortName,
    totalReport,
    reports,
    reportDate,
    user,
    testeeInfo,
    suggests,
    answers,
  };

  return result;
};

function ScaleReportModal({ report = {}, onClose }) {
  const [record, setRecord] = useState();

  const visible = report.id !== undefined;

  const getUI = () => {
    const UI = getCmponent(record.code);

    const data = getData({ guide: record });

    return UI === null ? null : <UI {...data} />;
  };

  const queryRecord = async () => {
    const res = await getGuide({ compose: report.scale, id: report.id, takeAnswer: true });
    if (res) {
      setRecord(res);
    }
  };

  useEffect(() => {
    if (visible) {
      queryRecord();
    }

    return () => {};
  }, [`${report.scale}_${report.id}`]);

  return (
    <Modal
      title="报告内容"
      destroyOnClose
      visible={visible}
      width="75%"
      onCancel={() => {
        onClose();
      }}
      footer={[
        <Button
          key="close"
          onClick={() => {
            onClose();
          }}
        >
          关闭
        </Button>,
      ]}
    >
      {record && getUI()}
    </Modal>
  );
}

export default ScaleReportModal;
