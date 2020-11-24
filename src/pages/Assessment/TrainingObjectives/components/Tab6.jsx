import React, { useState, useEffect } from 'react';
import { message, Form, Checkbox, Radio, Input, Button } from 'antd';
import { connect } from 'umi';
import { queryCommonAllEnums, getSingleEnums } from '@/utils/utils';
import {
  getAllTrainWay,
  getTrainAdaptationInfo,
  getAllAbility,
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

const Tab3 = ({ patientId, submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [abilityLevelTypeList, setAbilityLevelTypeList] = useState([]);
  const [trainType, setTrainType] = useState([]);

  const [abilityList, setAbilityList] = useState([]);
  const [abilityListNames, setAbilityListNames] = useState([]);

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
    setRoughTrainTypeList(data.filter((item) => item.type === 15));
  };

  const queryAllAbility = async () => {
    const res = await getAllAbility();
    const data = res?.map((item) => {
      item.label = item.name;
      item.value = item.id + '-' + item.name;
      return item;
    });
    setAbilityList(data.filter((item) => item.type === 3));
  };

  const onHandleChange = (arrId, names, setNames, otherField) => {
    setNames(arrId.map((item) => item.split('-')[1]));
    if (!names.includes('其他')) {
      form.setFields([{ name: otherField, value: '' }]);
    }
  };

  const onFinish = (values) => {
    if (!patientId) {
      return message.info('请先获取患者信息');
    }

    function getBos(values, bos, otherField, idField) {
      const newBos = [];
      values[bos]?.forEach((item) => {
        newBos.push({
          [idField]: item.split('-')[0],
          isOther: item.split('-')[1] === '其他',
          other: values[otherField] || '',
        });
      });
      return newBos;
    }

    const trainWayBos = getBos(values, 'trainWayBos', 'other', 'trainWayId');
    const abilityBos = getBos(values, 'abilityBos', 'otherAbility', 'abilityId');

    const postData = {
      patientId,
      isObserved: values.isObserved,
      isTalk: values.isTalk,
      proposalTarget: values.proposalTarget,
      liftAbilityLevel: values.liftAbilityLevel,
      liftAbilityTrainType: values.liftAbilityTrainType,
      trainWayBos,
      abilityBos,
    };
    dispatch({
      type: 'assessmentAndTrainingObjectives/createSaveTrainAdaptation',
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

  const queryTrainAdaptationInfo = async () => {
    const values = await getTrainAdaptationInfo({ patientId });
    if (values && values.data === null) {
      // 该患者没有进行操作
      cancel();
      return;
    }

    function setBos(values, vosField, bosField, otherField, names, setNames, type) {
      let other = '';
      let bos = [];
      values[vosField] &&
        values[vosField][type]?.forEach((item) => {
          if (item.type === type) {
            bos.push(`${item.id}-${item.name}`);
            other = item.isOther ? item.other : '';
          }
        });
      setNames && onHandleChange(bos, names, setNames, otherField);
      return {
        [bosField]: bos,
        [otherField]: other,
      };
    }

    const trainWayBos = setBos(
      values,
      'trainWayVos',
      'trainWayBos',
      'other',
      'trainWayListNames',
      setTrainWayListNames,
      15,
    );

    const abilityBos = setBos(
      values,
      'abilityVos',
      'abilityBos',
      'otherAbility',
      'abilityListNames',
      setAbilityListNames,
      3,
    );

    const setData = {
      isObserved: values.isObserved,
      isTalk: values.isTalk,
      proposalTarget: values.proposalTarget,
      liftAbilityLevel: values.liftAbilityLevel,
      liftAbilityTrainType: values.liftAbilityTrainType,
      ...trainWayBos,
      ...abilityBos,
    };
    form.setFieldsValue(setData);
  };

  useEffect(() => {
    queryEnums();
    queryAllTrainWay();
    queryAllAbility();
  }, []);

  useEffect(() => {
    if (patientId) {
      queryTrainAdaptationInfo();
    }
  }, [patientId]);
  return (
    <Form hideRequiredMark {...layout} form={form} onFinish={onFinish}>
      <Form.Item
        label="生活作息及参与"
        name="liftAbilityLevel"
        rules={[{ required: true, message: '请选择生活作息及参与' }]}
      >
        <Radio.Group>
          {abilityLevelTypeList.map((item) => (
            <Radio key={item.code} value={item.code}>
              {item.codeCn}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label="评估方法">
        <div style={{ display: 'flex' }}>
          <Form.Item name="isObserved" valuePropName="checked">
            <Checkbox>临床观察</Checkbox>
          </Form.Item>
          <Form.Item name="isTalk" valuePropName="checked">
            <Checkbox>临床晤谈</Checkbox>
          </Form.Item>
        </div>
        <Form.Item name="abilityBos" rules={[{ required: true, message: '请选择' }]}>
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(arrId, abilityListNames, setAbilityListNames, 'otherAbility')
            }
            options={abilityList}
          ></Checkbox.Group>
        </Form.Item>
        {abilityListNames.includes('其他') && (
          <Form.Item name="otherAbility">
            <Input />
          </Form.Item>
        )}
      </Form.Item>
      <Form.Item
        label="生活作息训练"
        name="liftAbilityTrainType"
        rules={[{ required: true, message: '请选择生活作息训练' }]}
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
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(arrId, trainWayListNames, setTrainWayListNames, 'other')
            }
            options={roughTrainTypeList}
          ></Checkbox.Group>
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
  submitting: loading.effects['assessmentAndTrainingObjectives/createSaveTrainAdaptation'],
}))(Tab3);
