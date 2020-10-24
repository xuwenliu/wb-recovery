import request from 'umi-request';

// 部门管理
export async function createDept(data) {
  return request('/api/resource/dept/create', {
    method: 'POST',
    data,
  });
}
export async function deleteDept(data) {
  return request(`/api/resource/dept/delete/${data.id}`, {
    method: 'DELETE',
  });
}
export async function getDeptList(data) {
  return request('/api/resource/dept/list', {
    method: 'POST',
    data,
  });
}
export async function getDeptAllList() {
  return request('/api/resource/dept/all', {
    method: 'GET',
  });
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
  return request(`/api/resource/employee/delete/${data.id}`, {
    method: 'DELETE',
  });
}
export async function getEmployeeList(data) {
  return request('/api/resource/employee/list', {
    method: 'POST',
    data,
  });
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
