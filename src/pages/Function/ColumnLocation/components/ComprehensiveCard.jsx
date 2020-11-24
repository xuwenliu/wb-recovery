import { Form, Card, Select, Row, Col, Divider, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  getComprehensiveAllSection,
  createComprehensive,
} from '@/pages/Function/ColumnLocation/service';
import { getCommonEnums } from '@/services/common';

const formItemLayout = {
  labelCol: { span: 14 },
  wrapperCol: { span: 10 },
};

const ComprehensiveCard = () => {
  const [loading, setLoading] = useState(true);
  const [parentSection, setParentSection] = useState([]);
  const [name, setName] = useState('');
  const [form] = Form.useForm();

  const queryComprehensiveSectionAll = async () => {
    const common = await getCommonEnums({
      enumName: 'AssessSectionType',
    });
    const res = await getComprehensiveAllSection();
    setLoading(false);
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
        console.log('newCommon',newCommon)
      setParentSection(newCommon);
    }
  };

  useEffect(() => {
    queryComprehensiveSectionAll();
  }, []);

  const addItem = async (item) => {
    if (!name) {
      message.error('请输入需要添加的名称');
      return;
    }
    let postData = {
      name,
      type: item.code,
    };

    const res = await createComprehensive(postData);
    if (res) {
      message.success('新增成功');
      setName('');
      queryComprehensiveSectionAll();
    }
    console.log(res);
  };
  return (
    <Card
      loading={loading}
      title="综合评估、教案及档案管理栏位设置"
      style={{
        marginBottom: 24,
      }}
      bordered={false}
    >
      <Form
        form={form}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {parentSection.map((item, index) => {
          return (
            <Col key={index} span={12}>
              <Form.Item {...formItemLayout} label={item.codeCn}>
                <Select
                  allowClear
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
export default ComprehensiveCard;
