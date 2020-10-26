import request from 'umi-request';

// 家长端栏位
export async function getParentSectionAll(params) {
  return request('/api/resource/section/parentSection/all', {
    params,
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

// 医学检查栏位
export async function getCheckAll(params) {
  return request('/api/resource/section/check/all', {
    params,
  });
}

export async function createCheck(data) {
  return request('/api/resource/section/check/create', {
    method: 'POST',
    data,
  });
}

export async function getCheckChildren(params) {
  return request(`/api/resource/section/medicalCheck/children/${params.parentId}`);
}