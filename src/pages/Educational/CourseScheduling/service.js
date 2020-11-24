import request from 'umi-request';

// 创建排课
export async function createClass(params) {
  return request('/api/resource/packages/package/create', {
    method: 'POST',
    params,
  });
}
