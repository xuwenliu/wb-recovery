import { Form, Card, Select, Radio, Row, Col, Divider, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { getImportData, createImportData, getImportDataChildren } from '../service';
import { getCommonEnums } from '../../../../services/common';

const formSubItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 10 },
};

const ImportDataCard = () => {
  const [parentSection, setParentSection] = useState([]);
  const [name, setName] = useState('');
  const [parentInfo, setParentInfo] = useState();
  const [form] = Form.useForm();

  const queryParentSectionAll = async () => {
    const common = await getCommonEnums({
      enumName: 'ImportDataViewSectionType',
    });
    const res = await getImportData();
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
          return item;
        })
        .sort((a, b) => a.ordianl - b.ordianl);
      setParentSection(newCommon);
    }
  };

  const queryParentSectionChildren = async (parentId, nextCode) => {
    const res = await getImportDataChildren({ parentId });
    if (res) {
      const newParentSection = parentSection.map((item) => {
        if (item.code === nextCode) {
          item.list = res;
        }
        return item;
      });
      setParentSection(newParentSection);
    }
  };

  useEffect(() => {
    queryParentSectionAll();
  }, []);

  const selectChange = (parentId, item) => {
    if (!parentId) return;
    const nextCode = item.code + 1;
    setParentInfo({
      ...item,
      parentId,
    });
    // 如果选择了职业种类-大类，请求职业种类-中类
    if (item.code === 13) {
      form.setFields([
        {
          name: 'PROFESSION_MEDIUM',
          value: '',
        },
        {
          name: 'PROFESSION_SMALL',
          value: '',
        },
      ]);
      const newParentSection = parentSection.map((sub) => {
        // 切换大类的时候把中类和小类下拉框数据置空
        if (sub.code === nextCode || sub.code === nextCode + 1) {
          sub.list = [];
        }
        return sub;
      });
      setParentSection(newParentSection);

      queryParentSectionChildren(parentId, nextCode);
    }
    // 如果选择了职业种类-中类，请求职业种类-小类
    if (item.code === 14) {
      form.setFields([
        {
          name: 'PROFESSION_SMALL',
          value: '',
        },
      ]);
      const newParentSection = parentSection.map((sub) => {
        // 切换中类的时候把小类下拉框数据置空
        if (sub.code === nextCode) {
          sub.list = [];
        }
        return sub;
      });
      setParentSection(newParentSection);
      queryParentSectionChildren(parentId, nextCode);
    }
  };
  const addItem = async (item) => {
    if (!name) {
      message.error('请输入需要添加的名称');
      return;
    }
    let postData = {
      name,
      type: item.code,
    };

    if (item.code === 14) {
      // 职业种类-中类
      if (!parentInfo || parentInfo.code !== 13) {
        message.error('请先选择职业种类-大类');
        return;
      }
      postData = {
        name,
        parentId: parentInfo.parentId,
        type: item.code,
      };
    }

    if (item.code === 15) {
      // 职业种类-小类
      if (!parentInfo || parentInfo.code !== 14) {
        message.error('请先选择职业种类-中类');
        return;
      }
      postData = {
        name,
        parentId: parentInfo.parentId,
        type: item.code,
      };
    }

    const res = await createImportData(postData);
    if (res) {
      message.success('新增成功');
      setName('');
      setParentInfo('');
      queryParentSectionAll();
    }
    console.log(res);
  };
  return (
    <Card
      title="汇入数据显示设置"
      style={{
        marginBottom: 24,
      }}
      bordered={false}
    >
      <Form form={form}>
        {parentSection.map((item) => {
          return (
            <Col key={item.ordianl}>
              <p style={{ paddingLeft: 25 }}>{item.codeCn}</p>
              <Form.Item {...formSubItemLayout} label="是否显示" name="isShow">
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item {...formSubItemLayout} label="选择内容" name={item.codeEn}>
                <Select
                  allowClear
                  onChange={(e) => selectChange(e, item)}
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
                  {item.list.map((sub) => (
                    <Select.Option key={sub.id} value={sub.id}>
                      {sub.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          );
        })}
      </Form>
    </Card>
  );
};
export default ImportDataCard;
