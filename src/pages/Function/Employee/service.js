import request from 'umi-request';

// 部门管理
export async function createDept(data) {
  return request('/api/resource/dept/create', {
    method: 'POST',
    data,
  });
}
export async function deleteDept(data) {
  return request(`/api/resource/dept/delete`, {
    method: 'DELETE',
    data
  });
}
export async function getDeptList(data) {
  return request('/api/resource/dept/list', {
    method: 'POST',
    data,
  });
}
export async function getDeptAllList() {
  return request('/api/resource/dept/all');
}
export async function getDeptRoles(data) {
  return request(`/api/resource/dept/roles/${data.id}`, {
    method: 'GET',
  });
}
export async function updateDept(data) {
  return request('/api/resource/dept/update', {
    method: 'POST',
    data,
  });
}



// 人员管理
export async function createEmployee(data) {
  return request('/api/resource/employee/create', {
    method: 'POST',
    data,
  });
}
export async function deleteEmployee(data) {
  return request('/api/resource/employee/delete', {
    method: 'DELETE',
    data
  });
}
export async function getEmployeeList(data) {
  return request('/api/resource/employee/list', {
    method: 'POST',
    data,
  });
}
export async function getEmployeeAllList() {
  return request('/api/resource/employee/all');
}
export async function getEmployeeSingle(data) {
  return request(`/api/resource/employee/single/${data.id}`, {
    method: 'GET',
  });
}
export async function updateEmployee(data) {
  return request('/api/resource/employee/update', {
    method: 'POST',
    data,
  });
}


// 角色管理
export async function createRole(data) {
  return request('/api/resource/role/create', {
    method: 'POST',
    data,
  });
}
export async function deleteRole(data) {
  return request('/api/resource/role/delete', {
    method: 'DELETE',
    data
  });
}
export async function getRoleList(data) {
  return request('/api/resource/role/list', {
    method: 'POST',
    data,
  });
}
export async function getRoleAllList() {
  return request('/api/resource/role/allPermission');
}
export async function getRoleSingle(data) {
  return request(`/api/resource/role/single/${data.id}`, {
    method: 'GET',
  });
}
export async function updateRole(data) {
  return request('/api/resource/role/update', {
    method: 'POST',
    data,
  });
}