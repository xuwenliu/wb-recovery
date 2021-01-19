import React, { useState, useEffect } from 'react';
import { message, Form, Checkbox, Radio, Input, Button } from 'antd';
import { connect } from 'umi';
import { queryCommonAllEnums, getSingleEnums, getAuth } from '@/utils/utils';
import { getAllTrainWay, getFeelInfo } from '@/pages/Assessment/TrainingObjectives/service';

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

const Tab7 = ({ patientId, submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [abilityLevelTypeList, setAbilityLevelTypeList] = useState([]);

  const [feelLevelList, setFeelLevelList] = useState([]);
  const [feelLevelListNames, setFeelLevelListNames] = useState([]);

  const queryEnums = async () => {
    const newArr = await queryCommonAllEnums();
    setAbilityLevelTypeList(getSingleEnums('AbilityLevelType', newArr)); //无异常，疑似发展迟缓，发展迟缓
  };

  const queryAllTrainWay = async () => {
    const res = await getAllTrainWay();
    const data = res?.map((item) => {
      item.label = item.name;
      item.value = item.id + '-' + item.name;
      return item;
    });
    setFeelLevelList(data.filter((item) => item.type === 2));
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
    const fellLevelBos = [];
    values.fellLevelBos?.forEach((item) => {
      fellLevelBos.push({
        trainWayId: item.split('-')[0],
        isOther: item.split('-')[1] === '其他',
        other: values.otherFellLevel,
      });
    });

    const postData = {
      patientId,
      feelLevel: values.feelLevel,
      proposalTarget: values.proposalTarget,
      trainWayBos: fellLevelBos,
    };
    dispatch({
      type: 'assessmentAndTrainingObjectives/createSaveFeelInfo',
      payload: postData,
      callback: (res) => {
        res && message.success('操作成功');
      },
    });
  };

  const cancel = () => {
    form.resetFields();
    setFeelLevelListNames([]);
  };

  const queryFeelInfo = async () => {
    const values = await getFeelInfo({ patientId });
    if (values && values.data === null) {
      // 该患者没有进行操作
      cancel();
      return;
    }

    const fellLevelBos = [];
    let otherFellLevel = '';

    // 感觉统合 -训练方向
    values.trainWayVos &&
      values.trainWayVos['2']?.forEach((item) => {
        fellLevelBos.push(`${item.id}-${item.name}`);
        if (item.isOther) {
          otherFellLevel = item.other;
        }
      });
    onFellLevelChange(fellLevelBos);

    const setData = {
      feelLevel: values.feelLevel,
      proposalTarget: values.proposalTarget,
      fellLevelBos,
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
      queryFeelInfo();
    }
  }, [patientId]);
  return (
    <Form hideRequiredMark {...layout} form={form} onFinish={onFinish}>
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
        <Form.Item
          name="fellLevelBos"
          dependencies={['feelLevel']}
          rules={[
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (getFieldValue('feelLevel') !== 3) {
                  if (!value || value.length === 0) {
                    return Promise.reject('请选择训练方向');
                  }
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
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
      {getAuth()?.canEdit && (
        <Form.Item {...submitLayout}>
          <Button htmlType="submit" type="primary" loading={submitting} className="mr8">
            确定
          </Button>
          <Button onClick={cancel}>取消</Button>
        </Form.Item>
      )}
    </Form>
  );
};
export default connect(({ loading }) => ({
  submitting: loading.effects['assessmentAndTrainingObjectives/createSaveFeelInfo'],
}))(Tab7);
