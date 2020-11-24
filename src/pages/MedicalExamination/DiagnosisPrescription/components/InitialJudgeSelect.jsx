// 主诉 / 现病史 选择
import React, { useState, useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  getCheckAll,
  getCheckTree,
  getCheckChildren,
} from '@/pages/Function/ColumnLocation/service';

const InitialJudgeSelect = ({ form, type, name, label, postFields, rules }) => {
  const [checkList1, setCheckList1] = useState([]);
  const [checkList2, setCheckList2] = useState([]);
  const [checkList3, setCheckList3] = useState([]);
  const [checkList4, setCheckList4] = useState([]);

  // 获取下拉信息
  // const queryCheckTree = async () => {
  //   const res = await getCheckTree();
  //   // 5=ICD10 3=现病史
  //   setCheckList1(res.filter((item) => item.type === type));
  // };

  // const onCheckList1Change = (parentId) => {
  //   const children = checkList1.filter((item) => item.id === parentId)[0]?.children;
  //   setCheckList2(children || []);
  //   return children;
  // };
  // const onCheckList2Change = (parentId, list) => {
  //   const children = (list || checkList2).filter((item) => item.id === parentId)[0]?.children;
  //   setCheckList3(children || []);
  //   return children;
  // };
  // const onCheckList3Change = (parentId, list) => {
  //   const children = (list || checkList3).filter((item) => item.id === parentId)[0]?.children;
  //   setCheckList4(children || []);
  //   return children;
  // };

  // 获取下拉信息
  const queryCheckAll = async () => {
    const res = await getCheckAll();
    // 5=ICD10 3=现病史
    setCheckList1(res.filter((item) => item.type === type));
  };

  const onCheckList1Change = async (parentId) => {
    const res = await getCheckChildren({ parentId });
    setCheckList2(res);
  };
  const onCheckList2Change = async (parentId) => {
    const res = await getCheckChildren({ parentId });
    setCheckList3(res);
  };
  const onCheckList3Change = async (parentId) => {
    const res = await getCheckChildren({ parentId });
    setCheckList4(res);
  };

  useEffect(() => {
    form.setFields([
      {
        name,
        value: [
          {
            [postFields[0]]: '',
            [postFields[1]]: '',
            [postFields[2]]: '',
            [postFields[3]]: '',
          },
        ],
      },
    ]);

    queryCheckAll();
    // queryCheckTree();
  }, []);

  // useEffect(() => {
  //   const value = form.getFieldValue(name);
  //   if (value) {
  //     value.map((item) => {
  //       let list2 = [];
  //       let list3 = [];
  //       if (item[postFields[0]]) {
  //         list2 = onCheckList1Change(item[postFields[0]]);
  //       }
  //       if (item[postFields[1]]) {
  //         list3 = onCheckList2Change(item[postFields[1]], list2);
  //       }
  //       if (item[postFields[2]]) {
  //         onCheckList3Change(item[postFields[2]], list3);
  //       }
  //     });
  //   }
  // }, [form.getFieldValue(name)]);

  useEffect(() => {
    const value = form.getFieldValue(name);
    if (value) {
      value.map((item) => {
        if (item[postFields[0]]) {
          onCheckList1Change(item[postFields[0]]);
        }
        if (item[postFields[1]]) {
          onCheckList2Change(item[postFields[1]]);
        }
        if (item[postFields[2]]) {
          onCheckList3Change(item[postFields[2]]);
        }
      });
    }
  }, [form.getFieldValue(name)]);

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, index) => (
            <div
              key={field.key}
              style={{ display: 'flex', alignItems: 'baseline' }}
              align="baseline"
            >
              <Form.Item
                style={{ width: '20%', marginRight: 8, marginBottom: 0 }}
                shouldUpdate={(prevValues, curValues) => prevValues[name] !== curValues[name]}
              >
                {() => (
                  <Form.Item
                    {...field}
                    label={label}
                    name={[field.name, postFields[0]]}
                    rules={rules}
                    fieldKey={[field.fieldKey, postFields[0]]}
                  >
                    <Select onChange={onCheckList1Change} placeholder="请选择">
                      {checkList1.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.content}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Form.Item>

              <Form.Item
                style={{ width: '20%', marginRight: 8, marginBottom: 0 }}
                shouldUpdate={(prevValues, curValues) => prevValues[name] !== curValues[name]}
              >
                {() => (
                  <Form.Item
                    {...field}
                    name={[field.name, postFields[1]]}
                    rules={rules}
                    fieldKey={[field.fieldKey, postFields[1]]}
                  >
                    <Select onChange={onCheckList2Change} placeholder="请选择">
                      {checkList2.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.content}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Form.Item>

              <Form.Item
                style={{ width: '20%', marginRight: 8, marginBottom: 0 }}
                shouldUpdate={(prevValues, curValues) => prevValues[name] !== curValues[name]}
              >
                {() => (
                  <Form.Item
                    {...field}
                    name={[field.name, postFields[2]]}
                    rules={rules}
                    fieldKey={[field.fieldKey, postFields[2]]}
                  >
                    <Select onChange={onCheckList3Change} placeholder="请选择">
                      {checkList3.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.content}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Form.Item>

              <Form.Item
                style={{ width: '20%', marginRight: 8, marginBottom: 0 }}
                shouldUpdate={(prevValues, curValues) => prevValues[name] !== curValues[name]}
              >
                {() => (
                  <Form.Item
                    {...field}
                    name={[field.name, postFields[3]]}
                    rules={rules}
                    fieldKey={[field.fieldKey, postFields[3]]}
                  >
                    <Select placeholder="请选择">
                      {checkList4.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.content}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Form.Item>
              {form.getFieldValue(name).length > 1 && (
                <MinusCircleOutlined className="reduce" onClick={() => remove(field.name)} />
              )}
              {form.getFieldValue(name).length - 1 === index && (
                <PlusCircleOutlined className="add" onClick={() => add()} />
              )}
            </div>
          ))}
        </>
      )}
    </Form.List>
  );
};

export default InitialJudgeSelect;
