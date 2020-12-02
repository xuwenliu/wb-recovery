import request from 'umi-request';

// 保存康复处方
export async function saveClassPlan(data) {
  return request('/api/resource/evaluation/saveClassPlan', {
    method: 'POST',
    data,
  });
}

export async function getClassPlanInfo(params) {
  return request('/api/resource/evaluation/classPlanInfo', {
    params,
  });
}
// 保存-评估结果分析表-下面的表单
export async function saveEvaluation(data) {
  return request('/api/resource/evaluation/save', {
    method: 'POST',
    data,
  });
}

export async function getEvaluationSingle(params) {
  return request('/api/resource/evaluation/single', {
    params,
  });
}
