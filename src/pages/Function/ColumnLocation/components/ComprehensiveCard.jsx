import { Form, Card, Button, Modal, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import ProList from '@ant-design/pro-list';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
  getComprehensiveAllSection,
  createComprehensive,
  removeComprehensive,
} from '@/pages/Function/ColumnLocation/service';
import { getCommonEnums } from '@/services/common';
import { getAuth } from '@/utils/utils';

const ComprehensiveCard = () => {
  const [loading, setLoading] = useState(true);
  const [parentSection, setParentSection] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [parentInfo, setParentInfo] = useState();

  const [form] = Form.useForm();

  const queryComprehensiveSectionAll = async () => {
    const common = await getCommonEnums({
      enumName: 'AssessSectionType',
    });
    const res = await getComprehensiveAllSection();
    setLoading(false);
    if (common && res) {
      const commonArr = Object.values(common);
      const newCommon = commonArr
        .map((item) => {
          item.list = [];
          item.type = item.code;
          item.name = item.codeCn;
          res.forEach((sub) => {
            if (item.code === sub.type) {
              item.list.push(sub);
            }
          });
          return item;
        })
        .sort((a, b) => a.ordianl - b.ordianl);
      console.log('newCommon', newCommon);
      setParentSection(newCommon);
    }
  };

  useEffect(() => {
    queryComprehensiveSectionAll();
  }, []);

  const handleRemove = (item) => {
    Modal.confirm({
      title: `确定删除【${item.name}】吗？`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const res = await removeComprehensive({
          id: item.id,
        });
        if (res) {
          message.success('删除成功');
          queryComprehensiveSectionAll();
        }
      },
    });
    console.log(item);
  };

  // 新增
  const handleAdd = (item) => {
    setIsModalVisible(true);
    setParentInfo(item);
  };

  // 取消
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 确定
  const handleOk = async () => {
    const values = await form.validateFields();
    if (values) {
      const getValues = form.getFieldsValue();
      const postData = {
        ...getValues,
        type: parentInfo.type,
      };
      const res = await createComprehensive(postData);
      if (res) {
        message.success('新增成功');
        queryComprehensiveSectionAll();
        handleCancel();
      }
    }
  };

  const getProList = (item) => {
    return (
      <ProList
        rowKey="id"
        split
        expandable={{
          rowExpandable: (record) => record.expandable,
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
        }}
        dataSource={item.list}
        metas={{
          title: {
            dataIndex: 'name',
          },
          description: {
            render: (_, record) => {
              return record.list && getProList(record);
            },
          },
          actions: {
            render: (_, record) => [
              getAuth()?.canEdit && (
                <Button
                  onClick={() => handleRemove(record)}
                  key="remove"
                  danger
                  type="primary"
                  size="small"
                >
                  删除
                </Button>
              ),
            ],
          },
        }}
      />
    );
  };

  return (
    <Card
      loading={loading}
      title="综合评估、教案及档案管理栏位设置"
      style={{
        marginBottom: 24,
      }}
      bordered={false}
    >
      <ProList
        rowKey="type"
        split
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
        }}
        dataSource={parentSection}
        metas={{
          title: {
            dataIndex: 'name',
          },
          description: {
            render: (_, record) => {
              return record.list && getProList(record);
            },
          },
          actions: {
            render: (_, record) => [
              getAuth()?.canEdit && (
                <Button onClick={() => handleAdd(record)} type="primary" size="small">
                  新增
                </Button>
              ),
            ],
          },
        }}
      />

      <Modal title="编辑" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form}>
          <Form.Item name="name" rules={[{ required: true, message: '请输入内容' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default ComprehensiveCard;
