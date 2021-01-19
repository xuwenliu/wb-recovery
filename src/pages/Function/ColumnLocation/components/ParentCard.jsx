import { Form, Card, Button, Modal, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import ProList from '@ant-design/pro-list';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
  getParentSectionAll,
  createParent,
  getParentSectionChildren,
  removeParentBasicSection,
} from '@/pages/Function/ColumnLocation/service';
import { getCommonEnums } from '@/services/common';
import { getAuth } from '@/utils/utils';

const ParentCard = () => {
  const [loading, setLoading] = useState(true);
  const [parentSection, setParentSection] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [parentInfo, setParentInfo] = useState();
  const [form] = Form.useForm();

  const queryParentSectionAll = async () => {
    const common = await getCommonEnums({
      enumName: 'ParentSectionType',
    });
    console.log('common',common)
    const res = await getParentSectionAll();
    console.log('res',res)

    setLoading(false);
    if (common && res) {
      const commonArr = Object.values(common);
      const newCommon = commonArr
        .map((item) => {
          item.list = [];
          item.type = item.code;
          item.name = item.codeCn;
          item.expandable = true;
          item.isAdd = true;
          item.isRemove = false;
          res.forEach((sub) => {
            sub.expandable = sub.type === 13;
            sub.isAdd = sub.type === 13;
            sub.isRemove = true;
            if (item.type === sub.type) {
              item.list.push(sub);
            }
          });
          return item;
        })
        .sort((a, b) => a.ordianl - b.ordianl)
        .filter((item) => item.type != 14 && item.type != 15); // 去掉后端返回的职业中类和职业小类-做成子集
      setParentSection(newCommon);
    }
  };

  const queryParentSectionChildren = async (parentId, code, grandParentId) => {
    const res = await getParentSectionChildren({ parentId });
    if (res) {
      const newParentSection = parentSection.map((item) => {
        if (item.type === code) {
          item.list.map((sub) => {
            // grandParentId 当选择添加职业小类时的职业大类id
            if (grandParentId && sub.id === grandParentId) {
              sub.list?.map((xx) => {
                xx.expandable = false;
                xx.isAdd = true;
                xx.isRemove = true;
                if (xx.id === parentId) {
                  xx.list = res?.map((bb) => {
                    bb.isRemove = true;
                    bb.list = res;
                    return bb;
                  });
                }
                return xx;
              });
            } else {
              if (sub.id === parentId) {
                sub.list = res?.map((xx) => {
                  xx.expandable = false;
                  xx.isAdd = true;
                  xx.isRemove = true;
                  return xx;
                });
              }
            }
            return sub;
          });
        }
        return item;
      });
      setParentSection(newParentSection);
    }
  };

  useEffect(() => {
    queryParentSectionAll();
  }, []);

  const handleRemove = (item) => {
    Modal.confirm({
      title: `确定删除【${item.name}】吗？`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const res = await removeParentBasicSection({
          id: item.id,
        });
        if (res) {
          message.success('删除成功');
          queryParentSectionAll();
        }
      },
    });
    console.log(item);
  };

  // 新增
  const handleAdd = (item, bool) => {
    setIsModalVisible(true);
    if (bool) {
      item.type += 1; // 职业种类添加需要添加到下一个type上
    }
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
        parentId: parentInfo.id,
      };
      const res = await createParent(postData);
      if (res) {
        message.success('新增成功');
        queryParentSectionAll();
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
          onExpandedRowsChange: (expandedRows) => {
            setExpandedRowKeys(expandedRows);
            const parentId = expandedRows.slice(-1)[0];
            if (typeof parentId === 'string') {
              // "771434237741989888"
              queryParentSectionChildren(parentId, item.type, item.id);
            }
          },
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
              getAuth()?.canEdit && record.isRemove && (
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
              getAuth()?.canEdit && record.isAdd && (
                <Button
                  onClick={() => handleAdd(record, true)}
                  key="add"
                  type="primary"
                  size="small"
                >
                  新增
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
      title="家长端基本资料栏位设置"
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
export default ParentCard;
