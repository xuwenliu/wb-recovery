import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Select, Input, Form, Button, List, Card, Modal, Radio, DatePicker } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, TableDropdown, ActionType } from '@ant-design/pro-table';
import { LightFilter, ProFormDatePicker } from '@ant-design/pro-form';
import moment from 'moment';
import { history, connect } from 'umi';
const layout = {
  labelCol: {
    span: 4,
  },
};
const CourseScheduling = ({ submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([
    {
      name: '小刘',
      class: 23,
    },
  ]);
  const actionRef = useRef();
  const [query, setQuery] = useState({
    tab: 1,
    date: moment().valueOf(),
    keyword: '',
    selectId: null,
  });
  const [visible, setVisible] = useState(false);

  const onLoadMore = () => {};

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          marginBottom: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button size="small" onClick={onLoadMore}>
          查看更多
        </Button>
      </div>
    ) : null;

  const optionsWithTab = [
    { label: '概览界面', value: 1 },
    { label: '评估师界面', value: 2 },
    { label: '患者界面', value: 3 },
    { label: '教室界面', value: 4 },
  ];
  const onOptionsWithTabChange = (e) => {
    const tab = e.target.value;
    setQuery({
      ...query,
      tab,
    });
  };

  const queryList = () => {
    console.log(query);
  };

  useEffect(() => {
    setInitLoading(false);
  }, []);

  const columns = [
    {
      title: '',
      dataIndex: 'title',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
  ];

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    await form.validateFields();
    let values = form.getFieldsValue();
    dispatch({
      type: 'educationalAndCourseScheduling/create',
      payload: values,
      callback: (res) => {
        if (res) {
          message.success('操作成功');
          handleCancel();
        }
      },
    });
  };

  return (
    <PageContainer
      extra={[
        <Button key="1" type="primary" onClick={() => setVisible(true)}>
          新增排课
        </Button>,
      ]}
    >
      <Card>
        <Row>
          <Col style={{ textAlign: 'center' }} span={4}>
            <div>
              <Button style={{ width: 120 }}>患者管理</Button>
            </div>
            <div style={{ margin: '20px 0' }}>
              <Button style={{ width: 120 }}>治疗师管理</Button>
            </div>
            <div>
              <Button style={{ width: 120 }}>上课统计</Button>
            </div>

            <List
              style={{ marginTop: 30, background: '#F2F3F7' }}
              bordered
              header="本月上课量排行榜"
              itemLayout="horizontal"
              loadMore={loadMore}
              dataSource={list}
              renderItem={(item) => (
                <List.Item>
                  <span>{item.name}</span>
                  <span>{item.class}节</span>
                </List.Item>
              )}
            />
          </Col>
          <Col span={20}>
            <Row>
              <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <Radio.Group
                  style={{ marginLeft: '10%' }}
                  options={optionsWithTab}
                  onChange={onOptionsWithTabChange}
                  value={query.tab}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Col>
            </Row>
            <ProTable
              columns={columns}
              actionRef={actionRef}
              params={query} // query中只要有一项变化就会执行queryList
              request={queryList}
              rowKey="id"
              search={false}
              pagination={false}
              toolbar={{
                search: {
                  allowClear: true,
                  placeholder: '请输入治疗师/患者姓名',
                  style: { width: '250px' },
                  onSearch: (keyword) => {
                    setQuery({
                      ...query,
                      keyword,
                    });
                  },
                },
                filter: (
                  <LightFilter
                    initialValues={{
                      date: moment(),
                    }}
                    onFinish={({ date }) => {
                      setQuery({
                        ...query,
                        date: moment(date).valueOf(),
                      });
                    }}
                  >
                    <ProFormDatePicker name="date" />
                  </LightFilter>
                ),
                menu: {
                  type: 'dropdown',
                  items: [
                    {
                      label: '运动',
                      key: '1',
                    },
                    {
                      label: '治疗',
                      key: '2',
                    },
                  ],
                  onChange: (id) => {
                    setQuery({
                      ...query,
                      selectId: id,
                    });
                  },
                },
              }}
            />
          </Col>
        </Row>
        <Modal
          title="排课"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={submitting}
        >
          <Form hideRequiredMark form={form} {...layout}>
            <Form.Item
              label="角色"
              name="roleId"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select>
                {[].map((item) => (
                  <Select.Option value={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="老师"
              name="teacherId"
              rules={[{ required: true, message: '请选择老师' }]}
            >
              <Select>
                {[].map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="患者"
              name="teacherId"
              rules={[{ required: true, message: '请选择患者' }]}
            >
              <Select>
                {[].map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="课程"
              name="classId"
              rules={[{ required: true, message: '请选择课程' }]}
            >
              <Select>
                {[].map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="课程内容"
              name="content"
              rules={[{ required: true, message: '请输入课程内容' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              label="日期"
              name="content"
              rules={[{ required: true, message: '请输入课程内容' }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item label="时间段" name="time">
              <Select>
                <Select.Option value={1}>7am~6pm</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="教室位置"
              name="classRoom"
              rules={[{ required: true, message: '请选择教室位置' }]}
            >
              <Select>
                {[].map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      <FooterToolbar>
        <Button type="primary" onClick={() => history.push('/archives/childrehabilitation')}>
          进入康复计划
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['educationalAndCourseScheduling/create'],
}))(CourseScheduling);
