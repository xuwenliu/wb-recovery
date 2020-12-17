import request from 'umi-request';

export async function getPatientInfoList(data) {
  return request('/api/resource/patient/info/list', {
    method: 'POST',
    data,
  });
}

export async function createPatientInfo(data) {
  return request('/api/resource/patient/info/create', {
    method: 'POST',
    data,
  });
}

export async function updatePatientInfo(data) {
  return request('/api/resource/patient/info/update', {
    method: 'POST',
    data,
  });
}

export async function getPatientInfoSingle(params) {
  return request(`/api/resource/patient/info/single`, {
    params,
  });
}

export async function getAllBirthDangerInfo() {
  return request('/api/resource/patient/info/allBirthDangerInfo');
}

// 设置为个案
export async function setSpecial(params) {
  return request('/api/resource/patient/info/setSpecial', {
    method: 'POST',
    params,
  });
}
// 取消个案
export async function recallSpecial(params) {
  return request('/api/resource/patient/info/recallSpecial', {
    method: 'POST',
    params,
  });
}
