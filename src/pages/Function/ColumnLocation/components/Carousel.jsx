import { Form, Card, Button, Modal, Input, message, Upload, Switch, Image } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';

import { ExclamationCircleOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';

import {
  getCarouselList,
  saveCarousel,
  enableCarousel,
  unableCarousel,
} from '@/pages/Function/ColumnLocation/service';
import { getAuth } from '@/utils/utils';
import { fileUpload } from '@/services/common';

const Carousel = () => {
  const actionRef = useRef();
  const [path, setPath] = useState({
    name: '',
    url: '',
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 新增
  const handleAdd = (item) => {
    setIsModalVisible(true);
  };

  // 取消
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setPath('');
  };

  // 确定
  const handleOk = async () => {
    const values = await form.validateFields();
    if (values) {
      const getValues = form.getFieldsValue();
      const postData = {
        ...getValues,
        path: path.name,
      };
      const res = await saveCarousel(postData);
      if (res) {
        message.success('新增成功');
        actionRef?.current?.reload();
        handleCancel();
      }
    }
  };

  const onSwitchChange = async (enable, id) => {
    const fn = enable ? enableCarousel : unableCarousel;
    const res = await fn({
      id,
    });
    if (res) {
      message.success('操作成功');
      actionRef?.current?.reload();
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '图片',
      dataIndex: 'path',
      render: (_, record) => {
        return <Image src={record.path} width={40} />;
      },
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <Switch
            checked={record.enable}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            onChange={(checked) => onSwitchChange(checked, record.id)}
          />
        );
      },
    },
  ];

  const uploadButton = <div>{uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}</div>;
  async function beforeUpload(file) {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('只支持jpg/png/gif格式图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('图片大小不能超过10MB!');
    }
    const formData = new FormData();
    formData.append('file', file);
    setUploadLoading(true);
    const res = await fileUpload(formData);
    if (res) {
      setPath(res);
      setUploadLoading(false);
    }
    return isJpgOrPng && isLt2M;
  }
  return (
    <Card
      title="轮播图设置"
      style={{
        marginBottom: 24,
      }}
      bordered={false}
    >
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          getAuth()?.canEdit && (
            <Button key="add" type="primary" onClick={() => handleAdd()}>
              <PlusOutlined /> 新增
            </Button>
          ),
        ]}
        request={(params, sorter, filter) => {
          return getCarouselList({ ...params });
        }}
        columns={columns}
      />
      <Modal title="轮播图" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="图片"
            name="fileList"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              {path.url ? (
                <img src={path.url} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            label="是否启用"
            name="enable"
            rules={[{ required: true, message: '请选择是否启用' }]}
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default Carousel;
