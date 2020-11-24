import request from 'umi-request';

export async function getRecord(data) {
  return request('/api/resource/visiting/record', {
    method:'POST',
    data,
  });
}
