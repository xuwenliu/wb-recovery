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
  getTrainSelfCareInfo,
} from '@/pages/Assessment/TrainingObjectives/service';

const Tab5 = ({ patientId, submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [trainType, setTrainType] = useState([]);
  const [abilityLevelTypeList, setAbilityLevelTypeList] = useState([]);

  const [earAbilityTrainList, setEarAbilityTrainList] = useState([]);
  const [earAbilityTrainListNames, setEarAbilityTrainListNames] = useState([]);

  const [aboutClothesList, setAboutClothesList] = useState([]);
  const [aboutClothesListNames, setAboutClothesListNames] = useState([]);

  const [aboutClothesTrainList, setAboutClothesTrainList] = useState([]);
  const [aboutClothesTrainListNames, setAboutClothesTrainListNames] = useState([]);

  const [toiletList, setToiletList] = useState([]);
  const [toiletListNames, setToiletListNames] = useState([]);

  const [washAbilityList, setWashAbilityList] = useState([]);
  const [washAbilityListNames, setWashAbilityListNames] = useState([]);

  const [washAbilityTrainList, setWashAbilityTrainBos] = useState([]);
  const [washAbilityTrainListNames, setWashAbilityTrainListNames] = useState([]);

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
    setEarAbilityTrainList(data.filter((item) => item.type === 12));
    setAboutClothesTrainList(data.filter((item) => item.type === 13));
    setWashAbilityTrainBos(data.filter((item) => item.type === 14));
  };

  const queryAllAbility = async () => {
    const res = await getAllAbility();
    const data = res?.map((item) => {
      item.label = item.name;
      item.value = item.id + '-' + item.name;
      return item;
    });
    setWashAbilityList(data.filter((item) => item.type === 1));
    setToiletList(data.filter((item) => item.type === 2));
    setAboutClothesList(data.filter((item) => item.type === 5));
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

    const washAbilityBos = getBos(values, 'washAbilityBos', 'otherWashAbility', 'abilityId');
    const toiletBos = getBos(values, 'toiletBos', 'otherToilet', 'abilityId');
    const aboutClothesBos = getBos(values, 'aboutClothesBos', 'otherAboutClothes', 'abilityId');
    const abilityBos = washAbilityBos.concat(toiletBos).concat(aboutClothesBos);

    const earAbilityTrainBos = getBos(
      values,
      'earAbilityTrainBos',
      'otherEarAbilityTrain',
      'trainWayId',
    );

    const aboutClothesTrainBos = getBos(
      values,
      'aboutClothesTrainBos',
      'otherAboutClothesTrain',
      'trainWayId',
    );
    const washAbilityTrainBos = getBos(
      values,
      'washAbilityTrainBos',
      'otherWashAbilityTrain',
      'trainWayId',
    );

    const trainWayBos = earAbilityTrainBos.concat(aboutClothesTrainBos).concat(washAbilityTrainBos);

    const postData = {
      patientId,
      aboutClothesAbilityLevel: values.aboutClothesAbilityLevel,
      aboutClothesTrainType: values.aboutClothesTrainType,
      earAbilityTrainType: values.earAbilityTrainType,
      eatAbilityLevel: values.eatAbilityLevel,
      isObserved: values.isObserved,
      isTalk: values.isTalk,
      isWashObserved: values.isWashObserved,
      isWashTalk: values.isWashTalk,
      proposalTarget: values.proposalTarget,
      washAbilityLevel: values.washAbilityLevel,
      washAbilityTrainType: values.washAbilityTrainType,
      abilityBos,
      trainWayBos,
    };

    dispatch({
      type: 'assessmentAndTrainingObjectives/createSaveTrainSelfCare',
      payload: postData,
      callback: (res) => {
        res && message.success('操作成功');
      },
    });
  };

  const queryTrainSelfCareInfo = async () => {
    const values = await getTrainSelfCareInfo({ patientId });
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

    const washAbilityBos = setBos(
      values,
      'abilityVos',
      'washAbilityBos',
      'otherWashAbility',
      'washAbilityListNames',
      setWashAbilityListNames,
      1,
    );

    const toiletBos = setBos(
      values,
      'abilityVos',
      'toiletBos',
      'otherToilet',
      'toiletListNames',
      setToiletListNames,
      2,
    );
    const aboutClothesBos = setBos(
      values,
      'abilityVos',
      'aboutClothesBos',
      'otherAboutClothes',
      'aboutClothesListNames',
      setAboutClothesListNames,
      5,
    );

    const earAbilityTrainBos = setBos(
      values,
      'trainWayVos',
      'earAbilityTrainBos',
      'otherEarAbilityTrain',
      'earAbilityTrainListNames',
      setEarAbilityTrainListNames,
      12,
    );

    const aboutClothesTrainBos = setBos(
      values,
      'trainWayVos',
      'aboutClothesTrainBos',
      'otherAboutClothesTrain',
      'aboutClothesTrainListNames',
      setAboutClothesTrainListNames,
      13,
    );

    const washAbilityTrainBos = setBos(
      values,
      'trainWayVos',
      'washAbilityTrainBos',
      'otherWashAbilityTrain',
      'washAbilityTrainListNames',
      setWashAbilityTrainListNames,
      14,
    );

    const setData = {
      ...washAbilityBos,
      ...toiletBos,
      ...aboutClothesBos,
      ...earAbilityTrainBos,
      ...aboutClothesTrainBos,
      ...washAbilityTrainBos,
      aboutClothesAbilityLevel: values.aboutClothesAbilityLevel,
      aboutClothesTrainType: values.aboutClothesTrainType,
      earAbilityTrainType: values.earAbilityTrainType,
      eatAbilityLevel: values.eatAbilityLevel,
      isObserved: values.isObserved,
      isTalk: values.isTalk,
      isWashObserved: values.isWashObserved,
      isWashTalk: values.isWashTalk,
      proposalTarget: values.proposalTarget,
      washAbilityLevel: values.washAbilityLevel,
      washAbilityTrainType: values.washAbilityTrainType,
    };
    form.setFieldsValue(setData);
  };

  const cancel = () => {
    form.resetFields();
    setEarAbilityTrainListNames([]);
    setAboutClothesTrainListNames([]);
    setWashAbilityListNames([]);
    setToiletListNames([]);
    setWashAbilityTrainListNames([]);
  };
  useEffect(() => {
    queryEnums();
    queryAllTrainWay();
    queryAllAbility();
  }, []);

  useEffect(() => {
    if (patientId) {
      queryTrainSelfCareInfo();
    }
  }, [patientId]);

  return (
    <Form hideRequiredMark {...layout} form={form} onFinish={onFinish}>
      <Form.Item
        label="饮食"
        name="eatAbilityLevel"
        rules={[{ required: true, message: '请选择' }]}
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
        label="饮食训练"
        name="earAbilityTrainType"
        rules={[{ required: true, message: '请选择饮食训练' }]}
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
          name="earAbilityTrainBos"
          rules={[{ required: true, message: '请选择训练方向' }]}
        >
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(
                arrId,
                earAbilityTrainListNames,
                setEarAbilityTrainListNames,
                'otherEarAbilityTrain',
              )
            }
            options={earAbilityTrainList}
          ></Checkbox.Group>
        </Form.Item>
        {earAbilityTrainListNames.includes('其他') && (
          <Form.Item name="otherEarAbilityTrain">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        label="穿脱衣"
        name="aboutClothesAbilityLevel"
        rules={[{ required: true, message: '请选择' }]}
      >
        <Radio.Group>
          {trainType.map((item) => (
            <Radio key={item.code} value={item.code}>
              {item.codeCn}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item label="评估方法与结果">
        <div style={{ display: 'flex' }}>
          <Form.Item name="isObserved" valuePropName="checked">
            <Checkbox>临床观察</Checkbox>
          </Form.Item>
          <Form.Item name="isTalk" valuePropName="checked">
            <Checkbox>临床晤谈</Checkbox>
          </Form.Item>
        </div>
        <Form.Item name="aboutClothesBos" rules={[{ required: true, message: '请选择' }]}>
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(
                arrId,
                aboutClothesListNames,
                setAboutClothesListNames,
                'otherAboutClothes',
              )
            }
            options={aboutClothesList}
          ></Checkbox.Group>
        </Form.Item>
        {aboutClothesListNames.includes('其他') && (
          <Form.Item name="otherAboutClothes">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        label="穿衣训练"
        name="aboutClothesTrainType"
        rules={[{ required: true, message: '请选择穿衣训练' }]}
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
          name="aboutClothesTrainBos"
          rules={[{ required: true, message: '请选择训练方向' }]}
        >
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(
                arrId,
                aboutClothesTrainListNames,
                setAboutClothesTrainListNames,
                'otherAboutClothesTrain',
              )
            }
            options={aboutClothesTrainList}
          ></Checkbox.Group>
        </Form.Item>
        {aboutClothesTrainListNames.includes('其他') && (
          <Form.Item name="otherAboutClothesTrain">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        label="盥洗卫生"
        name="washAbilityLevel"
        rules={[{ required: true, message: '请选择盥洗卫生' }]}
      >
        <Radio.Group>
          {trainType.map((item) => (
            <Radio key={item.code} value={item.code}>
              {item.codeCn}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item label="评估方法">
        <div style={{ display: 'flex' }}>
          <Form.Item name="isWashObserved" valuePropName="checked">
            <Checkbox>临床观察</Checkbox>
          </Form.Item>
          <Form.Item name="isWashTalk" valuePropName="checked">
            <Checkbox>临床晤谈</Checkbox>
          </Form.Item>
        </div>
      </Form.Item>

      <Form.Item label="盥洗">
        <Form.Item name="washAbilityBos" rules={[{ required: true, message: '请选择' }]}>
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(
                arrId,
                washAbilityListNames,
                setWashAbilityListNames,
                'otherWashAbility',
              )
            }
            options={washAbilityList}
          ></Checkbox.Group>
        </Form.Item>
        {washAbilityListNames.includes('其他') && (
          <Form.Item name="otherWashAbility">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="如厕">
        <Form.Item name="toiletBos" rules={[{ required: true, message: '请选择' }]}>
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(arrId, toiletListNames, setToiletListNames, 'otherToilet')
            }
            options={toiletList}
          ></Checkbox.Group>
        </Form.Item>
        {toiletListNames.includes('其他') && (
          <Form.Item name="otherToilet">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        label="盥洗训练"
        name="washAbilityTrainType"
        rules={[{ required: true, message: '请选择' }]}
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
          name="washAbilityTrainBos"
          rules={[{ required: true, message: '请选择训练方向' }]}
        >
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(
                arrId,
                washAbilityTrainListNames,
                setWashAbilityTrainListNames,
                'otherWashAbilityTrain',
              )
            }
            options={washAbilityTrainList}
          ></Checkbox.Group>
        </Form.Item>
        {washAbilityTrainListNames.includes('其他') && (
          <Form.Item name="otherWashAbilityTrain">
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
  submitting: loading.effects['assessmentAndTrainingObjectives/createSaveTrainSelfCare'],
}))(Tab5);
