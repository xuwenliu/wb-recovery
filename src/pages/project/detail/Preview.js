import React from 'react';
import { Form, Input, Select, Cascader } from 'antd';

const { Option } = Select;

const FormItem = Form.Item;

function Preview({ record }) {
  const { type, name } = record;

  if (type === 'SELECT') {
    const { value = [] } = record;

    return (
      <FormItem label={name || '未设定'}>
        <Select defaultValue={value.length === 1 ? value[0] : ''} style={{ width: '300' }}>
          {(value || []).map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      </FormItem>
    );
  }

  if (type === 'CASCADER') {
    const { value } = record;
    const options = [];

    /**
     * 固定兩層
     */
    value.forEach((e) => {
      const key = Object.keys(e)[0];
      const item = e[key];

      const top = {
        value: key,
        label: key,
        children: [],
      };

      item.forEach((child) => {
        top.children.push({
          value: child,
          label: child,
        });
      });

      options.push(top);
    });

    return (
      <FormItem label={name || '未设定'}>
        <Cascader options={options} />
      </FormItem>
    );
  }

  return (
    <FormItem label={name || '未设定'}>
      <Input />
    </FormItem>
  );
}

export default Preview;
