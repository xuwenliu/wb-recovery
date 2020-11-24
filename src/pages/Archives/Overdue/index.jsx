import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, Form, Tooltip, Select, DatePicker } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {
  getProjectList,
  getProjectAllCode,
  getProjectAllEmployee,
  getProjectAllName,
} from '@/pages/Function/ResearchProject/service';

import { getEmployeeAllList } from '@/pages/Function/Employee/service';

import { connect } from 'umi';
const FormItem = Form.Item;
import moment from 'moment';

let updateId = '';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 18,
    },
    md: {
      span: 24,
    },
  },
};

const Overdue = (props) => {
  const { submitting } = props;
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [allCode, setAllCode] = useState([]);
  const [allEmployee, setAllEmployee] = useState([]);
  const [allName, setAllName] = useState([]);
  const [employeeAllList, setEmployeeAllList] = useState([]);

  const queryProjectList = async (params) => {
    const res = await getProjectList({
      ...params,
      body: {
        code: params.code,
        employeeId: params.employeeNames,
        keyword: params.keyword,
        name: params.name,
      },
    });
    if (res) {
      queryProjectAllCode();
      queryProjectAllEmployee();
      queryProjectAllName();
      return res;
    }
  };

  const queryProjectAllCode = async () => {
    const res = await getProjectAllCode();
    if (res) {
      setAllCode(res);
    }
  };

  const queryProjectAllEmployee = async () => {
    const res = await getProjectAllEmployee();
    if (res) {
      setAllEmployee(res);
    }
  };

  const queryProjectAllName = async () => {
    const res = await getProjectAllName();
    if (res) {
      setAllName(res);
    }
  };

  // 获取研究项目人员
  const queryEmployeeAllList = async () => {
    const res = await getEmployeeAllList();
    if (res) {
      setEmployeeAllList(res);
    }
  };
  useEffect(() => {
    queryEmployeeAllList();
  }, []);

  // 删除
  const handleRemove = async (row) => {
    const { dispatch } = props;
    dispatch({
      type: 'functionAndResearchProject/remove',
      payload: {
        id: row.id,
      },
      callback: (res) => {
        if (res) {
          message.success('删除成功');
          actionRef?.current?.reload();
        } else {
          message.error('删除失败');
        }
      },
    });
  };
  // 编辑
  const handleUpdate = async (row, infoNumber) => {
    const { dispatch } = props;
    updateId = row.id;
    dispatch({
      type: 'functionAndResearchProject/getInfo',
      payload: {
        id: row.id,
      },
      callback: (data) => {
        if (data) {
          data.time = [moment(data.startTime), moment(data.endTime)];
          data.employeeId = data.employeeDos.map((item) => item.id);
          form.setFieldsValue(data);
          updateId = infoNumber ? infoNumber : row.id;
          setVisible(true);
        }
      },
    });
  };

  // 取消
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    updateId = '';
  };

  // 提交
  const handleOk = async () => {
    const { dispatch } = props;
    const values = await form.validateFields(); //校验
    if (values) {
      const getValues = form.getFieldsValue(); // 获取最新文本值
      const postData = {
        id: updateId,
        ...getValues,
        startTime: moment(getValues.time[0]).valueOf(), // 时间传时间戳
        endTime: moment(getValues.time[1]).valueOf(), // 时间传时间戳
      };
      dispatch({
        type: 'functionAndResearchProject/create',
        payload: postData,
        callback: (res) => {
          if (!res) return;
          message.success(`${postData.id ? '修改' : '新增'}成功`);
          handleCancel();
          actionRef?.current?.reload();
        },
      });
    }
  };

  const columns = [
    {
      title: '最近训练时间',
      dataIndex: 'description',
      search: false,
    },
    {
      title: '姓名',
      dataIndex: 'startTime',
      search: false,
    },
    {
      title: '病历编号',
      dataIndex: 'endTime',
      search: false,
    },
    {
      title: '逾时阶段',
      dataIndex: 'code',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select placeholder="请选择逾时阶段">
            {allCode.map((item, index) => (
              <Select.Option value={item} key={index}>
                {item}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '搜索关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      formItemProps: {
        placeholder: '请输入姓名、病历编号等关键字进行搜索',
      },
    },
    {
      title: '所属单位',
      dataIndex: 'remark',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button onClick={() => handleUpdate(record)} size="small" type="primary" className="mr8">
            查看详情
          </Button>
          <Button size="small" onClick={() => handleUpdate(record, 1)} type="success">
            一键报警
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <PageContainer>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 100,
          }}
          request={(params, sorter, filter) => queryProjectList(params)}
          columns={columns}
        />
        <Modal
          title="研究立项"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="submit" type="primary" loading={submitting} onClick={handleOk}>
              确定
            </Button>,
            <Button key="back" onClick={handleCancel}>
              取消
            </Button>,
            ,
          ]}
        >
          <Form
            style={{
              marginTop: 8,
            }}
            form={form}
            name="basic"
          >
            <Tooltip title="注：一经确认无法修改">
              <FormItem
                {...formItemLayout}
                label="研究项目编号"
                name="code"
                rules={[
                  {
                    required: true,
                    message: '请输入研究项目编号',
                  },
                ]}
              >
                <Input disabled={updateId} placeholder="请输入研究项目编号" />
              </FormItem>
            </Tooltip>
            <FormItem
              {...formItemLayout}
              label="研究项目名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入研究项目名称',
                },
              ]}
            >
              <Input disabled={updateId} placeholder="请输入研究项目名称" />
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="研究项目人员"
              name="employeeId"
              rules={[
                {
                  required: true,
                  message: '请选择研究项目人员',
                },
              ]}
            >
              <Select disabled={updateId} mode="multiple" placeholder="请选择研究项目人员">
                {employeeAllList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="研究说明"
              name="description"
              rules={[
                {
                  required: true,
                  message: '请输入研究说明',
                },
              ]}
            >
              <Input.TextArea disabled={updateId === 1} placeholder="请输入研究说明" />
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="立项时间"
              name="time"
              rules={[
                {
                  required: true,
                  message: '请选择立项时间',
                },
              ]}
            >
              <DatePicker.RangePicker disabled={updateId} />
            </FormItem>

            <FormItem {...formItemLayout} label="备注" name="remark">
              <Input.TextArea disabled={updateId === 1} placeholder="请输入备注" />
            </FormItem>
          </Form>
        </Modal>
      </PageContainer>
    </>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['functionAndResearchProject/create'],
}))(Overdue);
