import request from 'umi-request';

// 所有个案病例编号
export async function getSpecialAllCaseCode() {
  return request('/api/resource/special/allCaseCode');
}
// 编辑教学记录
export async function saveEditRecord(data) {
  return request('/api/resource/special/editRecord', {
    method: 'POST',
    data,
  });
}
// 教学计划列表
export async function getSpecialPage(data) {
  return request('/api/resource/special/page', {
    method: 'POST',
    data,
  });
}
// 教学记录
export async function getAllEduRecord(params) {
  return request('/api/resource/special/allEduRecord', {
    params,
  });
}

// 计划内所有套餐
export async function getSpecialPackages(params) {
  return request('/api/resource/special/packages', {
    params,
  });
}

// 套餐内课程
export async function getAllClassOfPackage(params) {
  return request('/api/resource/special/allClassOfPackage', {
    params,
  });
}
// 更新教案
export async function updatePlan(data) {
  return request('/api/resource/special/updatePlan', {
    method: 'POST',
    data,
  });
}
// 计划内所有单独课程
export async function getAllClassAdd(params) {
  return request('/api/resource/special/allClass', {
    params,
  });
}
