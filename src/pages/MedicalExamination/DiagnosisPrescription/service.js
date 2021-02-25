import request from 'umi-request';

//全部就诊问题
export async function getAllProblem() {
  return request('/api/resource/visiting/allProblem');
}

//所有既往史
export async function getAllPast() {
  return request('/api/resource/visiting/allPast');
}

// 所有疫苗
export async function getAllVaccine() {
  return request('/api/resource/visiting/allVaccine');
}

// 高危因素
export async function getAllVisitingDanger() {
  return request('/api/resource/visiting/allVisitingDanger');
}
// 全部治疗处方
export async function getAllPrescription() {
  return request('/api/resource/visiting/allPrescription');
}
export async function createVisiting(data) {
  return request('/api/resource/visiting/create', {
    method: 'POST',
    data,
  });
}

// 医学检查记录详细
export async function getVisitingSingle(params) {
  return request('/api/resource/visiting/single', {
    params,
  });
}

export async function getLastVisiting(params) {
  return request('/api/resource/visiting/lastVisiting', {
    params,
  });
}

// 患者家庭成员列表
export async function getFamilyMember(params) {
  return request('/api/resource/visiting/familyMember', {
    params,
  });
}

// 门诊复查消息推送
export async function messagePush(data) {
  return request('/api/resource/visiting/messagePush', {
    method: 'POST',
    data,
  });
}
