import React, { useState, useEffect } from 'react';
import { Form, Button, Radio, message, DatePicker } from 'antd';
import ProList from '@ant-design/pro-list';
import './index.less';
import { connect, history } from 'umi';
import moment from 'moment';

import { getAuth } from '@/utils/utils';
import { getSpecialAssessMembers, getPlanInfo } from '../service';
import CreateCheckupRecord from '@/pages/MedicalExamination/DiagnosisPrescription/components/CreateCheckupRecord';

const layout = {
  labelCol: {
    span: 2,
  },
};

const CaseAssessmentRecord = ({ dispatch, submitting, info = {} }) => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]); // 个案评估小组

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };
  const save = () => {
    if (!info.id) {
      return message.info('请先获取患者信息');
    }
    const isNeedReview = form.getFieldValue('isNeedReview');
    const reviewTime = form.getFieldValue('reviewTime');

    const postData = {
      employeeIds: selectedRowKeys,
      isNeedReview,
      reviewTime: reviewTime ? moment(reviewTime).valueOf() : 0,
      patientId: info.id,
    };
    dispatch({
      type: 'assessmentAndCaseAssessmentPlanning/savePlan',
      payload: postData,
      callback: (res) => {
        res && message.success('操作成功');
      },
    });
  };

  const querySpecialAssessMembers = async () => {
    const res = await getSpecialAssessMembers();
    const data = res?.map((item) => {
      item.title = `${item.name} ${item.serviceTimes}人`;
      return item;
    });
    setDataSource(data);
  };

  const queryPlanInfo = async () => {
    const res = await getPlanInfo({
      patientId: info.id,
    });
    if (res) {
      res.reviewTime = res.reviewTime ? moment(res.reviewTime) : moment();
      form.setFieldsValue(res);
      setSelectedRowKeys(res.employeeIds);
    }
  };

  useEffect(() => {
    querySpecialAssessMembers();
    if (info.id) {
      form.resetFields();
      queryPlanInfo(); // 个案评估小组信息
    }
  }, [info.id]);

  return (
    <Form
      {...layout}
      form={form}
      initialValues={{
        reviewTime: moment(),
      }}
    >
      <Form.Item label="个案评估小组">
        <div className="group">
          <ProList
            className="list"
            metas={{
              title: {
                dataIndex: 'title',
              },
            }}
            rowKey="id"
            rowSelection={rowSelection}
            dataSource={dataSource}
          />
          {getAuth(22)?.canEdit && (
            <Button loading={submitting} type="primary" onClick={save}>
              保留设置
            </Button>
          )}
        </div>
      </Form.Item>

      <div style={{ display: 'flex' }}>
        <Form.Item
          labelCol={{ span: 10 }}
          label="是否需要复评"
          name="isNeedReview"
          rules={[
            {
              required: true,
              message: '请选择',
            },
          ]}
        >
          <Radio.Group>
            <Radio value={true}>需要</Radio>
            <Radio value={false}>不需要</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item labelCol={{ span: 10 }} label="复评日期" name="reviewTime">
          <DatePicker />
        </Form.Item>
      </div>

      <CreateCheckupRecord info={info} authKey={22} />
    </Form>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['assessmentAndCaseAssessmentPlanning/savePlan'],
}))(CaseAssessmentRecord);
