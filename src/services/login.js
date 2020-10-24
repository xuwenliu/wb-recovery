import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request('/api/login', {
    method: 'POST',
    params: params,
  });
}

export async function fakeAccountLogout() {
  return request('/api/logout', {
    method: 'POST',
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/common/verificationCode?mobile=${mobile}`);
}
