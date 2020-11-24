import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { uniqueId } from 'lodash/util';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={
          [
            /**
          {
            required: true,
            message: `${title} is required.`,
          },
           */
          ]
        }
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}&nbsp;
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

function EditableTable({ columns = [], value = [], onChange }) {
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleDelete = (key) => {
    onChange([...value].filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    onChange([...value, { key: uniqueId() }]);
  };

  const handleSave = (row) => {
    const newData = [...value];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });

    onChange(newData);
  };

  const newColumns = [
    ...columns,
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) =>
        value.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <DeleteOutlined />
          </Popconfirm>
        ) : null,
    },
  ].map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Button
        icon={<PlusOutlined />}
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        新增
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={value}
        columns={newColumns}
        pagination={{ hideOnSinglePage: true }}
      />
    </div>
  );
}

export default EditableTable;
