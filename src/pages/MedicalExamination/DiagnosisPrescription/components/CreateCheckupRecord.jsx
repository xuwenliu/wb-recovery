import React, { useState, useEffect } from 'react';
import {
  Form,
  Checkbox,
  Input,
  Button,
  Select,
  Card,
  Image,
  Radio,
  message,
  DatePicker,
} from 'antd';
import { CloseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { FooterToolbar } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import copy from 'copy-to-clipboard';
import { media } from '@/utils/utils';

import { connect, history } from 'umi';
import {
  getAllPast,
  getAllVisitingDanger,
  getLastVisiting,
  getVisitingSingle,
  getFamilyMember,
  messagePush,
} from '@/pages/MedicalExamination/DiagnosisPrescription/service';
import {
  getCheckAll,
  getCheckChildren,
  getAllImportSection,
} from '@/pages/Function/ColumnLocation/service';

import { queryCommonAllEnums, getSingleEnums, getAuth } from '@/utils/utils';
import moment from 'moment';
import MainTellLevelSelect from './MainTellLevelSelect';
import InitialJudgeSelect from './InitialJudgeSelect';
import ScaleViewModal from '@/components/Scale/ScaleViewModal';

import why from '@/assets/img/why.png';
import chufang from '@/assets/img/chufang.png';
import jianyi from '@/assets/img/jianyi.png';
import pingding from '@/assets/img/pingding.png';

const layout = {
  labelCol: {
    span: 3,
  },
};

const fuLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 8,
  },
};
let numArr = [];
for (let i = 1; i <= 12; i++) {
  numArr.push(i);
}

const CreateCheckupRecord = ({ dispatch, submitting, info = {}, recordId, authKey }) => {
  const DISABLED = recordId ? true : false;
  const { familyMemberInfoVos, patientBirthRecordVo } = info;
  let fatherInfo = null;
  let motherInfo = null;
  familyMemberInfoVos?.forEach((item) => {
    if (item.type === 1) {
      fatherInfo = item;
      fatherInfo.age = moment().format('YYYY') * 1 - item.birthYear;
    }
    if (item.type === 2) {
      motherInfo = item;
      motherInfo.age = moment().format('YYYY') * 1 - item.birthYear;
    }
  });

  const [form] = Form.useForm();
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCopyBtn, setShowCopyBtn] = useState(false);
  const [copyText, setCopyText] = useState('');

  const [allProblemList, setAllProblemList] = useState([]); // 就诊问题
  const [problemNameList, setProblemNameList] = useState([]);

  const [historyList, setHistoryList] = useState([]); // 既往史
  const [historySubList, setHistorySubList] = useState([]); // 既往史-下级多选
  const [personalList, setPersonalList] = useState([]); // 个人史
  const [personal2List, setPersonal2List] = useState([]); // 个人史-二级
  const [childbirthTypeList, setChildbirthTypeList] = useState([]); // 分娩方式
  const [limitValueList, setLimitValueList] = useState([]); // 限定值

  const [allVaccineList, setAllVaccineList] = useState([]); // 疫苗
  const [familyHistoryList, setFamilyHistoryList] = useState([]); // 家族史
  const [familyInfectiousDiseaseList, setFamilyInfectiousDiseaseList] = useState([]); // 传染病

  const [visitingDangerList, setVisitingDangerList] = useState([]); // 高危因素
  const [visitingDangerSubList, setVisitingDangerSubList] = useState([]); // 高危因素-下级多选
  const [outpatientList, setOutpatientList] = useState([]); // 门诊复查
  const [allPrescriptionList, setAllPrescriptionList] = useState([]); // 治疗处方
  const [allPrescriptionNameList, setAllPrescriptionNameList] = useState([]); // 治疗处方
  const [showDataType, setShowDataType] = useState([]); // 医学诊断-下面需要显示的类型[5,6,7]
  const [timestamp, setTimestamp] = useState(0);

  const [moreInfo, setMoreInfo] = useState({
    isAsphyxia: false,
    isBirthHurt: false,
    isHealth: false,
    isWeak: false,
  });
  const [tools, setTools] = useState([]);

  const [way, setWay] = useState(1);

  const queryEnums = async () => {
    const newArr = await queryCommonAllEnums();
    setHistoryList(getSingleEnums('PastHistoryType', newArr)); //既往史
    setVisitingDangerList(getSingleEnums('MedicineCheckDangerType', newArr)); // 高危因素
  };

  const queryCheckAll = async () => {
    let res = await getCheckAll();
    res = res.map((item) => {
      item.label = item.content;
      item.value = item.id;
      return item;
    });
    setPersonalList(res.filter((item) => item.type === 4)); // 个人史
    setOutpatientList(res.filter((item) => item.type === 8)); // 门诊复查

    const options = res
      .filter((item) => item.type === 9)
      .map((item) => {
        item.value = `${item.id}-${item.content}`;
        return item;
      });
    setAllProblemList(options); // 就诊问题

    setAllVaccineList(res.filter((item) => item.type === 10)); // 疫苗接种
    setFamilyHistoryList(res.filter((item) => item.type === 11)); // 家族史
    setFamilyInfectiousDiseaseList(res.filter((item) => item.type === 12)); // 传染病
    setChildbirthTypeList(res.filter((item) => item.type === 13)); // 分娩方式
    setLimitValueList(res.filter((item) => item.type === 15)); // 限定值

    const optionsChu = res
      .filter((item) => item.type === 14)
      .map((item) => {
        item.value = `${item.id}-${item.content}`;
        return item;
      });
    setAllPrescriptionList(optionsChu); // 治疗处方

    setLoading(false);
  };

  // 既往史-下拉切换
  const historyChange = async (type, noClear) => {
    const res = await getAllPast();
    const options = res
      .filter((item) => item.type === type)
      .map((item) => {
        item.label = item.name;
        item.value = item.id;
        return item;
      });
    if (!noClear) {
      form.setFields([
        {
          name: 'visitingPastCreateBos',
          value: [],
        },
      ]);
    }

    setHistorySubList(options);
  };

  // 高危因素-下拉切换
  const visitingDangerChange = async (type, noClear) => {
    const res = await getAllVisitingDanger();

    const options = res
      .filter((item) => item.type === type)
      .map((item) => {
        item.label = item.name;
        item.value = item.id;
        return item;
      });
    if (!noClear) {
      form.setFields([
        {
          name: 'visitingDangerConnectCreateBos',
          value: [],
        },
      ]);
    }

    setVisitingDangerSubList(options);
  };

  // 个人史下拉切换
  const personalChange = async (parentId) => {
    form.setFields([{ name: 'personalLevel2Id', value: '' }]);
    const res = await getCheckChildren({ parentId });
    if (res) {
      setPersonal2List(res);
    }
  };

  // 医学诊断 下面的显示内容
  const queryAllImportSection = async () => {
    const res = await getAllImportSection();
    if (res) {
      const types = [];
      res?.forEach((item) => {
        if (item.isShow) {
          types.push(item.type);
        }
      });
      setShowDataType(types);
    }
  };

  // 就诊问题 - 选了其他处理
  const onProblemChange = (arrId) => {
    const nameList = [];
    arrId.forEach((item) => {
      const name = item.split('-')[1];
      nameList.push(name);
    });
    if (!nameList.includes('其他')) {
      form.setFields([
        {
          name: 'otherProblem',
          value: [],
        },
      ]);
    }

    setProblemNameList(nameList);
  };

  const onMoreChange = (e, field) => {
    setMoreInfo({
      ...moreInfo,
      [field]: e.target.checked,
    });
  };

  // 治疗处方 - 选了其他处理 和 门诊复查
  const onPrescriptionChange = (arrId) => {
    const nameList = [];
    arrId.forEach((item) => {
      const name = item.split('-')[1];
      nameList.push(name);
    });
    if (!nameList.includes('其他')) {
      form.setFields([
        {
          name: 'otherPrescription',
          value: '',
        },
      ]);
    }
    if (!nameList.includes('门诊复查')) {
      form.setFields([
        {
          name: 'time',
          value: '',
        },
        {
          name: 'timeType',
          value: '',
        },
      ]);
    }
    setAllPrescriptionNameList(nameList);
  };

  const getErrorInfo = (errors) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;

    if (!errors || errorCount === 0) {
      return null;
    }
    return (
      <span className="errorIcon">
        <CloseCircleOutlined />
        {errorCount}
      </span>
    );
  };

  const queryEditInfo = async () => {
    if (!info.id && !recordId) return;

    let values = null;
    if (info.id) {
      values = await getLastVisiting({
        patientId: info.id,
      });
    }

    if (recordId) {
      values = await getVisitingSingle({
        recordId,
      });
    }

    if (!values) return;
    setShowCopyBtn(true);
    setCopyText(values);
    console.log('values', values);
    //就诊问题
    const visitingProblemCreateBos = [];
    values.visitingProblemVos?.forEach((item) => {
      visitingProblemCreateBos.push(`${item.problemId}-${item.name}`);
    });
    onProblemChange(visitingProblemCreateBos);

    // 主诉
    const visitingMainTellCreateBos = [];
    values.visitingMainTellVos?.forEach((item) => {
      visitingMainTellCreateBos.push({
        mainTellLevel1Id: item.mainTellLevel1Id,
        mainTellLevel2Id: item.mainTellLevel2Id,
        mainTellLevel3Id: item.mainTellLevel3Id,
        customizeInfo: item.customizeInfo,
      });
    });
    // 现病史
    const visitingHpiCreateBos = [];
    values.visitingHpiVos?.forEach((item) => {
      visitingHpiCreateBos.push({
        hpiLevel1Id: item.hpiLevel1Id,
        hpiLevel2Id: item.hpiLevel2Id,
        hpiLevel3Id: item.hpiLevel3Id,
        customizeInfo: item.customizeInfo,
      });
    });

    // 家族史

    // 既往史
    let pastVoId = '';
    if (values.visitingPastVos) {
      pastVoId = values.visitingPastVos[0]?.pastVo?.type;
      historyChange(pastVoId, true);
    }

    const visitingPastCreateBos = [];
    values.visitingPastVos?.forEach((item) => {
      visitingPastCreateBos.push(item.pastId.toString());
    });
    // 家族史

    // 个人史
    if (values.visitingPersonalVo?.personalLevel1Id) {
      personalChange(values.visitingPersonalVo?.personalLevel1Id);
    }
    //
    setMoreInfo({
      isAsphyxia: values.visitingPersonalVo?.isAsphyxia,
      isBirthHurt: values.visitingPersonalVo?.isBirthHurt,
      isHealth: values.visitingPersonalVo?.isHealth,
      isWeak: values.visitingPersonalVo?.isWeak,
    });

    // 疫苗接种
    const visitingVaccineCreateBos = [];
    values.visitingVaccineVos?.forEach((item) => {
      visitingVaccineCreateBos.push(item.vaccineId);
    });
    // 家族史
    const visitingFamilyHistoryCreateBos = [];
    values.visitingFamilyHistoryVos?.forEach((item) => {
      visitingFamilyHistoryCreateBos.push(item.familyHistoryDiseaseType);
    });
    // 传染病
    const familyInfectiousDiseaseCreateBos = [];
    values.familyInfectiousDiseaseVos?.forEach((item) => {
      familyInfectiousDiseaseCreateBos.push(item.familyHistoryInfectiousType);
    });
    // 高危因素
    let visitingRecordId = '';
    if (values.visitingDangerConnectVos) {
      visitingRecordId = values.visitingDangerConnectVos[0]?.visitingDangerVo?.type;
      visitingDangerChange(visitingRecordId, true);
    }
    const visitingDangerConnectCreateBos = [];
    values.visitingDangerConnectVos?.forEach((item) => {
      visitingDangerConnectCreateBos.push(item.dangerId);
    });
    //医学诊断

    const icd = values.visitingJudgmentVos?.filter((item) => item.judgmentType === 5);
    const dsm = values.visitingJudgmentVos?.filter((item) => item.judgmentType === 6);
    const icf = values.visitingJudgmentVos?.filter((item) => item.judgmentType === 7);

    // 治疗处方
    const visitingPrescriptionCreateBos = [];
    values.visitingPrescriptionConnectVos?.forEach((item) => {
      visitingPrescriptionCreateBos.push(`${item.prescriptionId}-${item.name}`);
    });
    onPrescriptionChange(visitingPrescriptionCreateBos);

    const data = {
      otherProblem: values.visitingProblemVos ? values.visitingProblemVos[0]?.other : '',
      visitingProblemCreateBos, // 就诊问题
      visitingMainTellCreateBos, // 主诉
      visitingHpiCreateBos, // 现病史
      visitingPastCreateBos,
      pastVoId, //既往史
      personalLevel1Id: values.visitingPersonalVo?.personalLevel1Id,
      personalLevel2Id: values.visitingPersonalVo?.personalLevel2Id,
      childbirthType: values.visitingPersonalVo?.childbirthType, // 分娩方式
      visitingVaccineCreateBos, //疫苗接种
      visitingFamilyHistoryCreateBos, // 家族史
      familyInfectiousDiseaseCreateBos, // 传染病
      visitingRecordId, // 高危因素
      visitingDangerConnectCreateBos,
      icd,
      dsm,
      icf,
      visitingPrescriptionCreateBos, // 治疗处方
      time: values.visitingPrescriptionConnectVos
        ? values.visitingPrescriptionConnectVos[0]?.time
        : null,
      timeType: values.visitingPrescriptionConnectVos
        ? values.visitingPrescriptionConnectVos[0]?.timeType
        : null,
      otherPrescription: values.visitingPrescriptionConnectVos
        ? values.visitingPrescriptionConnectVos[0]?.other
        : '',
      doctorSuggestion: BraftEditor.createEditorState(values.doctorSuggestion),
      checkBody: values.checkBody,
      visitingMain: values.visitingMain,
      visitingHpi: values.visitingHpi,
      visitingPast: values.visitingPast,
      visitingPersonal: values.visitingPersonal,
      visitingResult: values.visitingResult,
      pushTime: values.visitingPushMessageVo?.data
        ? moment(values.visitingPushMessageVo?.data)
        : null,
      place: values.visitingPushMessageVo?.place,
    };
    form.setFieldsValue(data);
    setTimestamp(moment().valueOf());
    if (
      values.visitingMain ||
      values.visitingHpi ||
      values.visitingPast ||
      values.visitingPersonal
    ) {
      setWay(2);
    }
  };

  function disabledDate(current) {
    return current < moment().subtract(1, 'days');
  }

  // 门诊复查保存
  const handleOutpatient = async () => {
    if (!info.id) return message.info('请先选择患者');
    const values = await form.getFieldsValue();
    const res = await getFamilyMember({
      patientId: info.id,
    });
    if (res && res.length != 0) {
      const postData = {
        patientId: info.id,
        place: values.place,
        data: values.pushTime ? moment(values.pushTime).valueOf() : null,
        parentId: res.filter((item) => item.type === 3)[0].id, // 主要照顾者id
      };
      const result = await messagePush(postData);
      if (result) {
        message.success('操作成功');
      }
    } else {
      message.info('您尚未填写家庭成员信息');
    }
  };

  const onFinish = async (values) => {
    if (!info.id) return message.info('请先选择患者');
    console.log(values);
    console.log('tools', tools);
    setError([]);

    // 就诊问题
    const visitingProblemCreateBos = [];
    values.visitingProblemCreateBos?.forEach((item) => {
      visitingProblemCreateBos.push({
        problemId: item.split('-')[0],
        other: values.otherProblem ? values.otherProblem : '',
      });
    });

    // 既往史
    const visitingPastCreateBos = [];
    values.visitingPastCreateBos?.forEach((item) => {
      visitingPastCreateBos.push({
        pastId: item,
      });
    });
    // 个人史
    const visitingPersonalCreateBo = {
      ...moreInfo,
      childbirthType: values.childbirthType, // 分娩方式
      gestationalWeek: 0, // 出生孕周
      gestationalWeight: 0, //出生体重
      personalLevel1Id: values.personalLevel1Id,
      personalLevel2Id: values.personalLevel2Id,
    };

    // 疫苗
    const visitingVaccineCreateBos = [];
    values.visitingVaccineCreateBos?.forEach((item) => {
      visitingVaccineCreateBos.push({
        vaccineId: item,
      });
    });

    // 家族史
    const visitingFamilyHistoryCreateBos = [];
    values.visitingFamilyHistoryCreateBos?.forEach((item) => {
      visitingFamilyHistoryCreateBos.push({
        familyHistoryDiseaseType: item,
      });
    });

    // 传染病
    const familyInfectiousDiseaseCreateBos = [];
    values.familyInfectiousDiseaseCreateBos?.forEach((item) => {
      familyInfectiousDiseaseCreateBos.push({
        familyHistoryInfectiousType: item,
      });
    });

    // 高危因素
    const visitingDangerConnectCreateBos = [];
    values.visitingDangerConnectCreateBos?.forEach((item) => {
      visitingDangerConnectCreateBos.push({
        dangerId: item,
      });
    });

    // 医学诊断
    const visitingJudgmentCreateBos = (values.icd || [])
      .concat(values.dsm || [])
      .concat(values.icf || []);

    // 治疗处方
    const visitingPrescriptionCreateBos = [];
    values.visitingPrescriptionCreateBos?.forEach((item) => {
      const nameList = item.split('-')[1];
      const prescriptionId = item.split('-')[0];
      const obj = {
        prescriptionId,
        isNeedReview: nameList.includes('门诊复查'),
        isOther: nameList.includes('其他'),
        time: values.time ? values.time : 0,
        timeType: values.timeType ? values.timeType : '',
        other: values.otherPrescription ? values.otherPrescription : '',
      };
      visitingPrescriptionCreateBos.push(obj);
    });

    const parentInfo = await getFamilyMember({
      patientId: info.id,
    });

    if (!parentInfo || parentInfo.length === 0) {
      return message.info('您尚未填写家庭成员信息');
    }

    const postData = {
      patientId: info.id, // 患者id
      visitingProblemCreateBos, // 就诊问题
      visitingMainTellCreateBos: values.visitingMainTellCreateBos, // 主诉
      visitingHpiCreateBos: values.visitingHpiCreateBos, // 现病史
      visitingPastCreateBos, // 既往史
      visitingPersonalCreateBo, // 个人史
      visitingVaccineCreateBos, // 疫苗
      visitingFamilyHistoryCreateBos, // 家族史
      familyInfectiousDiseaseCreateBos, // 传染病
      visitingDangerConnectCreateBos, // 高危因素
      checkBody: values.checkBody, // 查体
      visitingMain: values.visitingMain,
      visitingHpi: values.visitingHpi,
      visitingPast: values.visitingPast,
      visitingPersonal: values.visitingPersonal,
      visitingResult: values.visitingResult, // 诊断内容
      visitingJudgmentCreateBos, // 医学诊断
      visitingPrescriptionCreateBos, // 治疗处方
      doctorSuggestion: values.doctorSuggestion?.toHTML(), // 医生建议

      // 门诊复查
      visitingMessageBo: {
        patientId: info.id,
        place: values.place,
        data: values.pushTime ? moment(values.pushTime).valueOf() : null,
        parentId: parentInfo.filter((item) => item.type === 3)[0].id, // 主要照顾者id
      },
    };

    dispatch({
      type: 'medicalExaminationAndDiagnosisPrescription/create',
      payload: postData,
      callback: (res) => {
        res && message.success('操作成功');
        res && queryEditInfo();
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    setError(errorInfo.errorFields);
  };

  useEffect(() => {
    queryCheckAll();
    queryEnums();
    queryAllImportSection();
    if (info.id || recordId) {
      queryEditInfo();
    }
  }, [info.id, recordId]);

  const handelCopyText = () => {
    if (!copyText) return;

    //  就诊问题
    const visitingProblemVosNames = [];
    copyText.visitingProblemVos?.forEach((item) => {
      visitingProblemVosNames.push(item.name);
      if (item.name === '其他') {
        visitingProblemVosNames.push(item.other);
      }
    });

    let visitingMainTellVosNames = [];
    let visitingHpiVosNames = [];
    let visitingPastVosNames = [];
    let visitingPersonalVoNames = [];

    if (
      copyText.visitingMain ||
      copyText.visitingHpi ||
      copyText.visitingPast ||
      copyText.visitingPersonal
    ) {
      visitingMainTellVosNames = [copyText.visitingMain];
      visitingHpiVosNames = [copyText.visitingHpi];
      visitingPastVosNames = [copyText.visitingPast];
      visitingPersonalVoNames = [copyText.visitingPersonal];
    } else {
      // 主诉
      copyText.visitingMainTellVos?.forEach((item) => {
        visitingMainTellVosNames.push(
          `${item.mainTellLevel1Name}-${item.mainTellLevel2Name}-${item.mainTellLevel3Name}-${item.customizeInfo}`,
        );
      });

      // 现病史
      copyText.visitingHpiVos?.forEach((item) => {
        visitingHpiVosNames.push(
          `${item.hpiLevel1Name}-${item.hpiLevel2Name}-${item.hpiLevel3Name}-${item.customizeInfo}`,
        );
      });

      // 既往史
      visitingPastVosNames = [copyText.visitingPastVos[0]?.pastVo?.typeName];
      copyText.visitingPastVos?.forEach((item) => {
        visitingPastVosNames.push(`${item.pastVo.name}`);
      });
      // 个人史
      visitingPersonalVoNames = [
        `${copyText.visitingPersonalVo.personalLevel1Name}-${copyText.visitingPersonalVo.personalLevel2Name}`,
      ];
    }

    // 疫苗接种
    const visitingVaccineVosNames = [];
    copyText.visitingVaccineVos?.forEach((item) => {
      visitingVaccineVosNames.push(`${item.vaccineName}`);
    });

    // 家族史
    const visitingFamilyHistoryVosNames = [];
    copyText.visitingFamilyHistoryVos?.forEach((item) => {
      visitingFamilyHistoryVosNames.push(`${item.familyHistoryDiseaseTypeName}`);
    });
    // 传染病
    const familyInfectiousDiseaseVosNames = [];
    copyText.familyInfectiousDiseaseVos?.forEach((item) => {
      familyInfectiousDiseaseVosNames.push(`${item.familyHistoryInfectiousTypeName}`);
    });
    // 高危因素
    const visitingDangerConnectVosNames = [
      copyText.visitingDangerConnectVos[0]?.visitingDangerVo?.typeName,
    ];
    copyText.visitingDangerConnectVos?.forEach((item) => {
      visitingDangerConnectVosNames.push(`${item.visitingDangerVo.name}`);
    });

    const visitingJudgmentVos = copyText.visitingJudgmentVos?.map((item) => {
      item.judgmentLevelName = `${item.judgmentLevel1Name}-${item.judgmentLevel2Name || '无'}-${
        item.judgmentLevel3Name || '无'
      }-${item.judgmentLevel4Name || '无'}-${item.limitValueName || '无'}`;
      return item;
    });
    const icdNames = visitingJudgmentVos
      ?.filter((item) => item.judgmentType === 5)
      .map((item) => item.judgmentLevelName);
    const dsmNames = visitingJudgmentVos
      ?.filter((item) => item.judgmentType === 6)
      .map((item) => item.judgmentLevelName);
    const icfNames = visitingJudgmentVos
      ?.filter((item) => item.judgmentType === 7)
      .map((item) => item.judgmentLevelName);

    // 治疗处方
    const visitingPrescriptionConnectVosNames = [];
    copyText.visitingPrescriptionConnectVos?.forEach((item) => {
      visitingPrescriptionConnectVosNames.push(item.name);
      if (item.isNeedReview) {
        visitingPrescriptionConnectVosNames.push(`${item.time}${item.timeTypeName}`);
      }
      if (item.isOther) {
        visitingPrescriptionConnectVosNames.push(item.other);
      }
    });
    const doctorSuggestion = copyText.doctorSuggestion;
    const text = `
      就诊问题：${visitingProblemVosNames.join(' ')}
      主诉：${visitingMainTellVosNames.join(' ')}
      现病史：${visitingHpiVosNames.join(' ')}
      既往史：${visitingPastVosNames.join(' ')}   
      个人史：${visitingPersonalVoNames.join(' ')}
      足月/早产：${copyText.visitingPersonalVo.gestationalWeek || 0}周
      出生体重：${copyText.visitingPersonalVo.gestationalWeight || 0}KG
      分娩方式：${copyText.visitingPersonalVo.childbirthTypeName || ''} 
      疫苗接种：${visitingVaccineVosNames.join(' ')}
      家族史：${visitingFamilyHistoryVosNames.join(' ')}
      传染病：${familyInfectiousDiseaseVosNames.join(' ')}
      高危因素：${visitingDangerConnectVosNames.join(' ')}
      查体：${copyText.checkBody || ''}
      医学诊断：
            诊断内容：${copyText.visitingResult || ''}
            ICD10/11：${icdNames.join(' ')}
            DSM5：${dsmNames.join(' ')}
            ICF-CY：${icfNames.join(' ')}
      治疗处方：
            门诊复查：
            复查时间：${
              copyText.visitingPushMessageVo?.data
                ? moment(copyText.visitingPushMessageVo?.data).format('YYYY-MM-DD')
                : ''
            }
            复查地点：${copyText.visitingPushMessageVo?.place || ''}
            ${visitingPrescriptionConnectVosNames.join(' ')}
      医生建议：${doctorSuggestion}
      `;
    copy(text);
    if (copy(text)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  return (
    <Form
      hideRequiredMark
      {...layout}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {showCopyBtn && (
        <Button type="primary" onClick={handelCopyText}>
          复制本页文档内容
        </Button>
      )}

      <Card loading={loading} style={{ background: '#F2F3F7', marginTop: 20 }}>
        <Form.Item
          label="就诊问题 (必填)"
          name="visitingProblemCreateBos"
          rules={[
            {
              required: true,
              message: '请选择就诊问题',
            },
          ]}
        >
          <Checkbox.Group
            disabled={DISABLED}
            style={{ paddingTop: 6 }}
            onChange={onProblemChange}
            options={allProblemList}
          ></Checkbox.Group>
        </Form.Item>
        {problemNameList.includes('其他') && (
          <Form.Item
            name="otherProblem"
            rules={[
              {
                required: true,
                message: '请输入其他就诊问题',
              },
            ]}
          >
            <Input disabled={DISABLED} placeholder="请输入其他就诊问题" />
          </Form.Item>
        )}
        <Form.Item label="就诊方式">
          <Radio.Group onChange={(e) => setWay(e.target.value)} value={way}>
            <Radio value={1}>下拉框选择</Radio>
            <Radio value={2}>编辑框输入</Radio>
          </Radio.Group>
        </Form.Item>

        {way === 1 && (
          <>
            <Form.Item label="主诉">
              <MainTellLevelSelect
                disabled={DISABLED}
                timestamp={timestamp}
                form={form}
                type={2}
                name="visitingMainTellCreateBos"
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}
                postFields={[
                  'mainTellLevel1Id',
                  'mainTellLevel2Id',
                  'mainTellLevel3Id',
                  'customizeInfo',
                ]}
              />
            </Form.Item>
            <Form.Item label="现病史">
              <MainTellLevelSelect
                disabled={DISABLED}
                timestamp={timestamp}
                form={form}
                type={3}
                name="visitingHpiCreateBos"
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}
                postFields={['hpiLevel1Id', 'hpiLevel2Id', 'hpiLevel3Id', 'customizeInfo']}
              />
            </Form.Item>
            <Form.Item label="既往史">
              <div style={{ display: 'flex' }}>
                <Form.Item className="mr8" style={{ flex: 1 }} name="pastVoId">
                  <Select
                    disabled={DISABLED}
                    placeholder="请选择"
                    onChange={(val) => historyChange(val, false)}
                  >
                    {historyList.map((item) => (
                      <Select.Option key={item.code} value={item.code}>
                        {item.codeCn}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item style={{ flex: 4 }} name="visitingPastCreateBos">
                  <Checkbox.Group disabled={DISABLED} options={historySubList}></Checkbox.Group>
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item label="个人史" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex' }}>
                <Form.Item className="mr8" style={{ width: '20%' }} name="personalLevel1Id">
                  <Select disabled={DISABLED} onChange={personalChange}>
                    {personalList.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.content}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item className="mr8" style={{ width: '20%' }} name="personalLevel2Id">
                  <Select disabled={DISABLED}>
                    {personal2List.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.content}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <span>{patientBirthRecordVo?.fetusNumName}</span>
                  {patientBirthRecordVo?.pregnancyWeeksName && (
                    <span>&nbsp;&nbsp;出生孕周：{patientBirthRecordVo?.pregnancyWeeksName}</span>
                  )}
                  {patientBirthRecordVo?.birthWeightName && (
                    <span>&nbsp;&nbsp;出生体重：{patientBirthRecordVo?.birthWeightName}</span>
                  )}
                </Form.Item>
              </div>
            </Form.Item>
          </>
        )}
        {way === 2 && (
          <>
            <Form.Item label="主诉" name="visitingMain">
              <Input disabled={DISABLED} />
            </Form.Item>
            <Form.Item label="现病史" name="visitingHpi">
              <Input disabled={DISABLED} />
            </Form.Item>
            <Form.Item label="既往史" name="visitingPast">
              <Input disabled={DISABLED} />
            </Form.Item>
            <Form.Item label="个人史" name="visitingPersonal">
              <Input disabled={DISABLED} />
            </Form.Item>
          </>
        )}

        <Form.Item label="分娩方式" name="childbirthType">
          <Radio.Group disabled={DISABLED}>
            {childbirthTypeList.map((item) => (
              <Radio key={item.id} value={item.id}>
                {item.content}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item label="疫苗接种" name="visitingVaccineCreateBos">
          <Checkbox.Group disabled={DISABLED} options={allVaccineList}></Checkbox.Group>
        </Form.Item>

        <Form.Item label="家族史" style={{ marginBottom: 0 }}>
          {fatherInfo && (
            <span>
              其父：{fatherInfo.name} {fatherInfo.age}岁，职业：{fatherInfo.professionLargeName}-
              {fatherInfo.professionMediumName}
            </span>
          )}
          {motherInfo && (
            <span>
              &nbsp;&nbsp; 其母：{motherInfo.name} {motherInfo.age}岁，职业：
              {motherInfo.professionLargeName}-{motherInfo.professionMediumName}-
            </span>
          )}
          <Form.Item name="visitingFamilyHistoryCreateBos">
            <Checkbox.Group disabled={DISABLED} options={familyHistoryList}></Checkbox.Group>
          </Form.Item>
        </Form.Item>
        <Form.Item label="传染病" name="familyInfectiousDiseaseCreateBos">
          <Checkbox.Group
            disabled={DISABLED}
            options={familyInfectiousDiseaseList}
          ></Checkbox.Group>
        </Form.Item>

        <Form.Item label="高危因素" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex' }}>
            <Form.Item className="mr8" style={{ flex: 1 }} name="visitingRecordId">
              <Select
                disabled={DISABLED}
                placeholder="请选择高危因素"
                onChange={(val) => visitingDangerChange(val, false)}
              >
                {visitingDangerList.map((item) => (
                  <Select.Option key={item.code} value={item.code}>
                    {item.codeCn}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item style={{ flex: 4 }} name="visitingDangerConnectCreateBos">
              <Checkbox.Group disabled={DISABLED} options={visitingDangerSubList}></Checkbox.Group>
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item label="查体" name="checkBody">
          <Input disabled={DISABLED} />
        </Form.Item>
      </Card>

      <Card
        bordered={false}
        title={
          <>
            <Image preview={false} className="mr8" src={pingding} width={30} height={30} />
            评估工具
          </>
        }
      >
        <Form.Item
          name="tool"
          rules={[
            {
              required: true,
              message: '请选择评估工具',
            },
          ]}
        >
          <ScaleViewModal
            disabled={DISABLED}
            value={tools}
            onChange={(value) => {
              setTools(value);
            }}
          />
        </Form.Item>
      </Card>

      <Card
        loading={loading}
        bordered={false}
        title={
          <>
            <Image preview={false} className="mr8" src={why} width={30} height={30} />
            医学诊断 (必填)
          </>
        }
      >
        <Form.Item
          label="诊断内容"
          labelCol={{ span: 2 }}
          name="visitingResult"
          rules={[
            {
              required: true,
              message: '请输入诊断内容',
            },
          ]}
        >
          <Input disabled={DISABLED} />
        </Form.Item>

        {showDataType.includes(5) && (
          <Form.Item label="ICD10/11" labelCol={{ span: 2 }}>
            <InitialJudgeSelect
              disabled={DISABLED}
              timestamp={timestamp}
              type={5}
              form={form}
              name="icd"
              rules={[
                {
                  required: true,
                  message: '请选择',
                },
              ]}
              postFields={[
                'judgmentLevel1Id',
                'judgmentLevel2Id',
                'judgmentLevel3Id',
                'judgmentLevel4Id',
                'limitValue',
              ]}
              limitValueList={limitValueList}
            />
          </Form.Item>
        )}

        {showDataType.includes(6) && (
          <Form.Item label="DSM5" labelCol={{ span: 2 }}>
            <InitialJudgeSelect
              disabled={DISABLED}
              timestamp={timestamp}
              type={6}
              form={form}
              name="dsm"
              rules={[
                {
                  required: true,
                  message: '请选择',
                },
              ]}
              postFields={[
                'judgmentLevel1Id',
                'judgmentLevel2Id',
                'judgmentLevel3Id',
                'judgmentLevel4Id',
                'limitValue',
              ]}
              limitValueList={limitValueList}
            />
          </Form.Item>
        )}
        {showDataType.includes(7) && (
          <Form.Item label="ICF-CY" labelCol={{ span: 2 }}>
            <InitialJudgeSelect
              disabled={DISABLED}
              timestamp={timestamp}
              type={7}
              form={form}
              name="icf"
              rules={[
                {
                  required: true,
                  message: '请选择',
                },
              ]}
              postFields={[
                'judgmentLevel1Id',
                'judgmentLevel2Id',
                'judgmentLevel3Id',
                'judgmentLevel4Id',
                'limitValue',
              ]}
              limitValueList={limitValueList}
            />
          </Form.Item>
        )}
      </Card>

      <Card
        loading={loading}
        bordered={false}
        title={
          <>
            <Image preview={false} className="mr8" src={chufang} width={30} height={30} />
            治疗处方 (必填)
          </>
        }
      >
        <Form.Item {...fuLayout} label="门诊复查"></Form.Item>
        <Form.Item {...fuLayout} label="复查时间" name="pushTime">
          <DatePicker
            disabled={DISABLED}
            disabledDate={disabledDate}
            style={{ width: '100%' }}
            placeholder="请选择复查时间"
          />
        </Form.Item>
        <Form.Item {...fuLayout} label="复查地点" name="place">
          <Input disabled={DISABLED} placeholder="请输入复查地点" />
        </Form.Item>
        {/* <Form.Item
          {...fuLayout}
          wrapperCol={{
            offset: 2,
          }}
        >
          <Button type="primary" onClick={handleOutpatient}>
            保存
          </Button>
        </Form.Item> */}

        <Form.Item
          name="visitingPrescriptionCreateBos"
          rules={[
            {
              required: true,
              message: '请选择治疗处方',
            },
          ]}
        >
          <Checkbox.Group
            disabled={DISABLED}
            style={{ paddingTop: 6 }}
            onChange={onPrescriptionChange}
            options={allPrescriptionList}
          ></Checkbox.Group>
        </Form.Item>

        {allPrescriptionNameList.includes('门诊复查') && (
          <>
            <Input.Group compact>
              <Form.Item
                name="time"
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}
              >
                <Select
                  disabled={DISABLED}
                  style={{ width: 200 }}
                  placeholder="请选择复查周期"
                  rules={[
                    {
                      required: true,
                      message: '请选择治疗处方',
                    },
                  ]}
                >
                  {numArr.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="timeType"
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}
              >
                <Select disabled={DISABLED} style={{ width: 100 }}>
                  {outpatientList.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.content}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Input.Group>
          </>
        )}
        {allPrescriptionNameList.includes('其他') && (
          <Form.Item
            name="otherPrescription"
            rules={[
              {
                required: true,
                message: '请输入其他治疗处方',
              },
            ]}
          >
            <Input disabled={DISABLED} placeholder="请输入其他治疗处方" />
          </Form.Item>
        )}
      </Card>

      <Card
        loading={loading}
        bordered={false}
        title={
          <>
            <Image preview={false} className="mr8" src={jianyi} width={30} height={30} />
            医生建议 (必填)
          </>
        }
      >
        <Form.Item
          name="doctorSuggestion"
          rules={[
            {
              required: true,
              message: '请输入建议',
            },
          ]}
        >
          <BraftEditor
            disabled={DISABLED}
            media={media()}
            placeholder="请输入建议"
            className="my-editor"
          />
        </Form.Item>
      </Card>
      <FooterToolbar>
        {getErrorInfo(error)}
        {getAuth(authKey)?.canEdit && !DISABLED && (
          <>
            {authKey === 12 && (
              <Button className="mr8" type="primary">
                截取HIS医嘱
              </Button>
            )}

            {authKey === 22 && (
              <Button
                type="primary"
                onClick={() => {
                  if (!info.caseCodeV) {
                    return message.info('请先查看患者信息');
                  }
                  history.push({
                    pathname: '/assessment/teamassessment',
                    query: {
                      code: info.caseCodeV,
                    },
                  });
                }}
              >
                进入小组评估
              </Button>
            )}

            <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
              提交
            </Button>
          </>
        )}

        {DISABLED && (
          <Button icon={<ArrowLeftOutlined />} onClick={() => history.goBack()}>
            返回
          </Button>
        )}
      </FooterToolbar>
    </Form>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['medicalExaminationAndDiagnosisPrescription/create'],
}))(CreateCheckupRecord);
