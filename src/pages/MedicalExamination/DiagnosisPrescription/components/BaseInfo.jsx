import { CloseCircleOutlined, ArrowLeftOutlined, InboxOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Image,
  Checkbox,
  Radio,
  Divider,
  message,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import copy from 'copy-to-clipboard';
import { connect, history } from 'umi';
import moment from 'moment';
import { queryCommonAllEnums, getSingleEnums, getAuth } from '@/utils/utils';

import chengz from '@/assets/img/chengz.png';
import chusheng from '@/assets/img/chusheng.png';
import family from '@/assets/img/family.png';
import guomin from '@/assets/img/guomin.png';
import why from '@/assets/img/why.png';

const { Option } = Select;
import CitySelect from '@/pages/Patriarch/ChildrenRecord/Edit/components/CitySelect';
import ProfessionSelect from '@/pages/Patriarch/ChildrenRecord/Edit/components/ProfessionSelect';
import MedicalHistorySelect from '@/pages/Patriarch/ChildrenRecord/Edit/components/MedicalHistorySelect';

import { getParentSectionAll } from '@/pages/Function/ColumnLocation/service';

const FormMoreItemLayout = {
  labelCol: { span: 3 },
};
const FormItemLayout = {
  labelCol: { span: 10 },
};
const FormRecordItemLayout = {
  labelCol: { span: 8 },
};
const dangerTypeArr = [18, 19, 20, 21];

const filterEmptyObj = (obj) => {
  let newObj = {};
  for (let i in obj) {
    if (obj[i]) {
      newObj[i] = obj[i];
    }
  }
  return Object.keys(newObj).length === 0 ? null : newObj;
};

const disabledGTToday = (current) => {
  return current && current > moment().endOf('day');
};

const BaseInfo = ({ submitting, dispatch, patientId, authKey }) => {
  const [filePaths, setFilePaths] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [form] = Form.useForm();
  const [error, setError] = useState([]);

  const [copyText, setCopyText] = useState('');
  const [genderTypeList, setGenderTypeList] = useState([]);
  const [memberTypeList, setMemberTypeList] = useState([]);

  const [ethnicList, setEthnicList] = useState([]);
  const [mainList, setMainList] = useState([]);
  const [educationDegreeList, setEducationDegreeList] = useState([]);
  const [professionList, setProfessionList] = useState([]);

  const [familyTypeList, setFamilyTypeList] = useState([]);
  const [communityTypeList, setCommunityTypeList] = useState([]);
  const [educationTypeList, setEducationTypeList] = useState([]);
  const [languageTypeList, setLanguageTypeList] = useState([]);
  const [economicTypeList, setEconomicTypeList] = useState([]);
  const [hukouTypeList, setHukouTypeList] = useState([]);
  const [medicalInsuranceTypeList, setMedicalInsuranceTypeList] = useState([]);
  const [languageTypeShow, setLanguageTypeShow] = useState('');
  const [fangLanguageList, setFangLanguageList] = useState([]);

  const [isBehaviorUnusualShow, setIsBehaviorUnusualShow] = useState();
  const [abnormalActionList, setAbnormalActionList] = useState([]); // 异常行为

  const [patientPastRecoveryConnectBosList, setPatientPastRecoveryConnectBosList] = useState([]); // 既往医疗康复情况
  const [patientPastRecoveryConnectNames, setPatientPastRecoveryConnectNames] = useState([]);

  const [canTimeList, setCanTimeList] = useState([]); // 成长时间
  const [supportTypeList, setSupportTypeList] = useState([]); // 喂养方式

  const [birthPlaceTypeList, setBirthPlaceTypeList] = useState([]); // 出生地点
  const [otherBirthPlaceShow, setOtherBirthPlaceShow] = useState([]); // 其他出生是否显示输入框

  const [pregnancyWeeksList, setPregnancyWeeksList] = useState([]); // 出生孕周
  const [birthWeightList, setBirthWeightList] = useState([]); // 出生体重
  const [fetusNumList, setFetusNumList] = useState([]); // 胎数
  const [baseInfoDangerTypeList, setBaseInfoDangerTypeList] = useState([]); // 高危因素

  const [patientAllergyConnectList, setPatientAllergyConnectList] = useState([]); // 过敏史
  const [patientFamilyDiseaseHistoryList, setPatientFamilyDiseaseHistoryList] = useState([]); // 家族史
  const [patientDiseaseList, setPatientDiseaseList] = useState([]); // 病症

  const [writePersonName, setWritePersonName] = useState(); // 填写人姓名

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

  const onFinish = (values) => {
    setError([]);
    // 基本信息
    const patientBasicInfoCreateBo = {
      name: copyText.name,
      gender: copyText.gender,
      ethnic: copyText.ethnic,
      birthTime: moment(values.birthTime).valueOf(),
      createDocumentTime: moment(values.createDocumentTime).valueOf(),
      idCardCode: values.idCardCode,
      postCode: values.postCode,
      provinceCode: values.regionAddress.province,
      cityCode: values.regionAddress.city,
      regionCode: values.regionAddress.area,
      household: values.regionAddress.place,

      nowProvinceCode: values.nowAddress.province,
      nowCityCode: values.nowAddress.city,
      nowRegionCode: values.nowAddress.area,
      nowPlace: values.nowAddress.place,
      isBehaviorUnusual: values.isBehaviorUnusual, // 行为是否异常
      writePersonType: copyText.writePersonType, //填写人类型
      isAgreeTrain: copyText.isAgreeTrain, // 是否同意训练
      isReal: copyText.isReal, // 是否如实告知
    };

    // 家庭成员提交的数据
    const patientFamilyMemberInfoBos = values.patientFamilyMemberInfoBos
      ?.filter((item) => item.mobile) // 通过联系电话过滤掉没有填写的父亲或者母亲信息
      .map((item) => {
        item.professionLargeId = item.profession.large;
        item.professionMediumId = item.profession.medium;
        item.professionSmallId = item.profession.small;
        item.birthYear = moment(item.birthYear).format('YYYY') * 1;
        if (item.mainCarefulId) {
          // 选了主要照顾者 就把选了的栏位带上 例如：选了奶奶就把 奶奶 赋给name字段
          item.name = mainList.filter((sub) => sub.id == item.mainCarefulId)[0].name;
        }
        return item;
      });

    // 家庭状况 提交的数据
    const patientFamilyInfoBo = {
      communityType: values.communityType,
      economicType: values.economicType,
      educationType: values.educationType,
      familyType: values.familyType,
      hukouType: values.hukouType,
      languageId: values.languageId,
      languageType: values.languageType,
      medicalInsuranceType: values.medicalInsuranceType,
    };

    // 就诊原因 -行为已经放到patientBasicInfoCreateBo里面了
    const patientPastRecoveryConnectBos = [];
    values.patientPastRecoveryConnectBos?.map((item) => {
      if (item.split('-')[1] === '其他') {
        patientPastRecoveryConnectBos.push({
          pastRecoveryInfo: item.split('-')[0],
          other: values.other,
        });
      } else {
        patientPastRecoveryConnectBos.push({
          pastRecoveryInfo: item.split('-')[0],
        });
      }
    });

    // 成长记录
    const patientGrowthRecordBo = filterEmptyObj({
      caTalkTimeId: values.caTalkTimeId,
      canClimbTimeId: values.canClimbTimeId,
      feverTimeId: values.feverTimeId,
      canGainGroundTimeId: values.canGainGroundTimeId,
      canLaughTimeId: values.canLaughTimeId,
      canSitTimeId: values.canSitTimeId,
      canTurnOverTimeId: values.canTurnOverTimeId,
      canWalkTimeId: values.canWalkTimeId,
      supportTypeId: values.supportTypeId,
    });

    // 出生记录
    const patientBirthRecordBo = filterEmptyObj({
      birthPlaceType: values.birthPlaceType,
      birthWeightId: values.birthWeightId,
      fetusNumId: values.fetusNumId,
      otherBirthPlace: values.otherBirthPlace,
      birthPlaceDesc: values.birthPlaceDesc,
      pregnancyWeeksId: values.pregnancyWeeksId,
    });

    // 高危因素
    const birthRecordDangerInfoBos = [];
    baseInfoDangerTypeList.forEach((item) => {
      const value = values[`gao_${item.code}`];
      if (value) {
        if (Array.isArray(value)) {
          value?.forEach((sub) => {
            birthRecordDangerInfoBos.push({
              birthDangerInfoId: sub,
            });
          });
        } else {
          birthRecordDangerInfoBos.push({
            birthDangerInfoId: value,
          });
        }
      }
    });

    const postData = {
      abnormalActionIds: values.abnormalActionIds, //异常行为id集合
      filePaths, //	患者文档
      patientAllergyConnectBos: values.patientAllergyConnectBos?.filter((item) => item.allergyId), // 患者过敏史
      patientBasicInfoCreateBo, // 	患者基本信息创建
      patientBirthRecordBo, // 患者出生记录
      birthRecordDangerInfoBos, // 出生记录-患者出生高危因素
      patientDiseaseBos: values.patientDiseaseBos?.filter((item) => item.diseaseId), // 患者病症
      patientFamilyDiseaseHistoryBos: values.patientFamilyDiseaseHistoryBos?.filter(
        (item) => item.diseaseHistoryId,
      ), // 患者家族病史
      patientFamilyInfoBo, // 患者家庭信息
      patientFamilyMemberInfoBos, // 	患者家庭成员信息
      patientGrowthRecordBo, // 患者成长记录
      patientPastRecoveryConnectBos, // 既往医疗康复情况
      patientId, // 患者id-修改用
    };

    console.log('postData', postData);

    dispatch({
      type: 'patriarchAndChildrenRecord/create',
      payload: postData,
      callback: (res) => {
        if (res) {
          message.success('操作成功');
        }
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    setError(errorInfo.errorFields);
  };

  const queryEditInfo = async (id) => {
    dispatch({
      type: 'patriarchAndChildrenRecord/getInfo',
      payload: {
        patientId: id,
      },
      callback: (values) => {
        console.log('values', values);
        setFilePaths(values.patientDocumentVos);
        // 基本信息
        setCopyText(values);
        // TODO-城市三级联动待处理
        const patientBasicInfoCreateBo = {
          name: values.name,
          gender: values.gender,
          ethnic: values.ethnic,
          birthTime: moment(values.birthDay),
          createDocumentTime: moment(values.createDocumentTime),
          idCardCode: values.idCardCode,
          postCode: values.postCode,
          regionAddress: {
            province: values.provinceCode,
            city: values.cityCode,
            area: values.regionCode,
            place: values.household,
          },
          nowAddress: {
            province: values.nowProvinceCode,
            city: values.nowCityCode,
            area: values.nowRegionCode,
            place: values.nowPlace,
          },
          isBehaviorUnusual: values.isBehaviorUnusual, // 行为是否异常
          writePersonType: values.writePersonType, //填写人类型
          isAgreeTrain: values.isAgreeTrain, // 是否同意训练
          isReal: values.isReal, // 是否如实告知
        };
        setIsBehaviorUnusualShow(values.isBehaviorUnusual); // 行为是异常-显示异常情况
        writePersonTypeChange(patientBasicInfoCreateBo.writePersonType, values.familyMemberInfoVos);

        // 家庭成员
        const familyMemberTypes = values?.familyMemberInfoVos?.map((item) => item.type);
        let patientFamilyMemberInfoBos = values?.familyMemberInfoVos?.map((item) => {
          item.birthYear = moment(`${item.birthYear}/01/01 00:00:00`);
          item.profession = {
            large: item.professionLargeId,
            medium: item.professionMediumId,
            small: item.professionSmallId,
          };
          return item;
        });
        const source = {
          name: '',
          mainCarefulId: '',
          mobile: '',
          birthYear: '',
          profession: {},
          educationDegreeId: '',
        };

        if (familyMemberTypes?.includes(1) && !familyMemberTypes?.includes(2)) {
          // 只有父亲
          patientFamilyMemberInfoBos.push({
            ...source,
            type: 2,
          });
        }
        if (!familyMemberTypes?.includes(1) && familyMemberTypes?.includes(2)) {
          // 只有母亲
          patientFamilyMemberInfoBos.push({
            ...source,
            type: 1,
          });
        }
        patientFamilyMemberInfoBos = patientFamilyMemberInfoBos?.sort((a, b) => a.type - b.type);

        // 家庭状况
        const patientFamilyInfoBo = {
          communityType: values.patientFamilyInfoVo.communityType,
          economicType: values.patientFamilyInfoVo.economicType,
          educationType: values.patientFamilyInfoVo.educationType,
          familyType: values.patientFamilyInfoVo.familyType,
          hukouType: values.patientFamilyInfoVo.hukouType,
          languageId: values.patientFamilyInfoVo.languageId,
          languageType: values.patientFamilyInfoVo.languageType,
          medicalInsuranceType: values.patientFamilyInfoVo.medicalInsuranceType,
        };
        setLanguageTypeShow(patientFamilyInfoBo.languageType); // 方言

        // 行为是异常-显示异常的内容
        const abnormalActionIds = values.isBehaviorUnusual
          ? values.patientAbnormalVos?.map((item) => item.abnormalInfoId)
          : [];

        // 既往医疗康复情况
        let other = '';
        let names = [];
        const patientPastRecoveryConnectBos = values.patientPastRecoveryConnectVos?.map((item) => {
          if (item.pastRecoveryInfoName === '其他') {
            other = item.other;
          }
          names.push(item.pastRecoveryInfoName);
          return item.pastRecoveryInfo + '-' + item.pastRecoveryInfoName;
        });
        // 既往医疗康复情况-显示其他
        setPatientPastRecoveryConnectNames(names);

        // 成长记录
        const patientGrowthRecordBo = {
          caTalkTimeId: values.patientGrowthRecordVo?.caTalkTimeId,
          canClimbTimeId: values.patientGrowthRecordVo?.canClimbTimeId,
          feverTimeId: values.patientGrowthRecordVo?.feverTimeId,
          canGainGroundTimeId: values.patientGrowthRecordVo?.canGainGroundTimeId,
          canLaughTimeId: values.patientGrowthRecordVo?.canLaughTimeId,
          canSitTimeId: values.patientGrowthRecordVo?.canSitTimeId,
          canTurnOverTimeId: values.patientGrowthRecordVo?.canTurnOverTimeId,
          canWalkTimeId: values.patientGrowthRecordVo?.canWalkTimeId,
          supportTypeId: values.patientGrowthRecordVo?.supportTypeId,
        };

        // 出生记录
        const patientBirthRecordBo = {
          birthPlaceType: values.patientBirthRecordVo?.birthPlaceType,
          birthWeightId: values.patientBirthRecordVo?.birthWeightId,
          fetusNumId: values.patientBirthRecordVo?.fetusNumId,
          otherBirthPlace: values.patientBirthRecordVo?.otherBirthPlace,
          birthPlaceDesc: values.patientBirthRecordVo?.birthPlaceDesc,
          pregnancyWeeksId: values.patientBirthRecordVo?.pregnancyWeeksId,
        };
        if (patientBirthRecordBo && patientBirthRecordBo.birthPlaceType) {
          setOtherBirthPlaceShow(patientBirthRecordBo.birthPlaceType); // 医院/其他-显示输入框
        }

        // 高危因素
        let gaoObj = {};
        const backData = values.patientBirthRecordVo?.birthRecordDangerInfoConnectVos;
        dangerTypeArr.forEach((type) => {
          gaoObj[`gao_${type}`] = [];
          backData.forEach((item) => {
            if (type === item.dangerType) {
              gaoObj[`gao_${type}`].push(item.birthDangerInfoId);
            }
          });
        });
        for (let i in gaoObj) {
          if (gaoObj[i].length === 1) {
            gaoObj[i] = gaoObj[i][0];
          }
        }

        // 过敏史
        const patientAllergyConnectBos = values.patientAllergyConnectVos
          ? values.patientAllergyConnectVos.map((item) => {
              return {
                allergyId: item.allergyId,
                description: item.description,
              };
            })
          : [
              {
                allergyId: '',
                description: '',
              },
            ];
        // 家族史
        const patientFamilyDiseaseHistoryBos = values.patientFamilyDiseaseHistoryVos
          ? values.patientFamilyDiseaseHistoryVos.map((item) => {
              return {
                diseaseHistoryId: item.diseaseHistoryId,
                description: item.description,
              };
            })
          : [
              {
                diseaseHistoryId: '',
                description: '',
              },
            ];

        // 病症史
        const patientDiseaseBos = values.patientDiseaseVos
          ? values.patientDiseaseVos.map((item) => {
              return {
                diseaseId: item.diseaseId,
                description: item.description,
              };
            })
          : [
              {
                diseaseId: '',
                description: '',
              },
            ];

        form.setFieldsValue({
          ...gaoObj, //高危因素
          ...patientBasicInfoCreateBo, // 患者基本信息
          patientFamilyMemberInfoBos, // 家庭成员
          ...patientFamilyInfoBo, //家庭状况
          ...patientGrowthRecordBo, // 成长记录
          ...patientBirthRecordBo, //出生记录
          patientPastRecoveryConnectBos,
          other, //既往医疗康复情况-显示其他内容
          abnormalActionIds,
          patientAllergyConnectBos,
          patientFamilyDiseaseHistoryBos,
          patientDiseaseBos,
        });
        setPageLoading(false);
      },
    });
  };

  const queryEnums = async () => {
    const newArr = await queryCommonAllEnums();
    queryMemberType(getSingleEnums('MemberType', newArr)); // 成员类型
    setFamilyTypeList(getSingleEnums('FamilyType', newArr)); // 家庭类型
    setCommunityTypeList(getSingleEnums('CommunityType', newArr)); //居住社区
    setEducationTypeList(getSingleEnums('EducationType', newArr)); //教养方式
    setLanguageTypeList(getSingleEnums('LanguageType', newArr)); //语言环境
    setEconomicTypeList(getSingleEnums('FamilyEconomicType', newArr)); //家庭经济状况
    setHukouTypeList(getSingleEnums('HukouType', newArr)); //户口类别
    setMedicalInsuranceTypeList(getSingleEnums('MedicalInsuranceType', newArr)); //医疗保险情况

    let dangerOptions = getSingleEnums('ParentSectionType', newArr);
    const res = await getParentSectionAll();
    dangerOptions = dangerOptions
      .filter((item) => dangerTypeArr.includes(item.code))
      .map((item) => {
        item.codeCn = item.codeCn.split('-')[1];
        item.children = res
          .filter((sub) => sub.type === item.code)
          .map((sub) => {
            sub.label = sub.name;
            sub.value = sub.id;
            return sub;
          });
        return item;
      });
    setBaseInfoDangerTypeList(dangerOptions); //高危因素类型

    let birthPlaceTypeData = getSingleEnums('BirthPlaceType', newArr);
    birthPlaceTypeData = birthPlaceTypeData.map((item) => {
      item.label = item.codeCn;
      item.value = item.code;
      return item;
    });
    setBirthPlaceTypeList(birthPlaceTypeData); //出生地点类型

    // 编辑和查看详情-获取详情信息
    if (patientId) {
      queryEditInfo(patientId);
    } else {
      setPageLoading(false); // 添加-页面渲染完了就关闭Loading
    }
  };

  // 获取成员类型
  const queryMemberType = (data) => {
    setMemberTypeList(data); // 最底部 勾选父母亲需要用到
    const father = {
      name: '',
      mainCarefulId: '',
      mobile: '',
      birthYear: '',
      profession: {},
      educationDegreeId: '',
    };
    const newData = data
      .map((item) => {
        item.type = item.code;
        Object.keys(father).forEach((sub) => {
          item[sub] = '';
        });
        return item;
      })
      .sort((a, b) => a.ordianl - b.ordianl);
    // 设置家庭成员-3条数据
    form.setFields([
      {
        name: 'patientFamilyMemberInfoBos',
        value: newData,
      },
    ]);
  };

  // 获取下拉信息
  const queryParentSectionAll = async () => {
    const res = await getParentSectionAll();
    setGenderTypeList(res.filter((item) => item.type === 3)); // 性别
    setEthnicList(res.filter((item) => item.type === 4)); // 4 就是民族
    setMainList(res.filter((item) => item.type === 12)); // 主要照顾者
    setProfessionList(res.filter((item) => item.type === 13)); // 职业种类-大类
    setEducationDegreeList(res.filter((item) => item.type === 16)); // 文化程度
    setFangLanguageList(res.filter((item) => item.type === 17)); // 方言
    setAbnormalActionList(res.filter((item) => item.type === 9)); // 异常行为
    setCanTimeList(res.filter((item) => item.type === 11)); // 成长时间
    setSupportTypeList(res.filter((item) => item.type === 10)); // 喂养方式
    setFetusNumList(res.filter((item) => item.type === 8)); // 胎数
    setBirthWeightList(res.filter((item) => item.type === 2)); // 出生体重
    setPregnancyWeeksList(res.filter((item) => item.type === 1)); // 出生孕周
    setPatientAllergyConnectList(res.filter((item) => item.type === 5)); // 过敏史
    setPatientFamilyDiseaseHistoryList(res.filter((item) => item.type === 6)); // 家族史
    setPatientDiseaseList(res.filter((item) => item.type === 7)); // 病症

    let pastRecoveryInfoTypeData = res.filter((item) => item.type === 22);
    pastRecoveryInfoTypeData = pastRecoveryInfoTypeData.map((item) => {
      item.label = item.name;
      item.value = item.id + '-' + item.name;
      return item;
    });
    setPatientPastRecoveryConnectBosList(pastRecoveryInfoTypeData); //既往医疗康复情况类型
  };

  const checkAddress = (rule, value) => {
    if (!value || !value.province) {
      return Promise.reject('请选择省');
    }
    if (!value.city) {
      return Promise.reject('请选择市');
    }
    if (!value.area) {
      return Promise.reject('请选择区');
    }
    if (!value.place) {
      return Promise.reject('请输入详细地址');
    }
    return Promise.resolve();
  };

  const checkProfession = (rule, value) => {
    if (!value || !value.large) {
      return Promise.reject('请选择职业-大类');
    }
    if (!value.medium) {
      return Promise.reject('请选择职业-中类');
    }
    return Promise.resolve();
  };

  useEffect(() => {
    queryParentSectionAll();
    queryEnums();
  }, [patientId]);

  const getTimeOption = () => {
    return canTimeList.map((item) => (
      <Option key={item.id} value={item.id}>
        {item.name}
      </Option>
    ));
  };

  const birthPlaceTypeChange = (e) => {
    const val = e.target.value;
    switch (val) {
      case 1:
        form.setFields([
          {
            name: 'otherBirthPlace',
            value: '',
          },
        ]);
        break;
      case 2:
        form.setFields([
          {
            name: 'birthPlaceDesc',
            value: '',
          },
          {
            name: 'otherBirthPlace',
            value: '',
          },
        ]);
        break;
      case 3:
        form.setFields([
          {
            name: 'birthPlaceDesc',
            value: '',
          },
        ]);
        break;
    }

    setOtherBirthPlaceShow(val);
  };

  const writePersonTypeChange = (code, targetData) => {
    let writeName = '';
    console.log('code', code);
    console.log('targetData', targetData);
    if (!targetData || targetData.length === 0) {
      targetData = form.getFieldValue('patientFamilyMemberInfoBos');
    }

    targetData = targetData.filter((item) => (item.type || item.code) === code);
    writeName = targetData[0]?.name;
    setWritePersonName(writeName);
  };

  const handelCopyText = () => {
    if (!patientId) {
      return message.info('暂无可复制内容，请先获取患者信息');
    }
    const familyMemberNames = [];
    copyText.familyMemberInfoVos?.forEach((item) => {
      const typeStr = `${
        item.type === 1 ? '父亲姓名：' : item.type === 2 ? '母亲姓名：' : '主要照顾者：'
      }`;
      const str = `${typeStr} ${item.name} 联系电话：${item.mobile} 出生年份：${moment(
        item.birthYear,
      ).format('YYYY')}年 职业种类：${item.professionLargeName}-${item.professionMediumName}
      文化程度：${item.educationDegreeName}`;
      familyMemberNames.push(str);
    });

    // 行为
    let patientAbnormalVosNames = [];
    if (copyText.isBehaviorUnusual) {
      patientAbnormalVosNames.push('异常');
      copyText.patientAbnormalVos?.forEach((item) => {
        patientAbnormalVosNames.push(item.abnormalInfoName);
      });
    } else {
      patientAbnormalVosNames.push('正常');
    }

    // 既往医疗康复情况
    let patientPastRecoveryConnectVosNames = [];
    copyText.patientPastRecoveryConnectVos?.forEach((item) => {
      patientPastRecoveryConnectVosNames.push(item.pastRecoveryInfoTypeName);
      if (item.pastRecoveryInfoTypeName === '其他') {
        patientPastRecoveryConnectVosNames.push(item.other);
      }
    });

    // 高危因素
    let birthRecordDangerInfoConnectVosNames = [];
    copyText.patientBirthRecordVo?.birthRecordDangerInfoConnectVos?.forEach((item, index) => {
      if (index === 0) {
        birthRecordDangerInfoConnectVosNames.push(item.dangerTypeName);
      }
      birthRecordDangerInfoConnectVosNames.push(item.dangerName);
    });

    // 过敏史
    const patientAllergyConnectVosNames = [];
    copyText.patientAllergyConnectVos?.forEach((item) => {
      patientAllergyConnectVosNames.push(`${item.allergyName || ''}-${item.description || ''}`);
    });

    // 家族史
    const patientFamilyDiseaseHistoryVosNames = [];
    copyText.patientFamilyDiseaseHistoryVos?.forEach((item) => {
      patientFamilyDiseaseHistoryVosNames.push(
        `${item.diseaseHistoryName || ''}-${item.description || ''}`,
      );
    });

    // 病症史
    const patientDiseaseVosNames = [];
    copyText.patientDiseaseVos?.forEach((item) => {
      patientDiseaseVosNames.push(`${item.diseaseName || ''}-${item.description || ''}`);
    });

    if (copyText) {
      const text = `
身份证号码：${copyText.idCardCode}
户籍所在地：${copyText.provinceName} ${copyText.cityName} ${copyText.regionName} ${
        copyText.household
      }
现居住地址：${copyText.nowProvinceName} ${copyText.nowCityName} ${copyText.nowRegionName} ${
        copyText.nowPlace
      }
邮政编码：${copyText.postCode}
家庭成员：
        ${familyMemberNames.join('\n        ')}
        
家庭状况：
        家庭模式：${copyText.patientFamilyInfoVo?.familyTypeName}
        居住社区：${copyText.patientFamilyInfoVo?.communityTypeName}
        教养方式：${copyText.patientFamilyInfoVo?.educationTypeName}
        语言环境：${copyText.patientFamilyInfoVo?.languageTypeName} ${
        copyText.patientFamilyInfoVo?.languageName || ''
      }
        家庭经济状况：${copyText.patientFamilyInfoVo?.economicTypeName}
        户口类别：${copyText.patientFamilyInfoVo?.hukouTypeName}
        享受医疗保险情况：${copyText.patientFamilyInfoVo?.medicalInsuranceTypeName}
就诊原因：
        行为：${patientAbnormalVosNames.join(' ')}
        既往医疗康复情况：${patientPastRecoveryConnectVosNames.join(' ')}
成长记录：
        喂养方式：${copyText.patientGrowthRecordVo?.supportTypeName || ''}
        高热抽搐：${copyText.patientGrowthRecordVo?.feverTimeName || ''}
        会抬头时间：${copyText.patientGrowthRecordVo?.canGainGroundTimeName || ''}
        会翻身时间：${copyText.patientGrowthRecordVo?.canTurnOverTimeName || ''}
        会爬行时间：${copyText.patientGrowthRecordVo?.canClimbTimeName || ''}
        会笑时间：${copyText.patientGrowthRecordVo?.canLaughTimeName || ''}
        会坐时间：${copyText.patientGrowthRecordVo?.canSitTimeName || ''}
        会走时间：${copyText.patientGrowthRecordVo?.canWalkTimeName || ''}
        会说话时间：${copyText.patientGrowthRecordVo?.caTalkTimeName || ''}
出生记录：
        出生地点：${copyText.patientBirthRecordVo?.birthPlaceTypeName || ''} ${
        copyText.patientBirthRecordVo?.otherBirthPlace || ''
      } 
        出生孕周：${copyText.patientBirthRecordVo?.pregnancyWeeks || ''} 
        出生体重：${copyText.patientBirthRecordVo?.birthWeightName || ''} 
        胎数：${copyText.patientBirthRecordVo?.fetusNumName || ''} 
        高危因素：${birthRecordDangerInfoConnectVosNames.join(' ')} 
过敏史与家族史：
        过敏史：${patientAllergyConnectVosNames.join('\n                       ')}  
        家族史：${patientFamilyDiseaseHistoryVosNames.join('\n                       ')}  
        病症史：${patientDiseaseVosNames.join('\n                       ')}  
`;
      copy(text);
      if (copy(text)) {
        message.success('复制成功');
      } else {
        message.error('复制失败');
      }
    }
  };

  const getBirthRecordDangerInfoBosList = () => {
    return baseInfoDangerTypeList.map((item) => {
      if (item.code === 19) {
        return (
          <Form.Item
            key={item.code}
            labelCol={{ span: 6 }}
            label={item.codeCn}
            name={`gao_${item.code}`}
          >
            <Checkbox.Group options={item.children} />
          </Form.Item>
        );
      } else {
        return (
          <Form.Item
            key={item.code}
            labelCol={{ span: 6 }}
            label={item.codeCn}
            name={`gao_${item.code}`}
          >
            <Radio.Group options={item.children} />
          </Form.Item>
        );
      }
    });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{
        createDocumentTime: moment(),
        isBehaviorUnusual: false,
      }}
    >
      <Card loading={pageLoading} bordered={false}>
        <Row>
          <Col span={15}>
            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  label="邮政编码"
                  name="postCode"
                  rules={[{ required: true, message: '请输入邮政编码' }]}
                >
                  <Input
                    style={{ width: 'calc(100% - 4px)', marginLeft: 4 }}
                    placeholder="请输入邮政编码"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  label="身份证号码"
                  name="idCardCode"
                  rules={[
                    { required: true, message: '请输入身份证号码' },
                    {
                      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                      message: '身份证格式不正确',
                    },
                  ]}
                >
                  <Input
                    style={{ width: 'calc(100% - 4px)', marginLeft: 4 }}
                    placeholder="请输入身份证号码"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  label="户籍所在地"
                  name="regionAddress"
                  rules={[
                    {
                      required: true,
                      message: '请选择户籍所在地',
                    },
                    {
                      validator: checkAddress,
                    },
                  ]}
                >
                  <CitySelect />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  label="现居住地址"
                  name="nowAddress"
                  rules={[
                    {
                      required: true,
                      message: '请选择现居住地址',
                    },
                    {
                      validator: checkAddress,
                    },
                  ]}
                >
                  <CitySelect />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Card
        loading={pageLoading}
        style={{ marginTop: 20 }}
        title={
          <>
            <Image preview={false} className="mr8" src={family} width={30} height={30} />
            家庭成员
          </>
        }
        bordered={false}
      >
        <Form.List name="patientFamilyMemberInfoBos">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                return (
                  <div key={field.key}>
                    <Row>
                      <Col span={6}>
                        {index !== 2 && (
                          <Form.Item
                            {...field}
                            name={[field.name, 'name']}
                            fieldKey={[field.fieldKey, 'name']}
                            {...FormRecordItemLayout}
                            label={index === 0 ? '父亲姓名' : '母亲姓名'}
                          >
                            <Input placeholder="请填写姓名" />
                          </Form.Item>
                        )}

                        {index === 2 && (
                          <Form.Item
                            {...field}
                            name={[field.name, 'mainCarefulId']}
                            fieldKey={[field.fieldKey, 'mainCarefulId']}
                            {...FormRecordItemLayout}
                            label="主要照顾者"
                            rules={[{ required: true, message: '请选择主要照顾者' }]}
                          >
                            <Select placeholder="请选择主要照顾者">
                              {mainList.map((item) => (
                                <Option key={item.id} value={item.id}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        )}
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'mobile']}
                          fieldKey={[field.fieldKey, 'mobile']}
                          {...FormRecordItemLayout}
                          label="联系电话"
                          rules={
                            index === 2
                              ? [
                                  { required: true, message: '请填写联系电话' },
                                  {
                                    pattern: /^[0-9]*$/,
                                    message: '请填写正确的电话号码',
                                  },
                                ]
                              : null
                          }
                        >
                          <Input placeholder="请填写联系电话" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'birthYear']}
                          fieldKey={[field.fieldKey, 'birthYear']}
                          {...FormRecordItemLayout}
                          label="出生年份"
                          rules={
                            index === 2 ? [{ required: true, message: '请选择出生年份' }] : null
                          }
                        >
                          <DatePicker
                            disabledDate={(current) => {
                              return current && current > moment().endOf('year');
                            }}
                            picker="year"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'educationDegreeId']}
                          fieldKey={[field.fieldKey, 'educationDegreeId']}
                          labelCol={{ span: 8 }}
                          label="文化程度"
                          rules={
                            index === 2 ? [{ required: true, message: '请选择文化程度' }] : null
                          }
                        >
                          <Select placeholder="请选择文化程度">
                            {educationDegreeList.map((item) => (
                              <Option key={item.id} value={item.id}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'profession']}
                          fieldKey={[field.fieldKey, 'profession']}
                          label="职业种类"
                          labelCol={{ span: 2 }}
                          rules={
                            index === 2
                              ? [
                                  { required: true, message: '请选择职业种类' },
                                  {
                                    validator: checkProfession,
                                  },
                                ]
                              : null
                          }
                        >
                          <ProfessionSelect professionList={professionList} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </>
          )}
        </Form.List>
      </Card>

      <Card
        loading={pageLoading}
        style={{ marginTop: 20 }}
        title={
          <>
            <Image preview={false} className="mr8" src={family} width={30} height={30} />
            家庭状况
          </>
        }
        bordered={false}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              {...FormMoreItemLayout}
              label="家庭模式"
              name="familyType"
              rules={[{ required: true, message: '请选择家庭模式' }]}
            >
              <Radio.Group>
                {familyTypeList.map((item) => (
                  <Radio key={item.code} value={item.code}>
                    {item.codeCn}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              {...FormMoreItemLayout}
              label="居住社区"
              name="communityType"
              rules={[{ required: true, message: '请选择居住社区' }]}
            >
              <Radio.Group>
                {communityTypeList.map((item) => (
                  <Radio key={item.code} value={item.code}>
                    {item.codeCn}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              {...FormMoreItemLayout}
              label="教养方式"
              name="educationType"
              rules={[{ required: true, message: '请选择教养方式' }]}
            >
              <Radio.Group>
                {educationTypeList.map((item) => (
                  <Radio key={item.code} value={item.code}>
                    {item.codeCn}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 9 }}
              label="语言环境"
              name="languageType"
              rules={[{ required: true, message: '请选择语言环境' }]}
            >
              <Radio.Group
                onChange={(e) => {
                  setLanguageTypeShow(e.target.value);
                  if (e.target.value === 1) {
                    form.setFields([
                      {
                        name: 'languageId',
                        value: '',
                      },
                    ]);
                  }
                }}
              >
                {languageTypeList.map((item) => (
                  <Radio key={item.code} value={item.code}>
                    {item.codeCn}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12} style={{ marginLeft: -100 }}>
            {languageTypeShow === 2 && (
              <Form.Item
                style={{ width: 150 }}
                name="languageId"
                rules={[{ required: true, message: '请选择地方方言' }]}
              >
                <Select size="small" style={{ width: 100 }} placeholder="请选择地方方言">
                  {fangLanguageList.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              {...FormMoreItemLayout}
              label="家庭经济状况"
              name="economicType"
              rules={[{ required: true, message: '请选择家庭经济状况' }]}
            >
              <Radio.Group>
                {economicTypeList.map((item) => (
                  <Radio key={item.code} value={item.code}>
                    {item.codeCn}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              {...FormMoreItemLayout}
              label="户口类别"
              name="hukouType"
              rules={[{ required: true, message: '请选择户口类别' }]}
            >
              <Radio.Group>
                {hukouTypeList.map((item) => (
                  <Radio key={item.code} value={item.code}>
                    {item.codeCn}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              {...FormMoreItemLayout}
              label="享受医疗保险情况"
              name="medicalInsuranceType"
              rules={[{ required: true, message: '请选择享受医疗保险情况' }]}
            >
              <Radio.Group>
                {medicalInsuranceTypeList.map((item) => (
                  <Radio key={item.code} value={item.code}>
                    {item.codeCn}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card
        loading={pageLoading}
        style={{ marginTop: 20 }}
        title={
          <>
            <Image preview={false} className="mr8" src={why} width={30} height={30} />
            就诊原因
          </>
        }
        bordered={false}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item labelCol={{ span: 9 }} label="行为" name="isBehaviorUnusual">
              <Radio.Group onChange={(e) => setIsBehaviorUnusualShow(e.target.value)}>
                <Radio value={false}>正常</Radio>
                <Radio value={true}>异常</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12} style={{ marginLeft: -100 }}>
            {isBehaviorUnusualShow && (
              <Form.Item name="abnormalActionIds">
                <Select mode="multiple" size="small" placeholder="请选择异常情况(可多选)">
                  {abnormalActionList.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              {...FormMoreItemLayout}
              label="既往医疗康复情况"
              name="patientPastRecoveryConnectBos"
            >
              <Checkbox.Group
                onChange={(codeArr) => {
                  codeArr = codeArr.map((item) => {
                    return item.split('-')[1];
                  });
                  setPatientPastRecoveryConnectNames(codeArr);
                  if (!codeArr.includes('其他')) {
                    form.setFields([
                      {
                        name: 'other',
                        value: '',
                      },
                    ]);
                  }
                }}
                options={patientPastRecoveryConnectBosList}
              />
            </Form.Item>
            {patientPastRecoveryConnectNames.includes('其他') && (
              <Form.Item {...FormMoreItemLayout} name="other">
                <Input />
              </Form.Item>
            )}
          </Col>
        </Row>
      </Card>

      <Card
        loading={pageLoading}
        style={{ marginTop: 20 }}
        title={
          <>
            <Image preview={false} className="mr8" src={chengz} width={30} height={30} />
            成长记录
          </>
        }
        bordered={false}
      >
        <Row>
          <Col span={20}>
            <Row>
              <Col span={8}>
                <Form.Item {...FormRecordItemLayout} label="喂养方式" name="supportTypeId">
                  <Select placeholder="请选择">
                    {supportTypeList.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...FormRecordItemLayout} label="高热抽搐" name="feverTimeId">
                  <Select placeholder="请选择">{getTimeOption()}</Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...FormRecordItemLayout} label="会抬头时间" name="canGainGroundTimeId">
                  <Select placeholder="请选择">{getTimeOption()}</Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item {...FormRecordItemLayout} label="会翻身时间" name="canTurnOverTimeId">
                  <Select placeholder="请选择">{getTimeOption()}</Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...FormRecordItemLayout} label="会爬行时间" name="canClimbTimeId">
                  <Select placeholder="请选择">{getTimeOption()}</Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...FormRecordItemLayout} label="会笑时间" name="canLaughTimeId">
                  <Select placeholder="请选择">{getTimeOption()}</Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item {...FormRecordItemLayout} label="会坐时间" name="canSitTimeId">
                  <Select placeholder="请选择">{getTimeOption()}</Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...FormRecordItemLayout} label="会走时间" name="canWalkTimeId">
                  <Select placeholder="请选择">{getTimeOption()}</Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...FormRecordItemLayout} label="会说话时间" name="caTalkTimeId">
                  <Select placeholder="请选择">{getTimeOption()}</Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Card
        loading={pageLoading}
        style={{ marginTop: 20 }}
        title={
          <>
            <Image preview={false} className="mr8" src={chusheng} width={30} height={30} />
            出生记录
          </>
        }
        bordered={false}
      >
        <Row>
          <Col span={12}>
            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 12 }}
                  label="出生地点"
                  name="birthPlaceType"
                >
                  <Radio.Group onChange={(e) => birthPlaceTypeChange(e)}>
                    {birthPlaceTypeList.map((item) => (
                      <Radio key={item.code} value={item.code}>
                        {item.codeCn}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
                {otherBirthPlaceShow === 1 && (
                  <Form.Item wrapperCol={{ span: 12, offset: 4 }} name="birthPlaceDesc">
                    <Input placeholder="请输入具体医院信息" />
                  </Form.Item>
                )}
                {otherBirthPlaceShow === 3 && (
                  <Form.Item wrapperCol={{ span: 12, offset: 4 }} name="otherBirthPlace">
                    <Input placeholder="请输入其他出生地点" />
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 12 }}
                  label="出生孕周"
                  name="pregnancyWeeksId"
                >
                  <Select placeholder="请选择">
                    {pregnancyWeeksList.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 12 }}
                  label="出生体重"
                  name="birthWeightId"
                >
                  <Select placeholder="请选择">
                    {birthWeightList.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 12 }}
                  label="胎数"
                  name="fetusNumId"
                >
                  <Select placeholder="请选择">
                    {fetusNumList.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={24}>{getBirthRecordDangerInfoBosList()}</Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Card
        style={{ marginTop: 20 }}
        title={
          <>
            <Image preview={false} className="mr8" src={guomin} width={30} height={30} />
            过敏史与家族史
          </>
        }
        bordered={false}
      >
        <Row gutter={16}>
          <Col span={16}>
            <MedicalHistorySelect
              form={form}
              list={patientAllergyConnectList}
              name="patientAllergyConnectBos"
              label="过敏史"
              postFields={['allergyId', 'description']}
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={16}>
            <MedicalHistorySelect
              form={form}
              list={patientFamilyDiseaseHistoryList}
              name="patientFamilyDiseaseHistoryBos"
              label="家族史"
              postFields={['diseaseHistoryId', 'description']}
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={16}>
            <MedicalHistorySelect
              form={form}
              list={patientDiseaseList}
              name="patientDiseaseBos"
              label="病症史"
              postFields={['diseaseId', 'description']}
            />
          </Col>
        </Row>
      </Card>
      <FooterToolbar>
        {getErrorInfo(error)}

        {getAuth(authKey)?.canEdit && (
          <>
            <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
              提交
            </Button>
            <Button style={{ marginBottom: 20 }} type="primary" onClick={handelCopyText}>
              复制本页文档内容
            </Button>
          </>
        )}
      </FooterToolbar>
    </Form>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['patriarchAndChildrenRecord/create'],
}))(BaseInfo);
