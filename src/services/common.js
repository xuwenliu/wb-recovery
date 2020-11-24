import request from '@/utils/request';

export async function getCommonAllEnums() {
  return request('/common/allEnumsData');
}
export async function getCommonEnums(params) {
  return request('/common/enums', {
    params: params,
  });
}
export async function getCommonRegion(params) {
  return request('/common/region', {
    params: params,
  });
}
