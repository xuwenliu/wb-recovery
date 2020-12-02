import request from 'umi-request';

export async function getProjectList(data) {
  return request('/api/resource/project/list', {
    method: 'POST',
    data,
  });
}

// 所有立项编号
export async function getProjectAllCode() {
  return request('/api/resource/project/allCode');
}

// 所有立项参与人
export async function getProjectAllEmployee() {
  return request('/api/resource/project/allEmployee');
}

// 所有立项名称
export async function getProjectAllName() {
  return request('/api/resource/project/allName');
}
// 所有研究立项
export async function getProjectAllProject() {
  return request('/api/resource/project/allProject');
}

export async function createProject(data) {
  return request('/api/resource/project/create', {
    method: 'POST',
    data,
  });
}
export async function deleteProject(data) {
  return request(`/api/resource/project/delete`, {
    method: 'DELETE',
    data,
  });
}

export async function updateProject(data) {
  return request('/api/resource/project/update', {
    method: 'POST',
    data,
  });
}

export async function getProjectSingle(data) {
  return request(`/api/resource/project/single/${data.id}`, {
    method: 'POST',
  });
}

// 个案列表
export async function getSpecialList(data) {
  return request('/api/resource/patient/info/special', {
    method: 'POST',
    data,
  });
}
