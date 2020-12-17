import React, { useState, useEffect } from 'react';
import { List, Card, Input, message } from 'antd';
import moment from 'moment';
import { getAllEduRecord, saveEditRecord } from '@/pages/Rehabilitation/PersonalPlan/service';
import { getAuth } from '@/utils/utils';

const TeachingRecord = ({ patientId, classId, tab }) => {
  const [data, setData] = useState([]);

  const queryAllEduRecord = async () => {
    if (!patientId) return;
    const res = await getAllEduRecord({ patientId, classId });
    res && setData(res);
  };
  const onRecordChange = (e, index, subIndex) => {
    const value = e.target.value;
    let newData = [...data];
    newData[index].specialEduRecordDetailVos[subIndex].description = value;
    setData(newData);
  };
  const handleSaveRecord = async (row) => {
    if (!row.description) return;
    const res = await saveEditRecord({
      recordId: row.id,
      description: row.description,
    });
    if (res) {
      queryAllEduRecord();
      message.success('操作成功');
    }
  };
  useEffect(() => {
    if (patientId || classId || tab == 3) {
      queryAllEduRecord();
    }
  }, [patientId, classId, tab]);
  return (
    <>
      {data.map((item, index) => (
        <List
          key={index}
          header={
            <div style={{ textAlign: 'center' }}>
              {item.startTime && (
                <>
                  {moment(item.startTime).format('YYYY-MM-DD')} 至
                  {moment(item.endTime).format('YYYY-MM-DD')}
                </>
              )}
              &nbsp;&nbsp;{item.className}
            </div>
          }
          grid={{
            column: 6,
          }}
          dataSource={item.specialEduRecordDetailVos}
          renderItem={(sub, subIndex) => (
            <List.Item>
              <Card title={sub.sort}>
                <Input
                  disabled={getAuth(41)?.canEdit && sub.isDone}
                  value={sub.description}
                  onChange={(e) => onRecordChange(e, index, subIndex)}
                  onBlur={() => handleSaveRecord(sub)}
                />
              </Card>
            </List.Item>
          )}
        />
      ))}
    </>
  );
};

export default TeachingRecord;
