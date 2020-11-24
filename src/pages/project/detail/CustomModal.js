import React, { useState } from 'react';
import { Modal, Select, Button, Form, Tabs } from 'antd';

import ProList from '@ant-design/pro-list';
import TextEditor from './editor/TextEditor';
import SelectEditor from './editor/SelectEditor';
import Preview from './Preview';

const { Option } = Select;
const { TabPane } = Tabs;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '请输入${label}',
};

function CustomModal({ dispatch, demographics, visible, cancel, ok }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const search = () => {
    dispatch({
      type: 'projectDetail/searchDemographics',
      payload: {},
    });
  };

  const [form] = Form.useForm();

  const [type, setType] = useState('SELECT');

  const getEditor = () => {
    if (type === 'TEXT') {
      return <TextEditor />;
    }

    if (type === 'SELECT') {
      return <SelectEditor />;
    }
  };

  const onFinish = (params) => {
    const { name, value } = params;

    if (type === 'SELECT') {
      ok({ type, name, value: value.map((i) => i.value) });
    } else {
      ok({ type, name, value });
    }
  };

  return (
    <Modal
      centered
      destroyOnClose
      visible={visible}
      closable={false}
      title="自定义变量"
      forceRender
      footer={[
        <Button
          key="ok"
          type="primary"
          onClick={() => {
            form.submit();
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
      <Tabs
        defaultActiveKey="1"
        centered
        onTabClick={(key) => {
          if (key === '1') {
            search();
          }
        }}
      >
        <TabPane tab="清单" key="1">
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
        </TabPane>
        <TabPane tab="新增" key="2">
          <Form
            {...layout}
            initialValues={{}}
            onFinish={onFinish}
            validateMessages={validateMessages}
            form={form}
          >
            <Form.Item label="类型">
              <Select
                defaultValue={type}
                onChange={(value) => {
                  setType(value);
                }}
                style={{ width: '200px' }}
              >
                <Option value="text">输入</Option>
                <Option value="select">下拉列表</Option>
              </Select>
            </Form.Item>
            {getEditor()}
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
}

export default CustomModal;
