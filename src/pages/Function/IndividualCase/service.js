import request from 'umi-request';

// 个案列表
export async function getSpecialList(data) {
  return request('/api/resource/patient/info/special', {
    method: 'POST',
    data,
  });
}
