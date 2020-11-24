import request from 'umi-request';

// 病因分类
export async function getAllDiseaseReason() {
  return request('/api/resource/groupAssess/allDiseaseReason');
}

// 所有病症或异常
export async function getAllDisease() {
  return request('/api/resource/groupAssess/allDisease');
}

export async function createGroupAssess(data) {
  return request('/api/resource/groupAssess/save', {
    method: 'POST',
    data,
  });
}
// 所有病例编号，个案患者且包含数据权限
export async function getAllCaseCode() {
  return request('/api/resource/groupAssess/allCaseCode');
}

// 患者的最近一次小组评估
export async function getGroupAssessSingle(params) {
  return request('/api/resource/groupAssess/single', {
    params,
  });
}
