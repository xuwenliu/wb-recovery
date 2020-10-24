import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Popover, Row, Select, TimePicker } from 'antd';
import React, { useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { connect } from 'umi';
import TableForm from './components/TableForm';
import './style.less';
const { Option } = Select;
const { RangePicker } = DatePicker;
const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型',
};
const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
];

const BaseInfo = ({ submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState([]);

  const getErrorInfo = (errors) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = (fieldKey) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      const key = err.name[0];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = (values) => {
    setError([]);
    dispatch({
      type: 'patriarchAndBaseInfo/submitAdvancedForm',
      payload: values,
    });
  };

  const onFinishFailed = (errorInfo) => {
    setError(errorInfo.errorFields);
  };
  const FormItemlayout = {
    labelCol: { span: 10 },
  };

  return (
    <Form
      form={form}
      initialValues={{
        members: tableData,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <PageContainer header={{ title: '' }}>
        <Card title="伍子喻     建档日期：2020年4月23日" bordered={false}>
          <Row gutter={16}>
            <Col lg={5} md={6} sm={24}>
              <Form.Item
                {...FormItemlayout}
                label="姓名"
                name="username"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col lg={5} md={6} sm={24}>
              <Form.Item
                {...FormItemlayout}
                label="性别"
                name="sex"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select placeholder="请选择性别">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={5} md={6} sm={24}>
              <Form.Item
                {...FormItemlayout}
                label="民族"
                name="mingzu"
                rules={[{ required: true, message: '请选择名族' }]}
              >
                <Select placeholder="请选择民族">
                  <Option value="汉族">汉族</Option>
                  <Option value="藏族">藏族</Option>
                  <Option value="彝族">彝族</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={5} md={6} sm={24}>
              <Form.Item
                {...FormItemlayout}
                label="出生日期"
                name="date"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col lg={5} md={6} sm={24}>
              <Form.Item
                {...FormItemlayout}
                label="建档日期"
                name="jianDangDate"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={15} md={18} sm={24}>
              <Form.Item
                labelCol={{ span: 3 }}
                label="身份证号码"
                name="date"
                rules={[{ required: true, message: '请输入身份证号码' }]}
              >
                <Input placeholder="请输入身份证号码" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={5} md={6} sm={24}>
              <Form.Item
                {...FormItemlayout}
                label="户籍所在地"
                name="date"
                rules={[{ required: true, message: '请选择户籍所在地' }]}
              >
                <Select placeholder="请选择省">
                  <Option value="四川">四川</Option>
                </Select>
                {/* <Select className="select" placeholder="请选择市">
                  <Option value="成都">成都</Option>
                </Select>
                <Select className="select" placeholder="请选择区">
                  <Option value="高新区">高新区</Option>
                </Select>
                <Input className="address" placeholder="请输入详细地址" /> */}
              </Form.Item>
            </Col>
            <Col lg={5} md={6} sm={24}>
              <Form.Item
                {...FormItemlayout}
                name="date"
                rules={[{ required: true, message: '请选择户籍所在地' }]}
              >
                <Select className="select" placeholder="请选择市">
                  <Option value="成都">成都</Option>
                </Select>
                {/* <Select className="select" placeholder="请选择区">
                  <Option value="高新区">高新区</Option>
                </Select>
                <Input className="address" placeholder="请输入详细地址" /> */}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </PageContainer>
      <FooterToolbar>
        {getErrorInfo(error)}
        <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
          提交
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['patriarchAndBaseInfo/submitAdvancedForm'],
}))(BaseInfo);
