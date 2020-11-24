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
