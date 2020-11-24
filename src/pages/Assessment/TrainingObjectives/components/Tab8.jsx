import React, { useState, useEffect } from 'react';
import { message, Form, Checkbox, Radio, Input, Button } from 'antd';
import { connect } from 'umi';

const haveOrNoList = [
  {
    codeCn: '需要',
    code: true,
  },
  {
    codeCn: '不需要',
    code: false,
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

import { getAllAssistive, getTrainEnvInfo } from '@/pages/Assessment/TrainingObjectives/service';

const Tab8 = ({ patientId, submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [trainType, setTrainType] = useState([]);
  const [upList, setUpList] = useState([]);
  const [upListNames, setUpListNames] = useState([]);

  const [downList, setDownList] = useState([]);
  const [downListNames, setDownListNames] = useState([]);

  const [bWList, setBWList] = useState([]);
  const [bWListNames, setBWListNames] = useState([]);

  const [yWList, setYWList] = useState([]);
  const [yWListNames, setYWListNames] = useState([]);

  const [communicateList, setCommunicateList] = useState([]);
  const [communicateListNames, setCommunicateListNames] = useState([]);

  const [liveList, setLiveList] = useState([]);
  const [liveListNames, setLiveListNames] = useState([]);

  const [seeList, setSeeList] = useState([]);
  const [seeListNames, setSeeListNames] = useState([]);

  const queryEnums = async () => {
    const newArr = await queryCommonAllEnums();
    setTrainType(getSingleEnums('TrainType', newArr)); // 不需要，需要追踪咨询，需要训练
  };

  const queryAllAssistive = async () => {
    const res = await getAllAssistive();
    const data = res?.map((item) => {
      item.label = item.name;
      item.value = item.id + '-' + item.name;
      return item;
    });
    setUpList(data.filter((item) => item.type === 1));
    setDownList(data.filter((item) => item.type === 2));
    setBWList(data.filter((item) => item.type === 3)); // 摆位辅具
    setYWList(data.filter((item) => item.type === 4)); // 移位辅具
    setCommunicateList(data.filter((item) => item.type === 5)); // 沟通辅具
    setLiveList(data.filter((item) => item.type === 6)); // 日常生活辅具
    setSeeList(data.filter((item) => item.type === 7)); // 视、听觉辅具
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
    function getBos(values, bos, otherField) {
      const newBos = [];
      values[bos]?.forEach((item) => {
        newBos.push({
          assistiveId: item.split('-')[0],
          isOther: item.split('-')[1] === '其他',
          other: values[otherField] || '',
        });
      });
      return newBos;
    }

    const upBos = getBos(values, 'upBos', 'otherUp');
    const downBos = getBos(values, 'downBos', 'otherDown');
    const bWBos = getBos(values, 'bWBos', 'otherBw');
    const yWBos = getBos(values, 'yWBos', 'otherYw');
    const communicateBos = getBos(values, 'communicateBos', 'otherCommunicate');
    const liveBos = getBos(values, 'liveBos', 'otherLive');
    const seeBos = getBos(values, 'seeBos', 'otherSee');
    const assistiveBos = upBos
      .concat(downBos)
      .concat(bWBos)
      .concat(yWBos)
      .concat(communicateBos)
      .concat(liveBos)
      .concat(seeBos);

    const postData = {
      patientId,
      assistiveTrainType: values.assistiveTrainType,
      haveOtherDemand: values.haveOtherDemand,
      proposalTarget: values.proposalTarget,
      assistiveBos,
    };
    dispatch({
      type: 'assessmentAndTrainingObjectives/createSaveTrainEnv',
      payload: postData,
      callback: (res) => {
        res && message.success('操作成功');
      },
    });
  };

  const queryTrainEnvInfo = async () => {
    const values = await getTrainEnvInfo({ patientId });
    if (values && values.data === null) {
      // 该患者没有进行操作
      cancel();
      return;
    }
    function setBos(values, bosField, otherField, names, setNames, type) {
      let other = '';
      let bos = [];
      values.assistiveVos?.forEach((item) => {
        if (item.type === type) {
          bos.push(`${item.id}-${item.name}`);
          other = item.isOther ? item.other : '';
        }
      });
      onHandleChange(bos, names, setNames, otherField);
      return {
        [bosField]: bos,
        [otherField]: other,
      };
    }
    const upBos = setBos(values, 'upBos', 'otherUp', 'upListNames', setUpListNames, 1);
    const downBos = setBos(values, 'downBos', 'otherDown', 'downListNames', setDownListNames, 2);
    const bWBos = setBos(values, 'bWBos', 'otherBw', 'bWListNames', setBWListNames, 3);
    const yWBos = setBos(values, 'yWBos', 'otherYw', 'yWListNames', setYWListNames, 4);
    const communicateBos = setBos(
      values,
      'communicateBos',
      'otherCommunicate',
      'communicateListNames',
      setCommunicateListNames,
      5,
    );
    const liveBos = setBos(values, 'liveBos', 'otherLive', 'liveListNames', setLiveListNames, 6);
    const seeBos = setBos(values, 'seeBos', 'otherSee', 'seeListNames', setSeeListNames, 7);

    const setData = {
      ...upBos,
      ...downBos,
      ...bWBos,
      ...yWBos,
      ...communicateBos,
      ...liveBos,
      ...seeBos,
      assistiveTrainType: values.assistiveTrainType,
      haveOtherDemand: values.haveOtherDemand,
      proposalTarget: values.proposalTarget,
    };
    form.setFieldsValue(setData);
  };

  const cancel = () => {
    form.resetFields();
    setUpListNames([]);
    setDownListNames([]);
    setBWListNames([]);
    setYWListNames([]);
    setCommunicateListNames([]);
    setLiveListNames([]);
    setSeeListNames([]);
  };

  useEffect(() => {
    queryAllAssistive();
    queryEnums();
  }, []);

  useEffect(() => {
    if (patientId) {
      queryTrainEnvInfo();
    }
  }, [patientId]);
  return (
    <Form hideRequiredMark {...layout} form={form} onFinish={onFinish}>
      <Form.Item
        labelCol={{ span: 6 }}
        label="无障碍环境协商与设计及其他需求"
        name="haveOtherDemand"
        rules={[{ required: true, message: '请选择' }]}
      >
        <Radio.Group>
          {haveOrNoList.map((item) => (
            <Radio key={item.code} value={item.code}>
              {item.codeCn}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label="具体建议" name="proposalTarget">
        <Input.TextArea rows={4}></Input.TextArea>
      </Form.Item>
      <Form.Item
        label="辅具需求"
        name="assistiveTrainType"
        rules={[{ required: true, message: '请选择辅具需求' }]}
      >
        <Radio.Group>
          {trainType.map((item) => (
            <Radio key={item.code} value={item.code}>
              {item.codeCn}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item label="上肢副木与辅具">
        <Form.Item name="upBos" rules={[{ required: true, message: '请选择上肢副木与辅具' }]}>
          <Checkbox.Group
            onChange={(arrId) => onHandleChange(arrId, upListNames, setUpListNames, 'otherUp')}
            options={upList}
          ></Checkbox.Group>
        </Form.Item>
        {upListNames.includes('其他') && (
          <Form.Item name="otherUp">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="下肢副木与辅具">
        <Form.Item name="downBos" rules={[{ required: true, message: '请选择下肢副木与辅具' }]}>
          <Checkbox.Group
            onChange={(arrId) => onHandleChange(arrId, downListNames, setDownListNames, 'otherDown')}
            options={downList}
          ></Checkbox.Group>
        </Form.Item>
        {downListNames.includes('其他') && (
          <Form.Item name="otherDown">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="摆位辅具">
        <Form.Item name="bWBos" rules={[{ required: true, message: '请选择摆位辅具' }]}>
          <Checkbox.Group
            onChange={(arrId) => onHandleChange(arrId, bWListNames, setBWListNames, 'otherBw')}
            options={bWList}
          ></Checkbox.Group>
        </Form.Item>
        {bWListNames.includes('其他') && (
          <Form.Item name="otherBw">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="移位辅具">
        <Form.Item name="yWBos" rules={[{ required: true, message: '请选择移位辅具' }]}>
          <Checkbox.Group
            onChange={(arrId) => onHandleChange(arrId, yWListNames, setYWListNames, 'otherYw')}
            options={yWList}
          ></Checkbox.Group>
        </Form.Item>
        {yWListNames.includes('其他') && (
          <Form.Item name="otherYw">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="沟通辅具">
        <Form.Item name="communicateBos" rules={[{ required: true, message: '请选择沟通辅具' }]}>
          <Checkbox.Group
            onChange={(arrId) =>
              onHandleChange(arrId, communicateListNames, setCommunicateListNames, 'otherCommunicate')
            }
            options={communicateList}
          ></Checkbox.Group>
        </Form.Item>
        {communicateListNames.includes('其他') && (
          <Form.Item name="otherCommunicate">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="日常生活辅具">
        <Form.Item name="liveBos" rules={[{ required: true, message: '请选择日常生活辅具' }]}>
          <Checkbox.Group
            onChange={(arrId) => onHandleChange(arrId, liveListNames, setLiveListNames, 'otherLive')}
            options={liveList}
          ></Checkbox.Group>
        </Form.Item>
        {liveListNames.includes('其他') && (
          <Form.Item name="otherLive">
            <Input />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label="视、听觉辅具">
        <Form.Item name="seeBos" rules={[{ required: true, message: '请选择视、听觉辅具' }]}>
          <Checkbox.Group
            onChange={(arrId) => onHandleChange(arrId, seeListNames, setSeeListNames, 'otherSee')}
            options={seeList}
          ></Checkbox.Group>
        </Form.Item>
        {seeListNames.includes('其他') && (
          <Form.Item name="otherSee">
            <Input />
          </Form.Item>
        )}
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
  submitting: loading.effects['assessmentAndTrainingObjectives/createSaveTrainEnv'],
}))(Tab8);
