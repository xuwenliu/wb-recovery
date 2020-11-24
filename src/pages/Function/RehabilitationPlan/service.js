import request from 'umi-request';

// 创建套餐
export async function createPackage(params) {
  return request('/api/resource/packages/package/create', {
    method: 'POST',
    params,
  });
}
// 所有套餐
export async function getAllPackage() {
  return request('/api/resource/packages/package/allPackage');
}
// 更新套餐
export async function updatePackage(data) {
  return request('/api/resource/packages/package/update', {
    method: 'POST',
    data,
  });
}
// 删除套餐
export async function removePackage(data) {
  return request(`/api/resource/packages/package/delete/${data.packageId}`, {
    method: 'DELETE',
  });
}
// 新增、修改、删除 套餐下的课程
export async function updatePackageClass(data) {
  return request('/api/resource/packages/updatePackageClass', {
    method: 'POST',
    data,
  });
}
