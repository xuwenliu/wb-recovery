// 过敏史选择
import { Form, Input, Select } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const MedicalHistorySelect = ({ form, list, name, label, postFields, disabled = false }) => {
  useEffect(() => {
    form.setFields([
      {
        name,
        value: [
          {
            [postFields[0]]: '',
            [postFields[1]]: '',
          },
        ],
      },
    ]);
  }, []);
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
                style={{ width: '40%', marginRight: 8, marginBottom: 0 }}
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.id !== curValues.id || prevValues.description !== curValues.description
                }
              >
                {() => (
                  <Form.Item
                    {...field}
                    label={label}
                    name={[field.name, postFields[0]]}
                    fieldKey={[field.fieldKey, postFields[0]]}
                  >
                    <Select disabled={disabled} placeholder="请选择">
                      {list.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Form.Item>
              <Form.Item
                {...field}
                style={{ width: '50%', marginRight: 8, marginBottom: 0 }}
                name={[field.name, postFields[1]]}
                fieldKey={[field.fieldKey, postFields[1]]}
              >
                <Input disabled={disabled} placeholder="请输入详细信息" />
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

export default MedicalHistorySelect;
