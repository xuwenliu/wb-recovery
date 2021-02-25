// 主诉 / 现病史 选择
import React, { useState, useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getCheckAll, getCheckChildren } from '@/pages/Function/ColumnLocation/service';

const InitialJudgeSelect = ({
  form,
  type,
  name,
  label,
  postFields,
  rules,
  timestamp,
  disabled = false,
  limitValueList = [],
}) => {
  const [checkList1, setCheckList1] = useState([]);
  const [checkList2, setCheckList2] = useState([]);
  const [checkList3, setCheckList3] = useState([]);
  const [checkList4, setCheckList4] = useState([]);

  // 获取下拉信息
  const queryCheckAll = async () => {
    const res = await getCheckAll();
    // 5=ICD10 3=现病史
    setCheckList1(res.filter((item) => item.type === type));
  };

  const onCheckList1Change = async (parentId, index) => {
    if (index || index == 0) {
      // 一级切换把后面的设置为空
      let newValue = form.getFieldValue(name);
      newValue[index] = {
        ...newValue[index],
        [postFields[1]]: '',
        [postFields[2]]: '',
        [postFields[3]]: '',
      };
      form.setFields([{ name, value: newValue }]);
      setCheckList2([]);
      setCheckList3([]);
      setCheckList4([]);
    }
    const res = await getCheckChildren({ parentId });
    setCheckList2(res);
  };
  const onCheckList2Change = async (parentId, index) => {
    if (index || index == 0) {
      // 二级切换把后面的设置为空
      let newValue = form.getFieldValue(name);
      newValue[index] = {
        ...newValue[index],
        [postFields[2]]: '',
        [postFields[3]]: '',
      };
      form.setFields([{ name, value: newValue }]);
      setCheckList3([]);
      setCheckList4([]);
    }
    const res = await getCheckChildren({ parentId });
    setCheckList3(res);
  };
  const onCheckList3Change = async (parentId, index) => {
    if (index || index == 0) {
      // 三级切换把后面的设置为空
      let newValue = form.getFieldValue(name);
      newValue[index] = {
        ...newValue[index],
        [postFields[3]]: '',
      };
      form.setFields([{ name, value: newValue }]);
      setCheckList4([]);
    }
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
  }, []);

  useEffect(() => {
    const value = form.getFieldValue(name);
    if (value && value.length != 0) {
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
    } else {
      // 获取的患者没有进行过操作则，默认显示一条数据
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
    }
  }, [form.getFieldValue(name), timestamp]);

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
                style={{ width: '18%', marginRight: 8, marginBottom: 0 }}
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
                    <Select disabled={disabled} onChange={(val) => onCheckList1Change(val, index)}>
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
                style={{ width: '18%', marginRight: 8, marginBottom: 0 }}
                shouldUpdate={(prevValues, curValues) => prevValues[name] !== curValues[name]}
              >
                {() => (
                  <Form.Item
                    {...field}
                    name={[field.name, postFields[1]]}
                    fieldKey={[field.fieldKey, postFields[1]]}
                  >
                    <Select disabled={disabled} onChange={(val) => onCheckList2Change(val, index)}>
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
                style={{ width: '18%', marginRight: 8, marginBottom: 0 }}
                shouldUpdate={(prevValues, curValues) => prevValues[name] !== curValues[name]}
              >
                {() => (
                  <Form.Item
                    {...field}
                    name={[field.name, postFields[2]]}
                    fieldKey={[field.fieldKey, postFields[2]]}
                  >
                    <Select disabled={disabled} onChange={(val) => onCheckList3Change(val, index)}>
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
                style={{ width: '18%', marginRight: 8, marginBottom: 0 }}
                shouldUpdate={(prevValues, curValues) => prevValues[name] !== curValues[name]}
              >
                {() => (
                  <Form.Item
                    {...field}
                    name={[field.name, postFields[3]]}
                    fieldKey={[field.fieldKey, postFields[3]]}
                  >
                    <Select disabled={disabled}>
                      {checkList4.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.content}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Form.Item>

              <Form.Item
                style={{ width: '18%', marginRight: 8, marginBottom: 0 }}
                shouldUpdate={(prevValues, curValues) => prevValues[name] !== curValues[name]}
              >
                {() => (
                  <Form.Item
                    {...field}
                    name={[field.name, postFields[4]]}
                    fieldKey={[field.fieldKey, postFields[4]]}
                  >
                    <Select disabled={disabled}>
                      {limitValueList.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.content}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Form.Item>

              {form.getFieldValue(name).length > 1 && !disabled && (
                <MinusCircleOutlined className="reduce" onClick={() => remove(field.name)} />
              )}
              {form.getFieldValue(name).length - 1 === index && !disabled && (
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
