import request from 'umi-request';

export async function getSitePage(data) {
  return request('/api/resource/site/page', {
    method: 'POST',
    data,
  });
}
export async function removeSite(params) {
  return request('/api/resource/site/delete', {
    method: 'DELETE',
    params,
  });
}
export async function saveSite(data) {
  return request('/api/resource/site/save', {
    method: 'POST',
    data,
  });
}

export async function getInfo(params) {
  return request('/api/resource/site/single', {
    params,
  });
}
