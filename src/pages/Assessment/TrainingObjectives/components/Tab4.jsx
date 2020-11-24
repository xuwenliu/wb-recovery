import React, { useState, useEffect } from 'react';
import { message, Form, Checkbox, Radio, Input, Button } from 'antd';
import { connect } from 'umi';

const yesList = [
  {
    codeCn: '无异常',
    code: false,
  },
  {
    codeCn: '异常',
    code: true,
  },
];
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
import { queryCommonAllEnums, getSingleEnums } from '@/utils/utils';
import {
  getAllAbility,
  getAllTrainWay,
  getLanguageInfo,
} from '@/pages/Assessment/TrainingObjectives/service';

const Tab4 = ({ patientId, submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [trainType, setTrainType] = useState([]);
  const [abilityLevelTypeList, setAbilityLevelTypeList] = useState([]);

  const [mouthActivityList, setMouthActivityList] = useState([]);
  const [mouthActivityListNames, setMouthActivityListNames] = useState([]);

  const [mouthActivityTrainList, setMouthActivityTrainList] = useState([]);
  const [mouthActivityTrainListNames, setMouthActivityTrainListNames] = useState([]);
  const [isSwallowingReflexAbnormal, setIsSwallowingReflexAbnormal] = useState(false);

  const [chokeFeedList, setChokeFeedList] = useState([]);

  const [swallowingTrainList, setSwallowingTrainList] = useState([]);
  const [swallowingTrainListNames, setSwallowingTrainListNames] = useState([]);

  const [foodList, setFoodList] = useState([]);
  const [foodListNames, setFoodListNames] = useState([]);

  const [feederList, setFeederList] = useState([]);
  const [feederListNames, setFeederListNames] = useState([]);

  const [spokenComprehensionList, setSpokenComprehensionList] = useState([]);
  const [spokenComprehensionListNames, setSpokenComprehensionListNames] = useState([]);

  const [spokenAbilityList, setSpokenAbilityList] = useState([]);
  const [spokenAbilityListNames, setSpokenAbilityListNames] = useState([]);

  const [talkTrainList, setTalkTrainList] = useState([]);
  const [talkTrainListNames, setTalkTrainListNames] = useState([]);

  const queryEnums = async () => {
    const newArr = await queryCommonAllEnums();
    setTrainType(getSingleEnums('TrainType', newArr)); // 不需要，需要追踪咨询，需要训练
    setAbilityLevelTypeList(getSingleEnums('AbilityLevelType', newArr)); //无异常，疑似发展迟缓，发展迟缓
  };

  const queryAllTrainWay = async () => {
    const res = await getAllTrainWay();
    const data = res?.map((item) => {
      item.label = item.name;
      item.value = item.id + '-' + item.name;
      return item;
    });
    setMouthActivityTrainList(data.filter((item) => item.type === 5));
    setSwallowingTrainList(data.filter((item) => item.type === 6));
    setFoodList(data.filter((item) => item.type === 7));
    setFeederList(data.filter((item) => item.type === 8));
    setSpokenComprehensionList(data.filter((item) => item.type === 9));
    setSpokenAbilityList(data.filter((item) => item.type === 10));
    setTalkTrainList(data.filter((item) => item.type === 11));
  };

  const queryAllAbility = async () => {
    const res = await getAllAbility();
    const data = res?.map((item) => {
      item.label = item.name;
      item.value = item.id + '-' + item.name;
      return item;
    });
    setMouthActivityList(data.filter((item) => item.type === 4));
    setChokeFeedList(data.filter((item) => item.type === 6));
  };

  const onHandleChange = (arrId, names, setNames, otherField) => {
    setNames(arrId.map((item) => item.split('-')[1]));
    if (!names.includes('其他')) {
      form.setFields([{ name: otherField, value: '' }]);
    }
  };

  const onSwallowingReflexAbnormalChange = (e) => {
    setIsSwallowingReflexAbnormal(e.target.value);
    if (!e.target.value) {
      form.setFields([{ name: 'swallowingReflexAbnormalInfo', value: '' }]);
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

    const mouthActivityBos = getBos(values, 'mouthActivityBos', 'otherMouthActivity', 'abilityId');
    const chokeFeedBos = getBos(values, 'chokeFeedBos', null, 'abilityId');
    const abilityBos = mouthActivityBos.concat(chokeFeedBos);

    const mouthActivityTrainBos = getBos(
      values,
      'mouthActivityTrainBos',
      'otherMouthActivityTrain',
      'trainWayId',
    );

    const swallowingTrainBos = getBos(
      values,
      'swallowingTrainBos',
      'otherSwallowingTrain',
      'trainWayId',
    );

    const foodBos = getBos(values, 'foodBos', 'otherFood', 'trainWayId');
    const feederBos = getBos(values, 'feederBos', 'otherFeeder', 'trainWayId');

    const spokenComprehensionBos = getBos(
      values,
      'spokenComprehensionBos',
      'otherSpokenComprehension',
      'trainWayId',
    );

    const spokenAbilityBos = getBos(values, 'spokenAbilityBos', 'otherSpokenAbility', 'trainWayId');
    const talkTrainBos = getBos(values, 'talkTrainBos', 'otherTalkTrain', 'trainWayId');

    const trainWayBos = mouthActivityTrainBos
      .concat(swallowingTrainBos)
      .concat(foodBos)
      .concat(feederBos)
      .concat(spokenComprehensionBos)
      .concat(spokenAbilityBos)
      .concat(talkTrainBos);

    const postData = {
      patientId,
      isSwallowingReflexAbnormal: values.isSwallowingReflexAbnormal,
      mouthActivityLevel: values.mouthActivityLevel,
      mouthActivityTrainType: values.mouthActivityTrainType,
      proposalTarget: values.proposalTarget,
      spokenAbilityLevel: values.spokenAbilityLevel,
      spokenAbilityTrainType: values.spokenAbilityTrainType,
      spokenComprehensionLevel: values.spokenComprehensionLevel,
      spokenComprehensionTrainType: values.spokenComprehensionTrainType,
      swallowingAbilityInfo: values.swallowingAbilityInfo,
      swallowingReflexAbnormalInfo: values.swallowingReflexAbnormalInfo,
      swallowingTrainType: values.swallowingTrainType,
      talkTrainType: values.talkTrainType,
      abilityBos,
      trainWayBos,
    };

    dispatch({
      type: 'assessmentAndTrainingObjectives/createSaveLanguageInfo',
      payload: postData,
      callback: (res) => {
        res && message.success('操作成功');
      },
    });
  };

  const queryLanguageInfo = async () => {
    const values = await getLanguageInfo({ patientId });
    if (values && values.data === null) {
      // 该患者没有进行操作
      cancel();
      return;
    }

    function setBos(values, vosField, bosField, otherField, names, setNames, type) {
      let other = '';
      let bos = [];
      // values.vosField 是一个对象，不是数组
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

    const mouthActivityBos = setBos(
      values,
      'abilityVos',
      'mouthActivityBos',
      'otherMouthActivity',
      'mouthActivityListNames',
      setMouthActivityListNames,
      4,
    );

    const chokeFeedBos = setBos(values, 'abilityVos', 'chokeFeedBos', null, null, null, 6);

    const mouthActivityTrainBos = setBos(
      values,
      'trainWayVos',
      'mouthActivityTrainBos',
      'otherMouthActivityTrain',
      'mouthActivityTrainListNames',
      setMouthActivityTrainListNames,
      5,
    );

    const swallowingTrainBos = setBos(
      values,
      'trainWayVos',
      'swallowingTrainBos',
      'otherSwallowingTrain',
      'swallowingTrainListNames',
      setSwallowingTrainListNames,
      6,
    );
    const foodBos = setBos(
      values,
      'trainWayVos',
      'foodBos',
      'otherFood',
      'foodListNames',
      setFoodListNames,
      7,
    );

    const feederBos = setBos(
      values,
      'trainWayVos',
      'feederBos',
      'otherFeeder',
      'feederListNames',
      setFeederListNames,
      8,
    );

    const spokenComprehensionBos = setBos(
      values,
      'trainWayVos',
      'spokenComprehensionBos',
      'otherSpokenComprehension',
      'spokenComprehensionListNames',
      setSpokenComprehensionListNames,
      9,
    );

    const spokenAbilityBos = setBos(
      values,
      'trainWayVos',
      'spokenAbilityBos',
      'otherSpokenAbility',
      'spokenAbilityListNames',
      setSpokenAbilityListNames,
      10,
    );

    const talkTrainBos = setBos(
      values,
      'trainWayVos',
      'talkTrainBos',
      'otherTalkTrain',
      'talkTrainListNames',
      setTalkTrainListNames,
      11,
    );

    const setData = {
      ...mouthActivityBos,
      ...chokeFeedBos,
      ...mouthActivityTrainBos,
      ...swallowingTrainBos,
      ...foodBos,
      ...feederBos,
      ...spokenComprehensionBos,
      ...spokenAbilityBos,
      ...talkTrainBos,
      isSwallowingReflexAbnormal: values.isSwallowingReflexAbnormal,
      mouthActivityLevel: values.mouthActivityLevel,
      mouthActivityTrainType: values.mouthActivityTrainType,
      proposalTarget: values.proposalTarget,
      spokenAbilityLevel: values.spokenAbilityLevel,
      spokenAbilityTrainType: values.spokenAbilityTrainType,
      spokenComprehensionLevel: values.spokenComprehensionLevel,
      spokenComprehensionTrainType: values.spokenComprehensionTrainType,
      swallowingAbilityInfo: values.swallowingAbilityInfo,
      swallowingReflexAbnormalInfo: values.swallowingReflexAbnormalInfo,
      swallowingTrainType: values.swallowingTrainType,
      talkTrainType: values.talkTrainType,
    };
    form.setFieldsValue(setData);
  };

  const cancel = () => {
    form.resetFields();
    setMouthActivityListNames([]);
    setMouthActivityTrainListNames([]);
    setSwallowingTrainListNames([]);
    setFoodListNames([]);
    setFeederListNames([]);
    setSpokenComprehensionListNames([]);
    setSpokenAbilityListNames([]);
    setTalkTrainListNames([]);
  };

  useEffect(() => {
    queryEnums();
    queryAllTrainWay();
    queryAllAbility();
  }, []);

  useEffect(() => {
    if (patientId) {
      queryLanguageInfo();
    }
  }, [patientId]);

  return (
    <Form hideRequiredMark {...layout} form={form} onFinish={onFinish}>
      <Form.Item label="口腔动作">
        <Form.Item name="mouthActivityLevel" rules={[{ required: true, message: '请选择' }]}>
          <Radio.Group>
            {abilityLevelTypeList.map((item) => (
              <Radio key={item.code} value={item.code}>
                {item.codeCn}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="mouthActivityBos" rules={[{ required: true, message: '请选择' }]}>
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(
                arrId,
                mouthActivityListNames,
                setMouthActivityListNames,
                'otherMouthActivity',
              )
            }
            options={mouthActivityList}
          ></Checkbox.Group>
        </Form.Item>
        {mouthActivityListNames.includes('其他') && (
          <Form.Item name="otherMouthActivity">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        label="口腔功能训练"
        name="mouthActivityTrainType"
        rules={[{ required: true, message: '请选择口腔功能训练' }]}
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
        <Form.Item
          name="mouthActivityTrainBos"
          rules={[{ required: true, message: '请选择训练方向' }]}
        >
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(
                arrId,
                mouthActivityTrainListNames,
                setMouthActivityTrainListNames,
                'otherMouthActivityTrain',
              )
            }
            options={mouthActivityTrainList}
          ></Checkbox.Group>
        </Form.Item>
        {mouthActivityTrainListNames.includes('其他') && (
          <Form.Item name="otherMouthActivityTrain">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="吞咽反射">
        <Form.Item
          name="isSwallowingReflexAbnormal"
          rules={[{ required: true, message: '请选择吞咽反射' }]}
        >
          <Radio.Group onChange={onSwallowingReflexAbnormalChange}>
            {yesList.map((item) => (
              <Radio key={item.code} value={item.code}>
                {item.codeCn}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        {isSwallowingReflexAbnormal && (
          <Form.Item name="swallowingReflexAbnormalInfo">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        label="吞咽功能"
        name="swallowingAbilityInfo"
        rules={[{ required: true, message: '请选择吞咽功能' }]}
      >
        <Radio.Group>
          {abilityLevelTypeList.map((item) => (
            <Radio key={item.code} value={item.code}>
              {item.codeCn}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item label="会呛食" name="chokeFeedBos" rules={[{ required: true, message: '请选择' }]}>
        <Checkbox.Group options={chokeFeedList}></Checkbox.Group>
      </Form.Item>

      <Form.Item
        label="吞咽训练"
        name="swallowingTrainType"
        rules={[{ required: true, message: '请选择吞咽训练' }]}
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
        <Form.Item
          name="swallowingTrainBos"
          rules={[{ required: true, message: '请选择训练方向' }]}
        >
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(
                arrId,
                swallowingTrainListNames,
                setSwallowingTrainListNames,
                'otherSwallowingTrain',
              )
            }
            options={swallowingTrainList}
          ></Checkbox.Group>
        </Form.Item>
        {swallowingTrainListNames.includes('其他') && (
          <Form.Item name="otherSwallowingTrain">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="食物材质的选择">
        <Form.Item name="foodBos" rules={[{ required: true, message: '请选择' }]}>
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(arrId, foodListNames, setFoodListNames, 'otherFood')
            }
            options={foodList}
          ></Checkbox.Group>
        </Form.Item>
        {foodListNames.includes('其他') && (
          <Form.Item name="otherFood">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="食器的选择">
        <Form.Item name="feederBos" rules={[{ required: true, message: '请选择' }]}>
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(arrId, feederListNames, setFeederListNames, 'otherFeeder')
            }
            options={feederList}
          ></Checkbox.Group>
        </Form.Item>
        {feederListNames.includes('其他') && (
          <Form.Item name="otherFeeder">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        label="口语理解"
        name="spokenComprehensionLevel"
        rules={[{ required: true, message: '请选择口语理解' }]}
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
        label="理解训练"
        name="spokenComprehensionTrainType"
        rules={[{ required: true, message: '请选择理解训练' }]}
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
        <Form.Item
          name="spokenComprehensionBos"
          rules={[{ required: true, message: '请选择训练方向' }]}
        >
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(
                arrId,
                spokenComprehensionListNames,
                setSpokenComprehensionListNames,
                'otherSpokenComprehension',
              )
            }
            options={spokenComprehensionList}
          ></Checkbox.Group>
        </Form.Item>
        {spokenComprehensionListNames.includes('其他') && (
          <Form.Item name="otherSpokenComprehension">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        label="口语表达"
        name="spokenAbilityLevel"
        rules={[{ required: true, message: '请选择口语表达' }]}
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
        label="表达训练"
        name="spokenAbilityTrainType"
        rules={[{ required: true, message: '请选择表达训练' }]}
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
        <Form.Item name="spokenAbilityBos" rules={[{ required: true, message: '请选择训练方向' }]}>
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(
                arrId,
                spokenAbilityListNames,
                setSpokenAbilityListNames,
                'otherSpokenAbility',
              )
            }
            options={spokenAbilityList}
          ></Checkbox.Group>
        </Form.Item>
        {spokenAbilityListNames.includes('其他') && (
          <Form.Item name="otherSpokenAbility">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="说话" name="talkTrainType" rules={[{ required: true, message: '请选择' }]}>
        <Radio.Group>
          {trainType.map((item) => (
            <Radio key={item.code} value={item.code}>
              {item.codeCn}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item label="训练方向">
        <Form.Item name="talkTrainBos" rules={[{ required: true, message: '请选择训练方向' }]}>
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(arrId, talkTrainListNames, setTalkTrainListNames, 'otherTalkTrain')
            }
            options={talkTrainList}
          ></Checkbox.Group>
        </Form.Item>
        {talkTrainListNames.includes('其他') && (
          <Form.Item name="otherTalkTrain">
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
  submitting: loading.effects['assessmentAndTrainingObjectives/createSaveLanguageInfo'],
}))(Tab4);
