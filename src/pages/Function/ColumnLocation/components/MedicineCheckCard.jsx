import { Form, Card, Select, Row, Col, Divider, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { getCheckAll, createCheck, getCheckChildren } from '../service';
import { getCommonEnums } from '../../../../services/common';

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

const codeObj = [2, 3, 3, 2, 4, 4, 4, 1]; // 每一个对应的下拉框个数

const MedicineCheckCard = () => {
  const [parentSection, setParentSection] = useState([]);
  const [name, setName] = useState('');
  const [parentInfo, setParentInfo] = useState();
  const [form] = Form.useForm();

  const queryCheckAll = async () => {
    const common = await getCommonEnums({
      enumName: 'MedicineCheckSectionType',
    });
    const res = await getCheckAll();
    if (common && res) {
      const commonArr = Object.values(common);
      const newCommon = commonArr
        .map((item) => {
          item.list = [];
          res.forEach((sub) => {
            if (item.code === sub.type) {
              item.list.push(sub);
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

  useEffect(() => {
    queryCheckAll();
  }, []);

  const queryCheckChildren = async (parentId, code, nextLevel) => {
    const res = await getCheckChildren({ parentId });
    if (res) {
      const newParentSection = parentSection.map((item) => {
        if (item.code === code) {
          item.list.map((sub) => {
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

  const selectChange = (parentId, item, oneItem) => {
    if (item.code === 8) return; // 门诊复查 没有下级 则不请求接口了

    if (!parentId) return;
    setParentInfo({
      ...item,
      parentId,
    });

    const nextLevel = oneItem.level + 1;
    queryCheckChildren(parentId, item.code, nextLevel);
  };

  const addItem = async (item) => {
    if (!name) {
      message.error('请输入需要添加的名称');
      return;
    }
    let postData = {
      content: name,
      parentId: parentInfo?.parentId,
      type: item.code,
    };

    const res = await createCheck(postData);
    if (res) {
      message.success('新增成功');
      setName('');
      setParentInfo(null);
      queryCheckAll();
    }
  };
  return (
    <Card
      title="医学检查栏位设置"
      style={{
        marginBottom: 24,
      }}
      bordered={false}
    >
      <Form form={form}>
        {parentSection.map((item, idx) => {
          return (
            <Form.Item key={idx} {...formItemLayout} label={item.codeCn} name={item.codeEn}>
              {item.list.map((oneItem, oneIndex) => (
                <Select
                  allowClear
                  style={{ width: '20%' }}
                  className="mr8"
                  key={oneIndex}
                  onChange={(e) => selectChange(e, item, oneItem)}
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
                          onClick={() => addItem(item)}
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
      </Form>
    </Card>
  );
};
export default MedicineCheckCard;
