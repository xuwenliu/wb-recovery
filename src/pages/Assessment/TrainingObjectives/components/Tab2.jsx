import React, { useState, useEffect } from 'react';
import { message, Form, Checkbox, Radio, Input, Button } from 'antd';
import { connect } from 'umi';
import { queryCommonAllEnums, getSingleEnums } from '@/utils/utils';
import {
  getAllTrainWay,
  getCarefulActivityInfo,
} from '@/pages/Assessment/TrainingObjectives/service';

const layout = {
  labelCol: {
    span: 3,
  },
};
const submitLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    offset: 3,
  },
};

const Tab2 = ({ patientId, submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [abilityLevelTypeList, setAbilityLevelTypeList] = useState([]);
  const [trainType, setTrainType] = useState([]);
  const [roughTrainTypeList, setRoughTrainTypeList] = useState([]);
  const [trainWayListNames, setTrainWayListNames] = useState([]);

  const queryEnums = async () => {
    const newArr = await queryCommonAllEnums();
    setAbilityLevelTypeList(getSingleEnums('AbilityLevelType', newArr)); //无异常，疑似发展迟缓，发展迟缓
    setTrainType(getSingleEnums('TrainType', newArr)); // 不需要，需要追踪咨询，需要训练
  };

  const queryAllTrainWay = async () => {
    const res = await getAllTrainWay();
    const data = res?.map((item) => {
      item.label = item.name;
      item.value = item.id + '-' + item.name;
      return item;
    });
    setRoughTrainTypeList(data.filter((item) => item.type === 3));
  };

  const onTrainWayChange = (arrId) => {
    setTrainWayListNames(arrId.map((item) => item.split('-')[1]));
    if (!trainWayListNames.includes('其他')) {
      form.setFields([{ name: 'other', value: '' }]);
    }
  };

  const onFinish = (values) => {
    if (!patientId) {
      return message.info('请先获取患者信息');
    }
    const trainWayBos = [];
    values.trainWayBos?.forEach((item) => {
      trainWayBos.push({
        trainWayId: item.split('-')[0],
        isOther: item.split('-')[1] === '其他',
        other: values.other,
      });
    });
    const postData = {
      patientId,
      proposalTarget: values.proposalTarget,
      carefulActivityLevel: values.carefulActivityLevel,
      carefulTrainType: values.carefulTrainType,
      trainWayBos,
    };
    dispatch({
      type: 'assessmentAndTrainingObjectives/createSaveCareFulActivity',
      payload: postData,
      callback: (res) => {
        res && message.success('操作成功');
      },
    });
  };

  const cancel = () => {
    form.resetFields();
    setTrainWayListNames([]);
  };

  const queryRoughActivityInfo = async () => {
    const values = await getCarefulActivityInfo({ patientId });
    if (values && values.data === null) {
      // 该患者没有进行操作
      cancel();
      return;
    }

    const trainWayBos = [];
    let other = '';

    // 精细动作训练 -训练方向
    values.trainWayVos && values.trainWayVos['3']?.forEach((item) => {
      trainWayBos.push(`${item.id}-${item.name}`);
      if (item.isOther) {
        other = item.other;
      }
    });
    onTrainWayChange(trainWayBos);

    const setData = {
      proposalTarget: values.proposalTarget,
      carefulActivityLevel: values.carefulActivityLevel,
      carefulTrainType: values.carefulTrainType,
      trainWayBos,
      other,
    };
    form.setFieldsValue(setData);
  };

  useEffect(() => {
    queryEnums();
    queryAllTrainWay();
  }, []);

  useEffect(() => {
    if (patientId) {
      queryRoughActivityInfo();
    }
  }, [patientId]);
  return (
    <Form hideRequiredMark {...layout} form={form} onFinish={onFinish}>
      <Form.Item
        label="精细动作"
        name="carefulActivityLevel"
        rules={[{ required: true, message: '请选择精细动作' }]}
      >
        <Radio.Group>
          {abilityLevelTypeList.map((item) => (
            <Radio key={item.code} value={item.code}>
              {item.codeCn}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="精细动作训练"
        name="carefulTrainType"
        rules={[{ required: true, message: '请选择精细动作训练' }]}
      >
        <Radio.Group>
          {trainType.map((item) => (
            <Radio key={item.code} value={item.code}>
              {item.codeCn}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label="训练方向">
        <Form.Item name="trainWayBos" rules={[{ required: true, message: '请选择训练方向' }]}>
          <Checkbox.Group onChange={onTrainWayChange} options={roughTrainTypeList}></Checkbox.Group>
        </Form.Item>
        {trainWayListNames.includes('其他') && (
          <Form.Item name="other">
            <Input />
          </Form.Item>
        )}
      </Form.Item>
      <Form.Item label="建议目标" name="proposalTarget">
        <Input.TextArea rows={4}></Input.TextArea>
      </Form.Item>
      <Form.Item {...submitLayout}>
        <Button htmlType="submit" type="primary" loading={submitting} className="mr8">
          确定
        </Button>
        <Button onClick={cancel}>取消</Button>
      </Form.Item>
    </Form>
  );
};
export default connect(({ loading }) => ({
  submitting: loading.effects['assessmentAndTrainingObjectives/createSaveCareFulActivity'],
}))(Tab2);
