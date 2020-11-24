import request from 'umi-request';

// 计划列表
export async function getCollectiveEduPage(data) {
  return request('/api/resource/collectiveEdu/page', {
    method: 'POST',
    data,
  });
}

// 创建计划
export async function saveCollectiveEdu(data) {
  return request('/api/resource/collectiveEdu/save', {
    method: 'POST',
    data,
  });
}
// 计划详情
export async function getCollectiveEduDetail(params) {
  return request('/api/resource/collectiveEdu/detail', {
    params,
  });
}

// 删除计划
export async function deletePlan(params) {
  return request('/api/resource/collectiveEdu/deletePlan', {
    method: 'DELETE',
    params,
  });
}

// 删除详细
export async function deleteDetail(data) {
  return request('/api/resource/collectiveEdu/deleteDetail', {
    method: 'DELETE',
    data,
  });
}
