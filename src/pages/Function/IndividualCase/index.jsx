import { Button, Modal, message, Input, Form, Tooltip, Select, DatePicker } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getSpecialList } from './service';
import { queryCommonAllEnums, getSingleEnums } from '@/utils/utils';
import { connect } from 'umi';
const FormItem = Form.Item;
import moment from 'moment';
import { getProjectAllProject } from '@/pages/Function/ResearchProject/service';

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

const IndividualCase = (props) => {
  const { submitting } = props;
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [allName, setAllName] = useState([]);
  const [employeeAllList, setEmployeeAllList] = useState([]);
  const [diseaseTypeList, setDiseaseTypeList] = useState([]);

  const querySpecialList = async (params) => {
    const res = await getSpecialList({
      ...params,
      body: {
        diseaseType: params.diseaseNames,
        projectId: params.projectId,
        keywords: params.keywords,
      },
    });
    if (res) {
      return res;
    }
  };

  const queryEnums = async () => {
    const newArr = await queryCommonAllEnums();
    setDiseaseTypeList(getSingleEnums('DiseaseType', newArr)); //病因分类
  };

  const queryProjectAllProject = async () => {
    const res = await getProjectAllProject();
    if (res) {
      setAllName(res);
    }
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectId',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            onFocus={allName.length === 0 && queryProjectAllProject}
            placeholder="请选择项目名称"
          >
            {allName.map((item, index) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },

    {
      title: '病历创建时间',
      dataIndex: 'createDocumentTime',
      search: false,
      render: (_, record) => {
        return moment(record.createDocumentTime).format('YYYY-MM-DD');
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '病历编号',
      dataIndex: 'caseCodeV',
      search: false,
    },

    {
      title: '病因分类',
      dataIndex: 'diseaseNames',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            listHeight={300}
            onFocus={diseaseTypeList.length === 0 && queryEnums}
            placeholder="请选择病因"
          >
            {diseaseTypeList.map((item) => (
              <Select.Option value={item.code} key={item.code}>
                {item.codeCn}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '就诊次数',
      dataIndex: 'visitingCount',
      search: false,
    },
    {
      title: '康复训练',
      dataIndex: 'trainWayCount',
      search: false,
    },
    {
      title: '搜索关键字',
      dataIndex: 'keywords',
      hideInTable: true,
      formItemProps: {
        placeholder: '请输入姓名、病历编号等关键字进行搜索',
      },
    },

    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => (
    //     <>
    //       <Button size="small" onClick={() => handleUpdate(record, 1)} type="success">
    //         查看详情
    //       </Button>
    //     </>
    //   ),
    // },
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
          request={(params, sorter, filter) => querySpecialList(params)}
          columns={columns}
        />
        <Modal
          title="研究立项"
          visible={visible}
          // onOk={handleOk}
          // onCancel={handleCancel}
          // footer={[
          //   <Button key="submit" type="primary" loading={submitting} onClick={handleOk}>
          //     确定
          //   </Button>,
          //   <Button key="back" onClick={handleCancel}>
          //     取消
          //   </Button>,
          //   ,
          // ]}
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
  submitting: loading.effects['functionAndIndividualCase/create'],
}))(IndividualCase);
