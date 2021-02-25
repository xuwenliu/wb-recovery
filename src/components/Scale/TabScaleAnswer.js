import React, { useEffect, useState } from 'react';
import { Space, Tabs, Result, Button } from 'antd';
import Scale from '@/pages/scale/components/ScaleAnswer';
import { CheckOutlined } from '@ant-design/icons';

const buildScaleQuestions = (scale, name) => {
  const [type, scaleName] = name.split('.');
  let questions = [];

  console.log(type, scaleName);

  scale.computes.forEach((c) => {
    if (c.scale.scaleName === scaleName) {
      questions = c.scale.scaleQuestions;
    }
  });

  return questions;
};

const isFinish = (data) => {
  let count = 0;
  data.answers.forEach((i) => {
    if (i.finish) {
      count += 1;
    }
  });

  if (count === data.answers.length) {
    return true;
  }

  return false;
};

function TabScaleAnswer({ data, current, submit, createReport }) {
  const { id, master } = data;

  const getUI = ({ finish, scale }) => {
    if (finish) {
      return <Result status="success" title="答题完成" subTitle="答题完成.请继续完成其他部分" />;
    }

    return (
      <Scale
        model={{
          scaleQuestions: buildScaleQuestions(master, scale),
        }}
        submit={(submitValues) => {
          submit({ compose: master.id, answer: id, subScale: scale, values: submitValues });
        }}
      />
    );
  };

  useEffect(() => {
    console.log('useEffect current:', current);
    return () => {};
  }, [current]);

  if (isFinish(data)) {
    return (
      <Result
        title="答题完成"
        subTitle="请确认后送出产生报告"
        extra={
          <Button
            type="primary"
            onClick={() => {
              createReport({ compose: master.id, answer: id });
            }}
          >
            产生报告
          </Button>
        }
      />
    );
  }

  const getSubScaleName = (scale) => {
    const [, name] = scale.split('.');
    return name || scale;
  };

  return (
    <Space direction="vertical">
      <Tabs tabPosition="left" defaultActiveKey={current}>
        {data.answers.map(({ finish, scale }, i) => (
          <Tabs.TabPane
            tab={
              finish ? (
                <span>
                  <CheckOutlined />
                  {getSubScaleName(scale)}
                </span>
              ) : (
                <span>{getSubScaleName(scale)}</span>
              )
            }
            key={scale}
          >
            {getUI({ finish, scale })}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Space>
  );
}

export default TabScaleAnswer;
