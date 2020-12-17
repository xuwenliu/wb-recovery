import request from 'umi-request';

export async function getLoginRecord(data) {
  return request('/api/resource/user/loginRecord', {
    method: 'POST',
    data,
  });
}

// 查看信息，管理员账号无信息
export async function getUserInfo() {
  return request('/api/resource/user/info', {
    method: 'POST',
  });
}

// 更新信息
export async function updateUserInfo(data) {
  return request('/api/resource/user/updateInfo', {
    method: 'POST',
    data,
  });
}

// 更新密码
export async function updatePasswords(data) {
  return request('/api/resource/user/updatePasswords', {
    method: 'POST',
    data,
  });
}

export async function getUserPermissions() {
  return request('/api/resource/user/permissions', {
    method: 'POST',
  });
}
