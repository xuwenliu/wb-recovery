import request from 'umi-request';

// 创建排课
export async function createClass(data) {
  return request('/api/resource/arrangeClass/save', {
    method: 'POST',
    data,
  });
}

// 所有患者
export async function getAllPatient() {
  return request('/api/resource/arrangeClass/allPatient');
}

// 课表
export async function getList(data) {
  return request('/api/resource/arrangeClass/list', {
    method: 'POST',
    data,
  });
}

// 上课统计
export async function getStatistics(data) {
  return request('/api/resource/arrangeClass/statistics', {
    method: 'POST',
    data,
  });
}
