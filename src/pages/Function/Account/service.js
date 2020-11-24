import request from 'umi-request';

export async function getLoginRecord(params) {
  return request('/api/resource/visiting/record', {
    params,
  });
}
