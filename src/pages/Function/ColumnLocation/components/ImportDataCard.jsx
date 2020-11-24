import { Form, Card, Select, Radio, Row, Col, Divider, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  getImportData,
  createImportData,
  updateImportData,
  getImportDataChildren,
} from '@/pages/Function/ColumnLocation/service';
import { getCommonEnums } from '@/services/common';

const formSubItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};
const codeObj = [4, 4, 4, 4, 4]; // 每一个对应的下拉框个数

const ImportDataCard = () => {
  const [loading, setLoading] = useState(true);
  const [parentSection, setParentSection] = useState([]);
  const [name, setName] = useState('');
  const [parentInfo, setParentInfo] = useState();
  const [form] = Form.useForm();

  const queryParentSectionAll = async () => {
    const common = await getCommonEnums({
      enumName: 'ImportDataViewSectionType',
    });
    const res = await getImportData();
    setLoading(false);
    if (common && res) {
      const commonArr = Object.values(common);
      const newCommon = commonArr
        .map((item) => {
          item.list = [];

          res.forEach((sub) => {
            if (item.code === sub.type && sub.level === 1) {
              // 只需要给第一项（level===1）赋值
              item.list.push(sub);
              item.isShow = sub.isShow; // 取子项的isShow属性赋值给最外层
            }
          });
          // item.list [] 一维数组
          let newList = []; // 二维数组
          for (let i = 0; i < codeObj[item.code - 1]; i++) {
            newList.push({
              list: [],
              level: i + 1,
            });
          }
          newList[0] = {
            list: item.list,
            level: 1,
          };
          item.list = newList;
          return item;
        })
        .sort((a, b) => a.ordianl - b.ordianl);
      console.log('newCommon', newCommon);
      setParentSection(newCommon);
    }
  };

  const queryImportDataChildren = async (parentId, nextCode, nextLevel) => {
    const res = await getImportDataChildren({ parentId });
    if (res && res.length > 0) {
      const newParentSection = parentSection.map((item) => {
        if (item.code === nextCode) {
          item.list.map((sub) => {
            // sub = {list: Array(1), level: 1}
            if (sub.level === nextLevel) {
              sub.list = res;
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

  const selectChange = (parentId, item, nextLevel) => {
    if (!parentId) return;
    setParentInfo({
      ...item,
      parentId,
    });

    // const nextLevel = oneItem.level + 1;
    queryImportDataChildren(parentId, item.code, nextLevel);
  };
  const radioChange = async (e, item) => {
    const isShow = e.target.value;
    await updateImportData({
      isShow,
      type: item.code,
    });
    message.success('操作成功');
  };
  const addItem = async (item, oneItem) => {
    if (!name) {
      message.error('请输入需要添加的名称');
      return;
    }
    console.log(item);
    let postData = {
      name,
      parentId: parentInfo?.parentId,
      type: item.code,
    };

    const res = await createImportData(postData);
    if (res) {
      message.success('新增成功');
      setName('');
      if (postData.parentId) {
        // 第一个之后的下拉框添加
        selectChange(postData.parentId, item, oneItem.level);
      } else {
        queryParentSectionAll(); // 第一个下拉框的添加
      }
    }
  };
  return (
    <Card
      loading={loading}
      title="汇入数据显示设置"
      style={{
        marginBottom: 24,
      }}
      bordered={false}
    >
      <Form form={form}>
        {parentSection.map((item, index) => {
          return (
            <Col key={index}>
              <div>
                {index + 1}.{item.codeCn}
              </div>
              <div style={{ margin: '10px 0' }}>
                是否显示:
                <Radio.Group
                  onChange={(e) => radioChange(e, item)}
                  style={{ marginLeft: 8 }}
                  defaultValue={item.isShow}
                >
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </div>

              <Form.Item label="选择内容">
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
                        {sub.name}
                      </Select.Option>
                    ))}
                  </Select>
                ))}
              </Form.Item>
            </Col>
          );
        })}
      </Form>
    </Card>
  );
};
export default ImportDataCard;
