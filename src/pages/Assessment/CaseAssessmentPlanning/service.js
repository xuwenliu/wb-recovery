import request from 'umi-request';

// 所有小组评估成员
export async function getSpecialAssessMembers() {
  return request('/api/resource/groupAssess/specialAssessMembers');
}

// 小组评估规划
export async function createSavePlan(data) {
  return request('/api/resource/groupAssess/savePlan', {
    method: 'POST',
    data,
  });
}
// 规划信息
export async function getPlanInfo(params) {
  return request('/api/resource/groupAssess/planInfo', {
    params,
  });
}
