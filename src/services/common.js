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
  const res = await request('/api/resource/file/upload', {
    method: 'POST',
    data,
  });
  if (res) {
    const params = {
      fileName: res,
    };
    const url = await request('/api/resource/file/downloadUrl', {
      params,
    });
    return {
      name: res, // 文件名
      url, // 文件地址
    };
  }
}
export async function getQrCode() {
  return request('/api/resource/QrCode/generate');
}
