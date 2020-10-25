import request from 'umi-request';

export async function getParentSectionAll(params) {
  return request('/api/resource/section/parentSection/all', {
    params
  });
}

export async function createParent(data) {
  return request('/api/resource/section/parent/create', {
    method: 'POST',
    data,
  });
}

export async function getParentSectionChildren(params) {
  return request(`/api/resource/section/parentSection/children/${params.parentId}`);
}
