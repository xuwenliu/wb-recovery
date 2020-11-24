import React, { useState, useEffect } from 'react';
import { message, Form, Checkbox, Radio, Input, Button } from 'antd';
import { connect } from 'umi';
import { queryCommonAllEnums, getSingleEnums } from '@/utils/utils';
import {
  getAllTrainWay,
  getRoughActivityInfo,
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

const Tab1 = ({ patientId, submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [abilityLevelTypeList, setAbilityLevelTypeList] = useState([]);
  const [trainType, setTrainType] = useState([]);
  const [roughTrainTypeList, setRoughTrainTypeList] = useState([]);
  const [roughTrainTypeListNames, setRoughTrainTypeListNames] = useState([]);

  const [feelLevelList, setFeelLevelList] = useState([]);
  const [feelLevelListNames, setFeelLevelListNames] = useState([]);

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
    setRoughTrainTypeList(data.filter((item) => item.type === 1));
    setFeelLevelList(data.filter((item) => item.type === 2));
  };

  const onRoughTrainChange = (arrId) => {
    setRoughTrainTypeListNames(arrId.map((item) => item.split('-')[1]));
    if (!roughTrainTypeListNames.includes('其他')) {
      form.setFields([{ name: 'otherRoughTrain', value: '' }]);
    }
  };

  const onFellLevelChange = (arrId) => {
    setFeelLevelListNames(arrId.map((item) => item.split('-')[1]));
    if (!feelLevelListNames.includes('其他')) {
      form.setFields([{ name: 'otherFellLevel', value: '' }]);
    }
  };

  const onFinish = (values) => {
    if (!patientId) {
      return message.info('请先获取患者信息');
    }
    const roughTrainBos = [];
    const fellLevelBos = [];
    values.roughTrainBos?.forEach((item) => {
      roughTrainBos.push({
        trainWayId: item.split('-')[0],
        isOther: item.split('-')[1] === '其他',
        other: values.otherRoughTrain,
      });
    });
    values.fellLevelBos?.forEach((item) => {
      fellLevelBos.push({
        trainWayId: item.split('-')[0],
        isOther: item.split('-')[1] === '其他',
        other: values.otherFellLevel,
      });
    });

    const trainWayBos = roughTrainBos.concat(fellLevelBos);

    const postData = {
      patientId,
      feelLevel: values.feelLevel,
      proposalTarget: values.proposalTarget,
      roughActivityLevel: values.roughActivityLevel,
      roughTrainType: values.roughTrainType,
      trainWayBos,
    };
    dispatch({
      type: 'assessmentAndTrainingObjectives/createSaveRoughActivity',
      payload: postData,
      callback: (res) => {
        res && message.success('操作成功');
      },
    });
  };

  const cancel = () => {
    form.resetFields();
    setFeelLevelListNames([]);
    setRoughTrainTypeListNames([]);
  };

  const queryRoughActivityInfo = async () => {
    const values = await getRoughActivityInfo({ patientId });
    if (values && values.data === null) {
      // 该患者没有进行操作
      cancel();
      return;
    }

    const roughTrainBos = [];
    const fellLevelBos = [];
    let otherRoughTrain = '';
    let otherFellLevel = '';

    // 粗大动作训练 -训练方向
    values.trainWayVos && values.trainWayVos['1']?.forEach((item) => {
      roughTrainBos.push(`${item.id}-${item.name}`);
      if (item.isOther) {
        otherRoughTrain = item.other;
      }
    });
    // 感觉统合 -训练方向
    values.trainWayVos && values.trainWayVos['2']?.forEach((item) => {
      fellLevelBos.push(`${item.id}-${item.name}`);
      if (item.isOther) {
        otherFellLevel = item.other;
      }
    });
    onRoughTrainChange(roughTrainBos);
    onFellLevelChange(fellLevelBos);

    const setData = {
      feelLevel: values.feelLevel,
      proposalTarget: values.proposalTarget,
      roughActivityLevel: values.roughActivityLevel,
      roughTrainType: values.roughTrainType,
      roughTrainBos,
      fellLevelBos,
      otherRoughTrain,
      otherFellLevel,
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
        label="粗大动作"
        name="roughActivityLevel"
        rules={[{ required: true, message: '请选择粗大动作' }]}
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
        label="粗大动作训练"
        name="roughTrainType"
        rules={[{ required: true, message: '请选择粗大动作训练' }]}
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
        <Form.Item name="roughTrainBos" rules={[{ required: true, message: '请选择训练方向' }]}>
          <Checkbox.Group
            onChange={onRoughTrainChange}
            options={roughTrainTypeList}
          ></Checkbox.Group>
        </Form.Item>
        {roughTrainTypeListNames.includes('其他') && (
          <Form.Item name="otherRoughTrain">
            <Input />
          </Form.Item>
        )}
      </Form.Item>
      <Form.Item
        label="感觉统合"
        name="feelLevel"
        rules={[{ required: true, message: '请选择感觉统合' }]}
      >
        <Radio.Group>
          {abilityLevelTypeList.map((item) => (
            <Radio key={item.code} value={item.code}>
              {item.codeCn}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label="训练方向">
        <Form.Item name="fellLevelBos" rules={[{ required: true, message: '请选择训练方向' }]}>
          <Checkbox.Group onChange={onFellLevelChange} options={feelLevelList}></Checkbox.Group>
        </Form.Item>

        {feelLevelListNames.includes('其他') && (
          <Form.Item name="otherFellLevel">
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
  submitting: loading.effects['assessmentAndTrainingObjectives/createSaveRoughActivity'],
}))(Tab1);
