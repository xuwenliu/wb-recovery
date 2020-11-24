import request from 'umi-request';

// 所有训练方法
export async function getAllTrainWay(params) {
  return request('/api/resource/train/allTrainWay', {
    params,
  });
}

// 提交 粗大动作
export async function saveRoughActivity(data) {
  return request('/api/resource/train/saveRoughActivity', {
    method: 'POST',
    data,
  });
}

// 获取 粗大动作数据
export async function getRoughActivityInfo(params) {
  return request('/api/resource/train/roughActivityInfo', {
    params,
  });
}

// 提交 评定与分级信息
export async function saveTrainAndTarget(data) {
  return request('/api/resource/train/saveTrainAndTarget', {
    method: 'POST',
    data,
  });
}
// 获取 评定与分级信息
export async function getTrainAndTargetInfo(params) {
  return request('/api/resource/train/trainAndTargetInfo', {
    params,
  });
}

// 提交 精细动作信息
export async function saveCareFulActivity(data) {
  return request('/api/resource/train/saveCareFulActivity', {
    method: 'POST',
    data,
  });
}
// 获取 精细动作信息
export async function getCarefulActivityInfo(params) {
  return request('/api/resource/train/carefulActivityInfo', {
    params,
  });
}

// 提交 认知能力训练
export async function saveTrainCognition(data) {
  return request('/api/resource/train/saveTrainCognition', {
    method: 'POST',
    data,
  });
}

// 获取 认知能力训练
export async function getTrainCognitionInfo(params) {
  return request('/api/resource/train/trainCognitionInfo', {
    params,
  });
}

// 提交 社会适应
export async function saveTrainAdaptation(data) {
  return request('/api/resource/train/saveTrainAdaptation', {
    method: 'POST',
    data,
  });
}

// 获取 社会适应
export async function getTrainAdaptationInfo(params) {
  return request('/api/resource/train/trainAdaptationInfo', {
    params,
  });
}

// 获取 所有辅具
export async function getAllAssistive() {
  return request('/api/resource/train/allAssistive');
}
// 提交 环境与辅具
export async function saveTrainEnv(data) {
  return request('/api/resource/train/saveTrainEnv', {
    method: 'POST',
    data,
  });
}

// 获取 环境与辅具
export async function getTrainEnvInfo(params) {
  return request('/api/resource/train/trainEnvInfo', {
    params,
  });
}

// 提交 语言能力
export async function saveLanguageInfo(data) {
  return request('/api/resource/train/saveLanguageInfo', {
    method: 'POST',
    data,
  });
}

// 获取 语言能力
export async function getLanguageInfo(params) {
  return request('/api/resource/train/languageInfo', {
    params,
  });
}
// 获取 所有能力
export async function getAllAbility() {
  return request('/api/resource/train/allAbility');
}

// 提交 生活自理
export async function saveTrainSelfCare(data) {
  return request('/api/resource/train/saveTrainSelfCare', {
    method: 'POST',
    data,
  });
}

// 获取 生活自理
export async function getTrainSelfCareInfo(params) {
  return request('/api/resource/train/trainSelfCareInfo', {
    params,
  });
}
