import { Form, Card, Button, Modal, Input, message, Radio, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import ProList from '@ant-design/pro-list';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
  getCheckAll,
  createCheck,
  getCheckChildren,
  removeMedicalCheckSection,
  getAllImportSection,
  updateImportData,
} from '@/pages/Function/ColumnLocation/service';

import { getCommonEnums } from '@/services/common';
import { getAuth } from '@/utils/utils';

const MedicineCheckCard = () => {
  const [loading, setLoading] = useState(true);
  const [parentSection, setParentSection] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [parentInfo, setParentInfo] = useState();
  const [form] = Form.useForm();

  const queryCheckAll = async () => {
    const showData = await getAllImportSection();
    const common = await getCommonEnums({
      enumName: 'MedicineCheckSectionType',
    });
    const res = await getCheckAll();
    setLoading(false);
    if (common && res) {
      const commonArr = Object.values(common);
      const newCommon = commonArr
        .map((item) => {
          let lists = [];
          item.type = item.code;
          item.name = item.codeCn;
          item.expandable = true;
          item.isAdd = true;
          item.isRemove = false;
          showData.forEach((sub) => {
            if (item.type === sub.type) {
              item.isShow = sub.isShow;
            }
          });
          res.forEach((sub) => {
            sub.expandable = sub.type != 8; // 门诊复查-不需要展开
            sub.isAdd = sub.type != 8; // 门诊复查-不需要新增
            sub.isRemove = true;
            if (item.type === sub.type) {
              lists.push(sub);
            }
          });
          item.list = lists.filter((item) => item.level === 1);
          return item;
        })
        .sort((a, b) => a.ordianl - b.ordianl);
      console.log('MedicineCheckCard', newCommon);
      setParentSection(newCommon);
    }
  };

  useEffect(() => {
    queryCheckAll();
  }, []);

  const getList = (arr, id, setValue, code) => {
    console.log(arr, id, setValue, code);

    return arr?.map((item) => {
      if (item.type === code) {
        if (item.id) {
          if (item.id === id) {
            item.list = setValue.map((sub) => {
              if (sub.type === 1 || sub.type === 4) {
                // 体温和个人史 只有2级
                sub.isRemove = true;
              } else if (sub.type === 2 || sub.type === 3) {
                // 主诉和现病史 只有3级
                console.log('sub', sub);
                sub.isAdd = sub.level != 3;
                sub.expandable = sub.level != 3;
                sub.isRemove = true;
              } else {
                sub.isAdd = item.level < 3;
                sub.expandable = item.level < 3;
                sub.isRemove = true;
              }

              return sub;
            });
          } else {
            item.list = getList(item.list, id, setValue, code);
          }
          return item;
        } else {
          item.list = getList(item.list, id, setValue, code);
        }
        return item;
      } else {
        item.list = getList(item.list, id, setValue, code);
      }
      return item;
    });
  };

  const queryCheckChildren = async (parentId, code) => {
    const res = await getCheckChildren({ parentId });
    if (res) {
      const newParentSection = getList(parentSection, parentId, res, code);
      setParentSection(newParentSection);
    }
  };

  const radioChange = async (e, item) => {
    const isShow = e.target.value;
    await updateImportData({
      isShow,
      type: item.code,
    });
    message.success('操作成功');
  };

  const handleRemove = (item) => {
    Modal.confirm({
      title: `确定删除【${item.content}】吗？`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const res = await removeMedicalCheckSection({
          id: item.id,
        });
        if (res) {
          message.success('删除成功');
          queryCheckAll();
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
        content: getValues.name,
        type: parentInfo.type,
        parentId: parentInfo.id,
      };
      const res = await createCheck(postData);
      if (res) {
        message.success('新增成功');
        queryCheckAll();
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
            console.log('expandedRows', expandedRows);
            const parentId = expandedRows.slice(-1)[0];
            if (typeof parentId === 'string') {
              // "771434237741989888"
              queryCheckChildren(parentId, item.type, item.id);
            }
          },
        }}
        dataSource={item.list}
        metas={{
          title: {
            dataIndex: 'content',
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
                <Button onClick={() => handleAdd(record)} key="add" type="primary" size="small">
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
      title="医学检查栏位设置"
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
          subTitle: {
            render: (_, record) => {
              return (
                [5, 6, 7].includes(record.type) && (
                  <Space size={0}>
                    <Radio.Group
                      disabled={!getAuth()?.canEdit}
                      onChange={(e) => radioChange(e, record)}
                      style={{ marginLeft: 8 }}
                      defaultValue={record.isShow}
                    >
                      <Radio value={true}>显示</Radio>
                      <Radio value={false}>不显示</Radio>
                    </Radio.Group>
                  </Space>
                )
              );
            },
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
      {/* <Form form={form}>
        {parentSection.map((item, idx) => {
          return (
            <Form.Item key={idx} {...formItemLayout} label={item.codeCn}>
              {item.list.map((oneItem, oneIndex) => (
                <Select
                  allowClear
                  style={{ width: '20%' }}
                  className="mr8"
                  key={oneIndex}
                  onChange={(e) => selectChange(e, item, oneItem.level + 1)}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                        <Input
                          style={{ flex: 'auto' }}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <a
                          style={{
                            flex: 'none',
                            padding: '8px',
                            display: 'block',
                            cursor: 'pointer',
                          }}
                          onClick={() => addItem(item, oneItem)}
                        >
                          新增
                        </a>
                      </div>
                    </div>
                  )}
                >
                  {oneItem.list.map((sub) => (
                    <Select.Option key={sub.id} value={sub.id}>
                      {sub.content}
                    </Select.Option>
                  ))}
                </Select>
              ))}
            </Form.Item>
          );
        })}
      </Form> */}
    </Card>
  );
};
export default MedicineCheckCard;
