import request from 'umi-request';

export async function queryRule(params) {
  return request('/api/function/employee', {
    params,
  });
}
export async function removeRule(params) {
  return request('/api/function/employee', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/function/employee', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/function/employee', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
export async function getInfo(params) {
  return request('/api/function/employee/info', {
    params,
  });
}
