import React, { useState } from 'react';
import { Form, Input, Row, Col } from 'antd';

import Preview from '../Preview';

const FormItem = Form.Item;

function TextEditor() {
  const [name, setName] = useState('');

  return (
    <Row gutter={10}>
      <Col span={12}>
        <Preview record={{ type: 'TEXT', name }} />
      </Col>
      <Col span={12}>
        <FormItem label="名称" name="name" rules={[{ required: true }]}>
          <Input
            placeholder="请输入"
            style={{ width: '70%' }}
            onChange={(e) => {
              const { value } = e.target;
              console.log('on change:' + value);
              setName(value);
            }}
            value={name}
          />
        </FormItem>
      </Col>
    </Row>
  );
}

export default TextEditor;
