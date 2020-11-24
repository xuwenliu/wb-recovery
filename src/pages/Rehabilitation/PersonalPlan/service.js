import request from 'umi-request';

// 教学计划列表
export async function getDetailPage(data) {
  return request('/api/resource/specialEdu/detailPage', {
    method: 'POST',
    data,
  });
}
// 创建计划
export async function saveSpecialEdu(data) {
  return request('/api/resource/specialEdu/save', {
    method: 'POST',
    data,
  });
}
// 计划详情
export async function getSpecialEduSingle(params) {
  return request('/api/resource/specialEdu/single', {
    params,
  });
}
// 教学记录
export async function getAllEduRecord(params) {
  return request('/api/resource/specialEdu/allEduRecord', {
    params,
  });
}
// 所有个案病例编号
export async function getSpecialEduAllCaseCode() {
  return request('/api/resource/specialEdu/allCaseCode');
}
// 编辑教学记录
export async function saveEditRecord(data) {
  return request('/api/resource/specialEdu/editRecord', {
    method: 'POST',
    data,
  });
}
