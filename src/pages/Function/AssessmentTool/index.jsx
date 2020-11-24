import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'antd';
import ProList from '@ant-design/pro-list';
import './index.less';

const dataSource = [
  {
    title: '语雀的天空',
  },
  {
    title: 'Ant Design',
  },
  {
    title: '蚂蚁金服体验科技',
  },
  {
    title: 'TechUI',
  },
];

const AssessmentTool = () => {
  const [loading, setLoading] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleUpdate = () => {};
  const handleRemove = () => {};

  return (
    <PageContainer header={{ title: '' }}>
      <Row>
        <Col span={10}>
          <ProList
            rowKey="title"
            headerTitle="评定工具分类"
            toolBarRender={() => [
              <Button size="small" key="3" type="primary">
                新增
              </Button>,
            ]}
            expandable={{
              expandedRowKeys,
              onExpandedRowsChange: setExpandedRowKeys,
            }}
            dataSource={dataSource}
            metas={{
              title: {},
              subTitle: {},
              description: {
                render: () => (
                  <ProList
                    rowKey="subTitle"
                    dataSource={dataSource}
                    metas={{
                      title: {},
                      subTitle: {},
                      actions: {
                        render: () => [<a>编辑</a>, <a>删除</a>, <a>查看</a>],
                      },
                    }}
                  />
                ),
              },

              actions: {
                render: () => [<a>编辑</a>, <a>删除</a>],
              },
            }}
          />
        </Col>
        <Col offset={1} span={12}>
          <ProList
            rowKey="title"
            headerTitle="评定工具"
            dataSource={dataSource}
            metas={{
              title: {},
              subTitle: {},
              actions: {
                render: () => [<a>编辑</a>, <a>删除</a>],
              },
            }}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AssessmentTool;
