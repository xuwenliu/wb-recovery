import { CloseCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Popover,
  Row,
  Select,
  Image,
  Checkbox,
  Radio,
} from 'antd';
import React, { useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { connect } from 'umi';
import TableForm from './components/TableForm';
import './style.less';
import Avatar from 'antd/lib/avatar/avatar';
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
  const FormMoreItemlayout = {
    labelCol: { span: 3 },
  };
  const FormItemlayout = {
    labelCol: { span: 10 },
  };
  const FormItemCard2layout = {
    labelCol: { span: 6 },
  };
  const FormItemCard3layout = {
    labelCol: { span: 3 },
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
          <Row>
            <Col span={15}>
              <Row gutter={16}>
                <Col lg={8} md={6} sm={24}>
                  <Form.Item
                    {...FormItemlayout}
                    label="姓名"
                    name="username"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input placeholder="请输入姓名" />
                  </Form.Item>
                </Col>
                <Col lg={8} md={6} sm={24}>
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
                <Col lg={8} md={6} sm={24}>
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
                <Col lg={8} md={6} sm={24}>
                  <Form.Item
                    {...FormItemlayout}
                    label="出生日期"
                    name="date"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col lg={8} md={6} sm={24}>
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
                <Col span={24}>
                  <Form.Item
                    {...FormMoreItemlayout}
                    label="身份证号码"
                    name="date"
                    rules={[{ required: true, message: '请输入身份证号码' }]}
                  >
                    <Input style={{ marginLeft: 4 }} placeholder="请输入身份证号码" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    {...FormMoreItemlayout}
                    label="户籍所在地"
                    name="date"
                    rules={[{ required: true, message: '请选择户籍所在地' }]}
                  >
                    <Select className="select" placeholder="请选择省">
                      <Option value="四川">四川</Option>
                    </Select>
                    <Select className="select" placeholder="请选择市">
                      <Option value="成都">成都</Option>
                    </Select>
                    <Select className="select" placeholder="请选择区">
                      <Option value="高新区">高新区</Option>
                    </Select>
                    <Input className="address" placeholder="请输入详细地址" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item
                    {...FormMoreItemlayout}
                    label="现居住地址"
                    name="date"
                    rules={[{ required: true, message: '请选择户籍所在地' }]}
                  >
                    <Select className="select" placeholder="请选择省">
                      <Option value="四川">四川</Option>
                    </Select>
                    <Select className="select" placeholder="请选择市">
                      <Option value="成都">成都</Option>
                    </Select>
                    <Select className="select" placeholder="请选择区">
                      <Option value="高新区">高新区</Option>
                    </Select>
                    <Input className="address" placeholder="请输入详细地址" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={8} md={6} sm={24}>
                  <Form.Item
                    {...FormItemlayout}
                    label="邮政编码"
                    name="username"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input placeholder="自动带出" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col className="qrCode" span={9}>
              <Image
                width={240}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: 20 }} title="家庭成员" bordered={false}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="父亲姓名"
                name="username"
                rules={[{ required: true, message: '请填写' }]}
              >
                <Input placeholder="请填写父亲姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="联系电话"
                name="phone"
                rules={[{ required: true, message: '请填写' }]}
              >
                <Input placeholder="请填写父亲联系电话" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="出生年月"
                name="date"
                rules={[{ required: true, message: '请选择出生年月' }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="职业种类"
                name="date"
                rules={[{ required: true, message: '请选择职业种类' }]}
              >
                <Select style={{ width: '30%', marginRight: 8 }} placeholder="请选择">
                  <Option value="四川">四川</Option>
                </Select>
                <Select style={{ width: '30%', marginRight: 8 }} placeholder="请选择">
                  <Option value="成都">成都</Option>
                </Select>
                <Select style={{ width: '30%', marginRight: 8 }} placeholder="请选择">
                  <Option value="高新区">高新区</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="文化程度"
                name="mingzu"
                rules={[{ required: true, message: '请选择文化程度' }]}
              >
                <Select placeholder="请选择文化程度">
                  <Option value="汉族">汉族</Option>
                  <Option value="藏族">藏族</Option>
                  <Option value="彝族">彝族</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="母亲姓名"
                name="username"
                rules={[{ required: true, message: '请填写' }]}
              >
                <Input placeholder="请填写母亲姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="联系电话"
                name="phone"
                rules={[{ required: true, message: '请填写' }]}
              >
                <Input placeholder="请填写父亲联系电话" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="出生年月"
                name="date"
                rules={[{ required: true, message: '请选择出生年月' }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="职业种类"
                name="date"
                rules={[{ required: true, message: '请选择职业种类' }]}
              >
                <Select style={{ width: '30%', marginRight: 8 }} placeholder="请选择">
                  <Option value="四川">四川</Option>
                </Select>
                <Select style={{ width: '30%', marginRight: 8 }} placeholder="请选择">
                  <Option value="成都">成都</Option>
                </Select>
                <Select style={{ width: '30%', marginRight: 8 }} placeholder="请选择">
                  <Option value="高新区">高新区</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="文化程度"
                name="mingzu"
                rules={[{ required: true, message: '请选择文化程度' }]}
              >
                <Select placeholder="请选择文化程度">
                  <Option value="汉族">汉族</Option>
                  <Option value="藏族">藏族</Option>
                  <Option value="彝族">彝族</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="主要照顾者"
                name="username"
                rules={[{ required: true, message: '请填写' }]}
              >
                <Input placeholder="请填写主要照顾者姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="联系电话"
                name="phone"
                rules={[{ required: true, message: '请填写' }]}
              >
                <Input placeholder="请填写父亲联系电话" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="出生年月"
                name="date"
                rules={[{ required: true, message: '请选择出生年月' }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="职业种类"
                name="date"
                rules={[{ required: true, message: '请选择职业种类' }]}
              >
                <Select style={{ width: '30%', marginRight: 8 }} placeholder="请选择">
                  <Option value="四川">四川</Option>
                </Select>
                <Select style={{ width: '30%', marginRight: 8 }} placeholder="请选择">
                  <Option value="成都">成都</Option>
                </Select>
                <Select style={{ width: '30%', marginRight: 8 }} placeholder="请选择">
                  <Option value="高新区">高新区</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                {...FormItemCard2layout}
                label="文化程度"
                name="mingzu"
                rules={[{ required: true, message: '请选择文化程度' }]}
              >
                <Select placeholder="请选择文化程度">
                  <Option value="汉族">汉族</Option>
                  <Option value="藏族">藏族</Option>
                  <Option value="彝族">彝族</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 20 }} title="家庭状况 此板块皆为单选、必填">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                {...FormItemCard3layout}
                label="家庭模式"
                name="username"
                rules={[{ required: true, message: '请选择家庭模式' }]}
              >
                <Radio.Group>
                  <Radio value={1}>大家庭</Radio>
                  <Radio value={2}>核心家庭</Radio>
                  <Radio value={3}>单亲家庭</Radio>
                  <Radio value={4}>寄养家庭</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                {...FormItemCard3layout}
                label="居住社区"
                name="username"
                rules={[{ required: true, message: '请选择家庭模式' }]}
              >
                <Radio.Group>
                  <Radio value={1}>花园、小区</Radio>
                  <Radio value={2}>独家居住</Radio>
                  <Radio value={3}>租住房</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                {...FormItemCard3layout}
                label="教养方式"
                name="username"
                rules={[{ required: true, message: '请选择家庭模式' }]}
              >
                <Radio.Group>
                  <Radio value={1}>教育型</Radio>
                  <Radio value={2}>娇惯型</Radio>
                  <Radio value={3}>放任自流型</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                {...FormItemCard3layout}
                label="语言环境"
                name="username"
                rules={[{ required: true, message: '请选择语言环境' }]}
              >
                <Radio.Group>
                  <Radio value={1}>普通话</Radio>
                  <Radio value={2}>地方方言</Radio>
                </Radio.Group>
                <Select size="small" style={{ width: 100 }} placeholder="请选择地方方言">
                  <Option value="重庆话">重庆话</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                {...FormItemCard3layout}
                label="家庭经济状况"
                name="username"
                rules={[{ required: true, message: '请选择家庭模式' }]}
              >
                <Radio.Group>
                  <Radio value={1}>富裕</Radio>
                  <Radio value={2}>小康</Radio>
                  <Radio value={3}>家庭人均收入低于当地城乡居民最低生活保障线</Radio>
                  <Radio value={4}>农村领取社会救助金</Radio>
                  <Radio value={5}>家庭经济困难</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                {...FormItemCard3layout}
                label="户口类别"
                name="username"
                rules={[{ required: true, message: '请选择家庭模式' }]}
              >
                <Radio.Group>
                  <Radio value={1}>农业户</Radio>
                  <Radio value={2}>非农业户</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                {...FormItemCard3layout}
                label="享受医疗保险情况"
                name="username"
                rules={[{ required: true, message: '请选择家庭模式' }]}
              >
                <Radio.Group>
                  <Radio value={1}>享受城镇职工基本医疗</Radio>
                  <Radio value={2}>享受农村合作医疗</Radio>
                  <Radio value={3}>享受医疗救助</Radio>
                  <Radio value={4}>享受其他保险</Radio>
                  <Radio value={5}>无医疗保险</Radio>
                </Radio.Group>
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
