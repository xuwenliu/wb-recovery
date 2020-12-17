import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Modal, Form, Input, Select, message } from 'antd';
import { connect } from 'umi';
import ProList from '@ant-design/pro-list';
import { getComprehensiveAllSection } from '@/pages/Function/ColumnLocation/service';
import { getAllPackage } from './service';
import { getAllClass } from '@/pages/Educational/Curriculum/service';
import { getAuth } from '@/utils/utils';
const { confirm } = Modal;
const layout = {
  labelCol: {
    span: 4,
  },
};
let FirstClassList = []; //所有课程列表
const RehabilitationPlan = ({
  dispatch,
  createSavePackageSubmitting,
  createUpdatePackageClassSubmitting,
}) => {
  const auth = getAuth();
  const [form] = Form.useForm();
  const [formClass] = Form.useForm();

  const [groupData, setGroupData] = useState([]);
  const [updatePackageId, setUpdatePackageId] = useState();
  const [updateClassId, setUpdateClassId] = useState();

  const [classInfo, setClassInfo] = useState([]);
  const [isShowClass, setIsShowClass] = useState(false);

  const [visible, setVisible] = useState(false);
  const [classVisible, setClassVisible] = useState(false);
  const [classList, setClassList] = useState([]);
  const [cycleTypeList, setCycleTypeList] = useState([]);
  const [classTimeList, setClassTimeList] = useState([]);

  const [cycleTypeId, setCycleTypeId] = useState();
  const [classTimeId, setClassTimeId] = useState();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      selectedRows = selectedRows.map((item) => {
        if (!item.cycleTypeId) {
          item = {
            ...item,
            cycle: 2,
            onceClassTime: 30,
            cycleTypeId,
            classTimeId,
          };
        }
        return item;
      });

      let postData = {
        classPackageBos: selectedRows,
        packageId: classInfo.id,
      };
      dispatch({
        type: 'functionAndRehabilitationPlan/createUpdatePackageClass',
        payload: postData,
        callback: async (res) => {
          if (res) {
            const newGroupData = await queryAllPackage();
            handleView(newGroupData.filter((item) => item.id === classInfo.id)[0]);
          }
        },
      });
    },
  };

  const queryComprehensiveSectionAll = async () => {
    const res = await getComprehensiveAllSection();
    const data1 = res.filter((item) => item.type === 12); // 课程频次
    const data2 = res.filter((item) => item.type === 13); // 课程时间
    setCycleTypeList(data1);
    setClassTimeList(data2);
    setCycleTypeId(data1[0].id);
    setClassTimeId(data2[0].id);
  };

  const queryAllPackage = async () => {
    const res = await getAllPackage();
    setGroupData(res);
    return res;
  };

  const queryAllClass = async () => {
    const res = await getAllClass();
    FirstClassList = res;
    // setClassList(res);
  };

  useEffect(() => {
    queryAllPackage();
    queryAllClass();
    queryComprehensiveSectionAll();
  }, []);

  const handleUpdate = (item) => {
    setUpdatePackageId(item.id);
    form.setFields([
      {
        name: 'name',
        value: item.name,
      },
    ]);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setUpdatePackageId(null);
    form.resetFields();
  };

  const handleOk = async () => {
    await form.validateFields();
    let values = form.getFieldsValue();
    if (updatePackageId) {
      values = { ...values, packageId: updatePackageId };
    }
    dispatch({
      type: 'functionAndRehabilitationPlan/createSavePackage',
      payload: values,
      callback: (res) => {
        if (res) {
          message.success('操作成功');
          handleCancel();
          queryAllPackage();
        }
      },
    });
  };

  const handleRemove = (item) => {
    confirm({
      title: '确定删除该套餐?',
      onOk() {
        dispatch({
          type: 'functionAndRehabilitationPlan/removeSavePackage',
          payload: { packageId: item.id },
          callback: (res) => {
            if (res) {
              message.success('删除成功');
              queryAllPackage();
            }
          },
        });
      },
    });
  };
  const handleView = (row) => {
    let classIds = [];
    if (row.classOfPackageVos && row.classOfPackageVos.length != 0) {
      row.classPackageBos = FirstClassList.map((sub) => {
        sub.classId = sub.id;
        row.classOfPackageVos?.forEach((sItem) => {
          if (sub.id === sItem.classId) {
            classIds.push(sItem.classId);
            sub = {
              ...sub,
              ...sItem,
              classId: sItem.classId,
            };
          }
        });
        return sub;
      });
    } else {
      row.classPackageBos = FirstClassList.map((item) => {
        item.classId = item.id;
        return item;
      });
    }
    setClassInfo(row);
    setClassList(row.classPackageBos);
    setSelectedRowKeys(classIds);
    setIsShowClass(true);
  };

  // 编辑频率次数
  const handleClassUpdate = (item) => {
    setUpdateClassId(item.classId);
    formClass.setFieldsValue(item);
    setClassVisible(true);
    item.cycleTypeId && setCycleTypeId(item.cycleTypeId);
    item.classTimeId && setClassTimeId(item.classTimeId);
  };

  const handleClassCancel = () => {
    setClassVisible(false);
    formClass.resetFields();
  };

  const handleClassOk = async () => {
    await formClass.validateFields();
    const values = formClass.getFieldsValue();

    let obj = {
      ...values,
      cycleTypeId,
      classTimeId,
    };
    const selectRows = classList.filter((item) => selectedRowKeys.includes(item.classId));
    const classPackageBos = selectRows.map((item) => {
      if (item.classId === updateClassId) {
        item = {
          ...item,
          ...obj,
        };
      }
      return item;
    });

    let postData = {
      classPackageBos,
      packageId: classInfo.id,
    };

    // 提交
    dispatch({
      type: 'functionAndRehabilitationPlan/createUpdatePackageClass',
      payload: postData,
      callback: async (res) => {
        if (res) {
          message.success('操作成功');
          handleClassCancel();
          const newGroupData = await queryAllPackage();
          handleView(newGroupData.filter((item) => item.id === classInfo.id)[0]);
        }
      },
    });
  };

  return (
    <PageContainer header={{ title: '' }}>
      <Row>
        <Col span={10}>
          <ProList
            rowKey="id"
            headerTitle="套餐名称"
            toolBarRender={() => [
              auth?.canEdit && (
                <Button onClick={() => setVisible(true)} size="small" key="1" type="primary">
                  新增
                </Button>
              ),
            ]}
            dataSource={groupData}
            metas={{
              title: {
                dataIndex: 'name',
              },
              subTitle: {},
              actions: {
                render: (_, record) => [
                  auth?.canEdit && (
                    <a key="1" onClick={() => handleUpdate(record)}>
                      编辑
                    </a>
                  ),
                  auth?.canEdit && (
                    <a key="2" onClick={() => handleRemove(record)}>
                      删除
                    </a>
                  ),
                  <a key="3" onClick={() => handleView(record)}>
                    查看课程
                  </a>,
                ],
              },
            }}
          />
        </Col>
        <Col offset={1} span={12}>
          {isShowClass && (
            <ProList
              rowKey="classId"
              headerTitle={classInfo.name + '-指定课程'}
              dataSource={classList}
              rowSelection={rowSelection}
              metas={{
                title: {
                  render: (_, record) => {
                    const one = record.cycleTypeName
                      ? `1${record.cycleTypeName}${record.cycle}次`
                      : '';
                    const two = record.onceClassTime
                      ? `${record.onceClassTime}${record.classTimeName}/次`
                      : '';
                    return `${record.name} ${one} ${two}`;
                  },
                },
                subTitle: {},
                actions: {
                  render: (_, record) => [
                    auth?.canEdit && selectedRowKeys.includes(record.classId) && (
                      <a key="1" onClick={() => handleClassUpdate(record)}>
                        编辑频次时间
                      </a>
                    ),
                  ],
                },
              }}
            />
          )}
        </Col>
      </Row>

      <Modal
        title="套餐"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createSavePackageSubmitting}
      >
        <Form form={form}>
          <Form.Item
            label="套餐名称"
            name="name"
            rules={[{ required: true, message: '请输入套餐名称' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑频次时间"
        visible={classVisible}
        onOk={handleClassOk}
        onCancel={handleClassCancel}
        confirmLoading={createUpdatePackageClassSubmitting}
      >
        <Form hideRequiredMark form={formClass} {...layout}>
          {/* <Form.Item
            label="选择课程"
            name="classId"
            rules={[{ required: true, message: '请选择课程' }]}
          >
            <Select disabled>
              {classList.map((item) => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item> */}
          <Form.Item label="课程频次" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex' }}>
              <Form.Item>
                <Input
                  value={1}
                  disabled
                  addonAfter={
                    <Select
                      onChange={(value) => {
                        setCycleTypeId(value);
                      }}
                      value={cycleTypeId}
                    >
                      {cycleTypeList.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  }
                />
              </Form.Item>
              <Form.Item
                name="cycle"
                rules={[
                  { required: true, message: '请输入' },
                  {
                    pattern: /^[0-9]*$/,
                    message: '请输入数字',
                  },
                ]}
              >
                <Input addonAfter="次" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label="课程时间"
            name="onceClassTime"
            rules={[
              { required: true, message: '请输入课程时间' },
              {
                pattern: /^[0-9]*$/,
                message: '请输入数字',
              },
            ]}
          >
            <Input
              addonAfter={
                <Select
                  value={classTimeId}
                  onChange={(value) => {
                    setClassTimeId(value);
                  }}
                >
                  {classTimeList.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  createSavePackageSubmitting: loading.effects['functionAndRehabilitationPlan/createSavePackage'],
  createUpdatePackageClassSubmitting:
    loading.effects['functionAndRehabilitationPlan/createUpdatePackageClass'],
}))(RehabilitationPlan);
