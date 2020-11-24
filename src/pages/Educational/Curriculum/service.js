import request from 'umi-request';

export async function getClass(data) {
  return request('/api/resource/packages/class/pageClass', {
    method: 'POST',
    data,
  });
}
export async function removeClass(params) {
  return request('/api/resource/packages/class/delete', {
    method: 'DELETE',
    params,
  });
}
export async function createClass(data) {
  return request('/api/resource/packages/class/create', {
    method: 'POST',
    data,
  });
}
export async function getClassInfo(params) {
  return request('/api/resource/packages/classInfo', {
    params,
  });
}
export async function getAllClass() {
  return request('/api/resource/packages/class/allClass');
}
