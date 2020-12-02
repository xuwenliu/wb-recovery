import request from '@/utils/request';

export async function getCommonAllEnums() {
  return request('/common/allEnumsData');
}
export async function getCommonEnums(params) {
  return request('/common/enums', {
    params,
  });
}
export async function getCommonRegion(params) {
  return request('/common/region', {
    params,
  });
}

export async function fileUpload(data) {
  return request('/api/resource/file/upload', {
    method: 'POST',
    data,
  });
}
