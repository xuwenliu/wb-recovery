import request from 'umi-request';

// 家长端栏位
export async function getParentSectionAll(params) {
  return request('/api/resource/section/parentSection/all', {
    params,
  });
}

export async function createParent(data) {
  return request('/api/resource/section/parent/create', {
    method: 'POST',
    data,
  });
}

export async function getParentSectionChildren(params) {
  return request(`/api/resource/section/parentSection/children/${params.parentId}`);
}

// 医学检查栏位
export async function getCheckAll(params) {
  return request('/api/resource/section/check/all', {
    params,
  });
}

// 医学检查树形
export async function getCheckTree(params) {
  return request('/api/resource/section/check/tree', {
    params,
  });
}


export async function createCheck(data) {
  return request('/api/resource/section/check/create', {
    method: 'POST',
    data,
  });
}

export async function getCheckChildren(params) {
  return request(`/api/resource/section/medicalCheck/children/${params.parentId}`);
}

// 综合评估、教案及档案管理栏位设置
export async function getComprehensiveAllSection(params) {
  return request('/api/resource/section/comprehensive/allSection', {
    params,
  });
}
export async function createComprehensive(data) {
  return request('/api/resource/section/comprehensive/create', {
    method: 'POST',
    data,
  });
}

// 汇入数据显示设置
export async function getImportData(params) {
  return request('/api/resource/section/importData/all', {
    params,
  });
}
export async function createImportData(data) {
  return request('/api/resource/section/importData/create', {
    method: 'POST',
    data,
  });
}
export async function updateImportData(data) {
  return request('/api/resource/section/importData/update', {
    method: 'POST',
    data,
  });
}
export async function getImportDataChildren(params) {
  return request(`/api/resource/section/importData/children/${params.parentId}`);
}
