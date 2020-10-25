import request from '@/utils/request';

export async function getCommonEnums(params) {
  return request('/common/enums', {
    params: params,
  });
}
