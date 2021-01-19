import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'dva';
import LTT from 'list-to-tree';

import { PageContainer } from '@ant-design/pro-layout';
import { Form, Input, Button, Select, Row, Col, Card, Tree, Tabs, Modal } from 'antd';
import { FormOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

const Context = React.createContext({});

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const getNodePath = (node) => {
  if (node.parent) {
    return `${node.parent.name}.${node.name}`;
  }
  return `${node.name}`;
};

const TypeForm = ({ treeData, values = {}, submit }) => {
  const [form] = Form.useForm();
  const { types } = useContext(Context);

  const TypeTree = ({ value, onChange }) => {
    const [visible, setVisible] = useState(false);
    const [parent, setParent] = useState();

    return (
      <>
        <Button
          icon={value && <FormOutlined />}
          onClick={() => {
            setVisible(true);
          }}
        >
          {value && value.name}
        </Button>
        <Modal
          visible={visible}
          onOk={() => {
            setVisible(false);
            onChange(parent);
          }}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <Tree
            treeData={treeData}
            onSelect={(selectedKeys) => {
              const [id] = selectedKeys;
              setParent({ ...types.find((i) => i.id === id) });
            }}
          />
        </Modal>
      </>
    );
  };

  React.useEffect(() => {
    form.setFieldsValue(values);
  }, [values]);

  return (
    <Form form={form} {...layout} onFinish={submit}>
      <Form.Item label="父分类" name="parent">
        <TypeTree />
      </Form.Item>
      <Form.Item
        label="名称"
        name="name"
        rules={[
          {
            required: true,
            message: '请输入名称',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          储存
        </Button>
      </Form.Item>
    </Form>
  );
};

const ScaleSelect = ({ type, scales = [], submit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    const selected = scales
      .filter((scale) => {
        const scaleTypes = scale.type.split(':'); // 支援多個分類
        const index = scaleTypes.findIndex((i) => i === getNodePath(type));
        if (index !== -1) {
          return true;
        }
        return false;
      })
      .map((i) => {
        return i.id;
      });
    form.setFieldsValue({ scales: selected });
  }, [type.id]);

  return (
    <Form form={form} {...layout} initialValues={{}} onFinish={submit}>
      <Form.Item label="量表" name="scales">
        <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="请选择量表">
          {scales.map((scale) => (
            <Option value={scale.id} key={scale.id}>
              {scale.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          储存
        </Button>
      </Form.Item>
    </Form>
  );
};

function Page(props) {
  const {
    scaleType: { types, scales = [] },
    dispatch,
  } = props;

  const [type, setType] = useState();

  const getTreeData = () => {
    if (types) {
      const value = types.map((item) => ({
        key: item.id,
        parentid: item.parentId ? item.parentId : 0,
        title: item.name,
      }));

      const ltt = new LTT(value, {
        key_id: 'key',
        key_name: 'title',
        key_parent: 'parentid',
        key_child: 'children',
      });
      return ltt.GetTree();
    }
    return [];
  };

  const fetch = () => {
    dispatch({
      type: 'scaleType/fetch',
      payload: {},
    });
  };

  const fetchScale = () => {
    dispatch({
      type: 'scaleType/fetchScale',
      payload: {},
    });
  };

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleType/clear',
        payload: {},
      });
    };
  }, []);

  const treeData = getTreeData();

  /**
   * 每次 type 變化的時候.重新查詢量表
   */
  useEffect(() => {
    if (type) {
      fetchScale(type.name);
    }
  }, [type]);

  return (
    <PageContainer header={{ title: '' }}>
      <Context.Provider value={{ types }}>
        <Row>
          <Col span={10}>
            <Card title="量表分类" bordered={false}>
              <Tree
                treeData={treeData}
                onSelect={(selectedKeys) => {
                  const [id] = selectedKeys;
                  const node = types.find((i) => i.id === id);
                  if (node.parentId) {
                    setType({
                      ...node,
                      parent: { ...types.find((i) => i.id === node.parentId) },
                    });
                  } else {
                    setType({ ...node, parent: undefined });
                  }
                }}
              />
            </Card>
          </Col>
          <Col offset={1} span={13}>
            {type && (
              <Card title={type.name} bordered={false}>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="编辑" key="1">
                    <TypeForm
                      treeData={treeData}
                      values={type}
                      submit={(values) => {
                        console.log('update ', values);
                      }}
                    />
                  </TabPane>
                  <TabPane tab="指定量表" key="2">
                    <ScaleSelect
                      type={type}
                      scales={scales}
                      submit={(values) => {
                        console.log('set scale:', values);
                      }}
                    />
                  </TabPane>
                  <TabPane tab="新增子分类" key="3">
                    <TypeForm
                      treeData={treeData}
                      values={{ parent: type }}
                      submit={(values) => {
                        console.log('create ', values);
                      }}
                    />
                  </TabPane>
                </Tabs>
              </Card>
            )}
          </Col>
        </Row>
      </Context.Provider>
    </PageContainer>
  );
}

export default connect(({ scaleType, loading }) => ({
  scaleType,
  loading: loading.models.scaleType,
}))(Page);
