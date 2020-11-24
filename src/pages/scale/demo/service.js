import request from '@/utils/request';

export async function login(values) {
  return request('/api/login/execute', {
    method: 'POST',
    data: { type: values.type, key: values.userName, value: values.password },
  });
}

export async function listType() {
  const url = `/api/scale/type`;
  return request(url, {
    method: 'GET',
  });
}
