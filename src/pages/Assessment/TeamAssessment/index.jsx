import React, { useState, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Card, Image, Row, Col, Checkbox, Radio, Input, Button, Form, message, Space } from 'antd';
import { connect, history } from 'umi';
import BaseInfoShow from '@/components/BaseInfoShow';
import xiaozu from '@/assets/img/xiaozu.png';
import './index.less';
import { queryCommonAllEnums, getSingleEnums, getAuth } from '@/utils/utils';
import { getAllDiseaseReason, getAllDisease, getGroupAssessSingle } from './service';

const haveOrNoList = [
  {
    codeCn: '有',
    code: true,
  },
  {
    codeCn: '无',
    code: false,
  },
];

const TeamAssessment = ({ submitting, dispatch }) => {
  const [form] = Form.useForm();
  const [patientId, setPatientId] = useState();
  const [info, setInfo] = useState();
  const [yesList, setYesList] = useState([]);
  const [diseaseTypeList, setDiseaseTypeList] = useState([]);
  // const [abilityLevelTypeList, setAbilityLevelTypeList] = useState([]);
  const [abnormalTypeList, setAbnormalTypeList] = useState([]);

  const [allDiseaseReason, setAllDiseaseReason] = useState([]); // 病因分类
  const [diseaseReasonBosNames, setDiseaseReasonBosNames] = useState([]); // 病因分类-names
  const [nerveDiseaseList, setNerveDiseaseList] = useState([]); // 神经相关疾病
  const [nerveDiseaseNames, setNerveDiseaseNames] = useState([]); // 神经相关疾病-names

  const [senseDiseaseList, setSenseDiseaseList] = useState([]); // 感官异常
  const [senseDiseaseNames, setSenseDiseaseNames] = useState([]); // 感官异常-听力和视力

  const [geneticDiseaseList, setGeneticDiseaseList] = useState([]); // 遗传、先天症候群
  const [geneticDiseaseNames, setGeneticDiseaseNames] = useState([]); // 遗传、先天症候群-names

  const [cognitionLevelList, setCognitionLevelList] = useState([]); // 认知发展
  const [languageLevelList, setLanguageLevelList] = useState([]); // 语言发展
  const [languageLevelNames, setLanguageLevelNames] = useState([]); // 语言发展-names

  const [perceptionLevelList, setPerceptionLevelList] = useState([]); // 知觉动作发展
  const [perceptionLevelNames, setPerceptionLevelNames] = useState([]); // 知觉动作发展-names

  const [socialMoodLevelList, setSocialMoodLevelList] = useState([]); // 社会情绪发展
  const [socialMoodLevelNames, setSocialMoodLevelNames] = useState([]); // 社会情绪发展-names

  const [activeLevelList, setActiveLevelList] = useState([]); // 行为
  const [activeLevelNames, setActiveLevelNames] = useState([]); // 行为-names

  const onPatientIdChange = (id) => {
    setPatientId(id);
  };
  const onAllInfoChange = (info) => {
    setInfo(info);
  };

  const queryEnums = async () => {
    const newArr = await queryCommonAllEnums();
    const yesData = getSingleEnums('DiseaseConfirmType', newArr); //确定 可能
    const yesOptions = yesData.filter(item => item.code !== 3).map((item) => {
      item.label = item.codeCn;
      item.value = item.code;
      return item;
    });
    setYesList(yesOptions);
    // setAbilityLevelTypeList(getSingleEnums('AbilityLevelType', newArr)); //无异常，疑似发展迟缓，发展迟缓
    setAbnormalTypeList(getSingleEnums('AbnormalType', newArr)); //无异常，异常，疑似异常

    const diseaseTypeData = getSingleEnums('DiseaseType', newArr);
    const diseaseTypeListOptions = diseaseTypeData.map((item) => {
      item.label = item.codeCn;
      item.value = item.code;
      return item;
    });
    setDiseaseTypeList(diseaseTypeListOptions); //
  };

  // 所有病因
  const queryAllDiseaseReason = async () => {
    const res = await getAllDiseaseReason();
    const options = res?.map((item) => {
      item.reasonId = item.id;
      return item;
    });
    form.setFields([
      {
        name: 'diseaseReasonBos',
        value: options,
      },
    ]);
  };

  const queryAllDisease = async () => {
    const res = await getAllDisease();
    const options = res?.map((item) => {
      item.label = item.name;
      item.value = item.id + '-' + item.name;
      return item;
    });
    setNerveDiseaseList(options.filter((item) => item.type === 1));
    setSenseDiseaseList(options.filter((item) => item.type === 2));
    setGeneticDiseaseList(options.filter((item) => item.type === 3));
    setCognitionLevelList(options.filter((item) => item.type === 4));
    setLanguageLevelList(options.filter((item) => item.type === 5));
    setPerceptionLevelList(options.filter((item) => item.type === 6));
    setSocialMoodLevelList(options.filter((item) => item.type === 7));
    setActiveLevelList(options.filter((item) => item.type === 8));
  };

  const onAllDiseaseReasonChange = (arrId, noClear) => {
    console.log(arrId);
    const nameList = [];
    arrId.forEach((item) => {
      const name = item.split('-')[1];
      nameList.push(name);
    });
    if (!noClear) {
      if (!nameList.includes('其他')) {
        form.setFields([
          {
            name: 'other',
            value: '',
          },
        ]);
      }
    }

    setDiseaseReasonBosNames(nameList);
  };
  const onSetNerveDiseaseNoChange = (e) => {
    if (!e.target.value) {
      form.setFields([
        {
          name: 'nerveDisease',
          value: [],
        },
        {
          name: 'otherNerveDisease',
          value: '',
        },
      ]);
      setNerveDiseaseNames([]);
    }
  };
  const onNerveDiseaseChange = (arrId, noClear) => {
    console.log('arrId', arrId);
    const nameList = [];
    arrId.forEach((item) => {
      const name = item.split('-')[1];
      nameList.push(name);
    });
    if (!noClear) {
      if (!nameList.includes('其他')) {
        form.setFields([
          {
            name: 'otherNerveDisease',
            value: '',
          },
        ]);
      }
    }

    form.setFields([
      {
        name: 'haveNerveDisease',
        value: arrId.length !== 0,
      },
    ]);

    setNerveDiseaseNames(nameList);
  };
  const onSetSenseDiseaseNoChange = (e) => {
    if (!e.target.value) {
      form.setFields([
        {
          name: 'senseDisease',
          value: [],
        },
        {
          name: 'hearing',
          value: '',
        },
        {
          name: 'vision',
          value: '',
        },
      ]);
      setSenseDiseaseNames([]);
    }
  };
  const onSenseDiseaseChange = (arrId, noClear) => {
    const nameList = [];
    arrId.forEach((item) => {
      const name = item.split('-')[1];
      nameList.push(name);
    });
    if (!noClear) {
      if (!nameList.includes('听力障碍')) {
        form.setFields([
          {
            name: 'hearing',
            value: '',
          },
        ]);
      }
      if (!nameList.includes('视力障碍')) {
        form.setFields([
          {
            name: 'vision',
            value: '',
          },
        ]);
      }
    }

    form.setFields([
      {
        name: 'haveSenseDisease',
        value: arrId.length !== 0,
      },
    ]);
    setSenseDiseaseNames(nameList);
  };

  const onSetHaveGeneticDiseaseNoChange = (e) => {
    if (!e.target.value) {
      form.setFields([
        {
          name: 'geneticDisease',
          value: [],
        },
        {
          name: 'otherGeneticDisease',
          value: '',
        },
      ]);
      setGeneticDiseaseNames([]);
    }
  };
  const onGeneticDiseaseChange = (arrId, noClear) => {
    const nameList = [];
    arrId.forEach((item) => {
      const name = item.split('-')[1];
      nameList.push(name);
    });
    if (!noClear) {
      if (!nameList.includes('其他')) {
        form.setFields([
          {
            name: 'otherGeneticDisease',
            value: '',
          },
        ]);
      }
    }

    form.setFields([
      {
        name: 'haveGeneticDisease',
        value: arrId.length !== 0,
      },
    ]);
    setGeneticDiseaseNames(nameList);
  };

  const onLanguageLevelChange = (arrId, noClear) => {
    const nameList = [];
    arrId.forEach((item) => {
      const name = item.split('-')[1];
      nameList.push(name);
    });
    if (!noClear) {
      if (!nameList.includes('其他')) {
        form.setFields([
          {
            name: 'otherLanguageLevel',
            value: '',
          },
        ]);
      }
    }

    setLanguageLevelNames(nameList);
  };

  const onPerceptionLevelChange = (arrId, noClear) => {
    const nameList = [];
    arrId.forEach((item) => {
      const name = item.split('-')[1];
      nameList.push(name);
    });
    if (!noClear) {
      if (!nameList.includes('其他')) {
        form.setFields([
          {
            name: 'otherPerceptionLevel',
            value: '',
          },
        ]);
      }
    }

    setPerceptionLevelNames(nameList);
  };

  const onSocialMoodLevelChange = (arrId, noClear) => {
    const nameList = [];
    arrId.forEach((item) => {
      const name = item.split('-')[1];
      nameList.push(name);
    });
    if (!noClear) {
      if (!nameList.includes('其他')) {
        form.setFields([
          {
            name: 'otherSocialMoodLevel',
            value: '',
          },
        ]);
      }
    }
    setSocialMoodLevelNames(nameList);
  };

  const onActiveChange = (arrId, noClear) => {
    const nameList = [];
    arrId.forEach((item) => {
      const name = item.split('-')[1];
      nameList.push(name);
    });
    if (!noClear) {
      if (!nameList.includes('其他')) {
        form.setFields([
          {
            name: 'otherActiveLevel',
            value: '',
          },
        ]);
      }
    }
    setActiveLevelNames(nameList);
  };

  const getDiseaseBos = (values, field, otherField) => {
    const data = [];
    values[field]?.forEach((item) => {
      const isOther = item.split('-')[1] === '其他';
      const pushData = {
        diseaseId: item.split('-')[0],
        isOther,
        other: otherField ? values[otherField] : '',
      };
      data.push(pushData);
    });
    return data;
  };

  const getNerve = (values, arrField, type, otherField, changeFunc) => {
    let arr = [];
    let other = '';

    if (type === 2) {
      values.diseaseConnectVos
        ?.filter((item) => item.type === type)
        .forEach((item) => {
          arr.push(`${item.diseaseId}-${item.name}`);
        });
      changeFunc && changeFunc(arr, true);
      return {
        [arrField]: arr,
        hearing: values.hearing,
        vision: values.vision,
      };
    } else {
      values.diseaseConnectVos
        ?.filter((item) => item.type === type)
        .forEach((item) => {
          arr.push(`${item.diseaseId}-${item.name}`);
          if (item.isOther) {
            other = item.other;
          }
        });
      changeFunc && changeFunc(arr, true);
      return {
        [arrField]: arr,
        [otherField]: other,
      };
    }
  };

  const queryGroupAssessSingle = async () => {
    const values = await getGroupAssessSingle({
      patientId,
    });

    // 病因分类
    if (!values.diseaseReasonConnectVos) {
      queryAllDiseaseReason();
    }

    // 神经相关疾病
    const nerveDisease = getNerve(
      values,
      'nerveDisease',
      1,
      'otherNerveDisease',
      onNerveDiseaseChange,
    );
    // 感官异常
    const senseDisease = getNerve(values, 'senseDisease', 2, null, onSenseDiseaseChange);

    // 遗传、先天症候群
    const geneticDisease = getNerve(
      values,
      'geneticDisease',
      3,
      'otherGeneticDisease',
      onGeneticDiseaseChange,
    );

    //认知发展
    const cognitionLevelBos = getNerve(values, 'cognitionLevelBos', 4);

    // 语言发展
    const languageLevelBos = getNerve(
      values,
      'languageLevelBos',
      5,
      'otherLanguageLevel',
      onLanguageLevelChange,
    );

    // 知觉动作发展
    const perceptionLevelBos = getNerve(
      values,
      'perceptionLevelBos',
      6,
      'otherPerceptionLevel',
      onPerceptionLevelChange,
    );

    // 社会情绪发展
    const socialMoodLevelBos = getNerve(
      values,
      'socialMoodLevelBos',
      7,
      'otherSocialMoodLevel',
      onSocialMoodLevelChange,
    );

    // 行为
    const activeLevelBos = getNerve(
      values,
      'activeLevelBos',
      8,
      'otherActiveLevel',
      onActiveChange,
    );

    const setData = {
      diseaseConfirmType: values.diseaseConfirmType, // 病因分类
      diseaseReasonBos: values.diseaseReasonConnectVos,
      haveNerveDisease: values.haveNerveDisease, //神经相关疾病
      ...nerveDisease,

      haveSenseDisease: values.haveSenseDisease, //感官异常
      ...senseDisease,

      haveGeneticDisease: values.haveGeneticDisease, //遗传、先天症候群
      ...geneticDisease,

      cognitionLevel: values.cognitionLevel, //认知发展
      ...cognitionLevelBos,

      languageLevel: values.languageLevel, // 语言发展
      ...languageLevelBos,

      perceptionLevel: values.perceptionLevel, // 知觉动作发展
      ...perceptionLevelBos,

      socialMoodLevel: values.socialMoodLevel, // 社会情绪发展
      ...socialMoodLevelBos,

      activeLevel: values.activeLevel, // 行为
      ...activeLevelBos,
    };

    form.setFieldsValue(setData);
  };

  const submit = async () => {
    if (!patientId) {
      return message.info('请先获取患者信息');
    }
    const values = await form.validateFields();
    console.log(values);
    const diseaseReasonBos = [];
    values.diseaseReasonBos?.forEach((item) => {
      const pushData = {
        diseaseConfirmType: item.diseaseConfirmType || 3,
        reasonId: item.reasonId,
        isOther: item.other ? true : false,
        other: item.other || '',
      };

      diseaseReasonBos.push(pushData);
    });

    // 病症
    const nerveDisease = getDiseaseBos(values, 'nerveDisease', 'otherNerveDisease'); // 神经相关疾病
    const senseDisease = getDiseaseBos(values, 'senseDisease'); // 感官异常
    const geneticDisease = getDiseaseBos(values, 'geneticDisease', 'otherGeneticDisease'); // 遗传、先天症候群
    const cognitionLevelBos = getDiseaseBos(values, 'cognitionLevelBos'); // 认知发展
    const languageLevelBos = getDiseaseBos(values, 'languageLevelBos', 'otherLanguageLevel'); // 语言发展
    const perceptionLevelBos = getDiseaseBos(values, 'perceptionLevelBos', 'otherPerceptionLevel'); // 知觉动作发展
    const socialMoodLevelBos = getDiseaseBos(values, 'socialMoodLevelBos', 'otherSocialMoodLevel'); // 社会情绪发展
    const activeLevelBos = getDiseaseBos(values, 'activeLevelBos', 'otherActiveLevel'); // 行为

    const diseaseBos = nerveDisease
      .concat(senseDisease)
      .concat(geneticDisease)
      .concat(cognitionLevelBos)
      .concat(languageLevelBos)
      .concat(perceptionLevelBos)
      .concat(socialMoodLevelBos)
      .concat(activeLevelBos);

    const postData = {
      patientId,
      diseaseConfirmType: values.diseaseConfirmType,
      diseaseReasonBos, // 病因
      diseaseBos, // 病症
      haveNerveDisease: values.haveNerveDisease,
      haveSenseDisease: values.haveSenseDisease, // 感官异常
      haveGeneticDisease: values.haveGeneticDisease, // 遗传、先天症候群
      cognitionLevel: values.cognitionLevel, // 认知发展
      languageLevel: values.languageLevel, // 语言发展
      perceptionLevel: values.perceptionLevel, // 知觉动作发展
      socialMoodLevel: values.socialMoodLevel, // 社会情绪发展
      activeLevel: values.activeLevel, // 行为
      vision: values.vision, // 视力
      hearing: values.hearing, // 听力
    };
    console.log('postData', postData);
    dispatch({
      type: 'assessmentAndTeamAssessment/create',
      payload: postData,
      callback: (res) => {
        res && message.success('操作成功');
      },
    });
  };
  useEffect(() => {
    queryEnums();
    queryAllDiseaseReason();
    queryAllDisease();
  }, []);

  useEffect(() => {
    if (patientId) {
      queryGroupAssessSingle();
    }
  }, [patientId]);

  return (
    <PageContainer className="team-assessment">
      <BaseInfoShow
        newUrl="getAllCaseCode"
        onPatientIdChange={onPatientIdChange}
        onAllInfoChange={onAllInfoChange}
      />
      <div className="group-title">
        <Image preview={false} className="mr8" width={43} height={37} src={xiaozu} />
        小组评估
      </div>
      <Form form={form}>
        <Row>
          <Col span={24}>
            <Card bordered={false} className="card-title" title="病因分类">
              <Form.List name="diseaseReasonBos">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Space key={field.key}>
                        <Form.Item
                          {...field}
                          labelCol={{ span: 8 }}
                          label={form.getFieldValue('diseaseReasonBos')[index].name}
                          name={[field.name, 'diseaseConfirmType']}
                          fieldKey={[field.fieldKey, 'diseaseConfirmType']}
                        >
                          <Radio.Group options={yesList}></Radio.Group>
                        </Form.Item>
                        {form.getFieldValue('diseaseReasonBos')[index].name === '其他' && (
                          <Form.Item
                            {...field}
                            name={[field.name, 'other']}
                            fieldKey={[field.fieldKey, 'other']}
                          >
                            <Input />
                          </Form.Item>
                        )}
                      </Space>
                    ))}
                  </>
                )}
              </Form.List>
              {/* <Form.Item name="diseaseConfirmType">
                <Radio.Group>
                  {yesList.map((item) => (
                    <Radio key={item.code} value={item.code}>
                      {item.codeCn}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>

              <Form.Item name="diseaseReasonBos">
                <Checkbox.Group
                  onChange={onAllDiseaseReasonChange}
                  style={{ margin: '8px 0' }}
                  options={allDiseaseReason}
                ></Checkbox.Group>
              </Form.Item>
              {diseaseReasonBosNames.includes('其他') && (
                <Form.Item name="other">
                  <Input />
                </Form.Item>
              )} */}
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: 30 }}>
          <Col span={7}>
            <Card bordered={false} className="card-title" title="感官异常">
              <Form.Item name="haveSenseDisease">
                <Radio.Group onChange={onSetSenseDiseaseNoChange}>
                  {haveOrNoList.map((item) => (
                    <Radio key={item.code} value={item.code}>
                      {item.codeCn}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item name="senseDisease">
                <Checkbox.Group
                  onChange={onSenseDiseaseChange}
                  style={{ margin: '8px 0' }}
                  options={senseDiseaseList}
                ></Checkbox.Group>
              </Form.Item>
              {senseDiseaseNames.includes('听力障碍') && (
                <Form.Item name="hearing">
                  <Input placeholder="请输入听力障碍" />
                </Form.Item>
              )}
              {senseDiseaseNames.includes('视力障碍') && (
                <Form.Item name="vision">
                  <Input placeholder="请输入视力障碍" />
                </Form.Item>
              )}
            </Card>
          </Col>
          <Col span={7} offset={1}>
            <Card bordered={false} className="card-title" title="遗传、先天症候群">
              <Form.Item name="haveGeneticDisease">
                <Radio.Group onChange={onSetHaveGeneticDiseaseNoChange} style={{ marginBottom: 8 }}>
                  {haveOrNoList.map((item) => (
                    <Radio key={item.code} value={item.code}>
                      {item.codeCn}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item name="geneticDisease">
                <Checkbox.Group
                  onChange={onGeneticDiseaseChange}
                  options={geneticDiseaseList}
                ></Checkbox.Group>
              </Form.Item>
              {geneticDiseaseNames.includes('其他') && (
                <Form.Item name="otherGeneticDisease">
                  <Input />
                </Form.Item>
              )}
            </Card>
          </Col>
          <Col span={7} offset={1}>
            <Card bordered={false} className="card-title" title="认知发展">
              <Form.Item name="cognitionLevel">
                <Radio.Group style={{ marginBottom: 8 }}>
                  {abnormalTypeList.map((item) => (
                    <Radio key={item.code} value={item.code}>
                      {item.codeCn}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item name="cognitionLevelBos">
                <Checkbox.Group options={cognitionLevelList}></Checkbox.Group>
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: 30 }}>
          <Col span={7}>
            <Card bordered={false} className="card-title" title="语言发展">
              <Form.Item name="languageLevel">
                <Radio.Group style={{ marginBottom: 8 }}>
                  {abnormalTypeList.map((item) => (
                    <Radio key={item.code} value={item.code}>
                      {item.codeCn}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item name="languageLevelBos">
                <Checkbox.Group
                  onChange={onLanguageLevelChange}
                  options={languageLevelList}
                ></Checkbox.Group>
              </Form.Item>
              {languageLevelNames.includes('其他') && (
                <Form.Item name="otherLanguageLevel">
                  <Input />
                </Form.Item>
              )}
            </Card>
          </Col>
          <Col span={7} offset={1}>
            <Card bordered={false} className="card-title" title="知觉动作发展">
              <Form.Item name="perceptionLevel">
                <Radio.Group style={{ marginBottom: 8 }}>
                  {abnormalTypeList.map((item) => (
                    <Radio key={item.code} value={item.code}>
                      {item.codeCn}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item name="perceptionLevelBos">
                <Checkbox.Group
                  onChange={onPerceptionLevelChange}
                  options={perceptionLevelList}
                ></Checkbox.Group>
              </Form.Item>
              {perceptionLevelNames.includes('其他') && (
                <Form.Item name="otherPerceptionLevel">
                  <Input />
                </Form.Item>
              )}
            </Card>
          </Col>
          <Col span={7} offset={1}>
            <Card bordered={false} className="card-title" title="社会情绪发展">
              <Form.Item name="socialMoodLevel">
                <Radio.Group style={{ marginBottom: 8 }}>
                  {abnormalTypeList.map((item) => (
                    <Radio key={item.code} value={item.code}>
                      {item.codeCn}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item name="socialMoodLevelBos">
                <Checkbox.Group
                  onChange={onSocialMoodLevelChange}
                  options={socialMoodLevelList}
                ></Checkbox.Group>
              </Form.Item>
              {socialMoodLevelNames.includes('其他') && (
                <Form.Item name="otherSocialMoodLevel">
                  <Input />
                </Form.Item>
              )}
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: 30 }}>
          <Col span={11}>
            <Card bordered={false} className="card-title" title="行为">
              <Form.Item name="activeLevel">
                <Radio.Group style={{ marginBottom: 8 }}>
                  {abnormalTypeList.map((item) => (
                    <Radio key={item.code} value={item.code}>
                      {item.codeCn}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item name="activeLevelBos">
                <Checkbox.Group
                  onChange={onActiveChange}
                  options={activeLevelList}
                ></Checkbox.Group>
              </Form.Item>
              {activeLevelNames.includes('其他') && (
                <Form.Item name="otherActiveLevel">
                  <Input />
                </Form.Item>
              )}
            </Card>
          </Col>
          <Col span={11} offset={1}>
            <Card bordered={false} className="card-title" title="神经相关疾病">
              <Form.Item name="haveNerveDisease">
                <Radio.Group onChange={onSetNerveDiseaseNoChange}>
                  {haveOrNoList.map((item) => (
                    <Radio key={item.code} value={item.code}>
                      {item.codeCn}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item name="nerveDisease">
                <Checkbox.Group
                  onChange={onNerveDiseaseChange}
                  style={{ margin: '8px 0' }}
                  options={nerveDiseaseList}
                ></Checkbox.Group>
              </Form.Item>
              {nerveDiseaseNames.includes('其他') && (
                <Form.Item name="otherNerveDisease">
                  <Input />
                </Form.Item>
              )}
            </Card>
          </Col>
        </Row>
      </Form>
      <FooterToolbar>
        <>
          <Button
            className="mr8"
            type="primary"
            onClick={() => {
              if (!info?.caseCodeV) {
                return message.info('请先查看患者信息');
              }
              history.push({
                pathname: '/assessment/trainingobjectives',
                query: {
                  code: info.caseCodeV,
                },
              });
            }}
          >
            进入训练目标
          </Button>
          {getAuth()?.canEdit && (
            <Button loading={submitting} onClick={submit} type="primary">
              提交
            </Button>
          )}
        </>
      </FooterToolbar>
    </PageContainer>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['assessmentAndTeamAssessment/create'],
}))(TeamAssessment);
