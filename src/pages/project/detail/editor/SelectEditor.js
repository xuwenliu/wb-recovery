import React, { useState } from 'react';
import { Form, Input, Row, Col } from 'antd';

import EditableTable from '@/components/EditableTable';
import Preview from '../Preview';

const FormItem = Form.Item;

function SelectEditor() {
  const [name, setName] = useState('');
  const [options, setOptions] = useState([]);

  return (
    <Row gutter={10}>
      <Col span={6}>
        <Preview
          record={{
            type: 'SELECT',
            name,
            value: options.map((i) => {
              return i.value;
            }),
          }}
        />
      </Col>
      <Col span={18}>
        <FormItem label="名称" name="name" rules={[{ required: true }]}>
          <Input
            placeholder="请输入"
            style={{ width: '70%' }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </FormItem>
        <FormItem label="名称" name="value" rules={[{ required: true }]}>
          <EditableTable
            columns={[
              {
                title: '內容',
                dataIndex: 'value',
                editable: true,
                /**
                render: (text) => (
                  <Input placeholder="请输入" style={{ width: '100%' }} value={text} />
                ),
                 */
              },
            ]}
            onChange={(changeValue) => {
              setOptions(changeValue);
            }}
          />
        </FormItem>
      </Col>
    </Row>
  );
}

export default SelectEditor;
