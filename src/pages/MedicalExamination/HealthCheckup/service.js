import request from 'umi-request';

export async function getPhysiquePatientInfo(params) {
  return request('/api/resource/physique/patientInfo', {
    params,
  });
}
export async function createPhysique(data) {
  return request('/api/resource/physique/create', {
    method: 'POST',
    data,
  });
}
export async function getPhysiqueList(data) {
  return request('/api/resource/physique/record', {
    method: 'POST',
    data,
  });
}
//所有病例编号
export async function getPhysiqueAllCaseCode() {
  return request('/api/resource/physique/allCaseCode');
}

// 曲线图
export async function getPhysiqueGraphData(params) {
  return request('/api/resource/physique/graphData', {
    params,
  });
}
