import React, { Fragment, useEffect } from 'react';

import YearLimit from './limit/YearLimit';
import MonthLimit from './limit/MonthLimit';
import DayLimit from './limit/DayLimit';

import MonthPDMSLimit from './limit/MonthPDMSLimit';

/**
 * exp:AEPS 用年齡看.但是表格分是用月齡
 *
 * object：受測者
 * limits：人口學的限制
 */
function Demographics({ form, object, limits, onChange }) {
  const { getFieldDecorator } = form;

  const getUI = () => {
    let result = [];

    if (limits.YEAR) {
      result = [
        ...result,
        getFieldDecorator('YEAR', {
          rules: [{ required: true, message: '年龄必须输入' }],
          onChange: value => {
            onChange({ YEAR: value });
          },
        })(<YearLimit form={form} object={object} />),
      ];
    }

    if (limits.MONTH_PDMS) {
      result = [
        ...result,
        getFieldDecorator('MONTH', {
          rules: [{ required: true, message: '月龄必须输入' }],
          onChange: value => {
            onChange({ MONTH_PDMS: value });
          },
        })(<MonthPDMSLimit form={form} object={object} />),
      ];
    }

    if (limits.MONTH) {
      result = [
        ...result,
        getFieldDecorator('MONTH', {
          rules: [{ required: true, message: '月龄必须输入' }],
          onChange: value => {
            onChange({ MONTH: value });
          },
        })(<MonthLimit form={form} object={object} />),
      ];
    }

    if (limits.DAY) {
      result = [
        ...result,
        getFieldDecorator('DAY', {
          rules: [{ required: true, message: '日龄必须输入' }],
          onChange: value => {
            onChange({ DAY: value });
          },
        })(<DayLimit form={form} object={object} />),
      ];
    }

    return result;
  };

  useEffect(() => {
    if (Object.keys(limits).length === 0) {
      onChange({});
    }
    return () => {};
  }, [limits]);

  return <Fragment>{getUI()}</Fragment>;
}

export default Demographics;
