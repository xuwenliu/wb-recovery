import request from '@/utils/request';

export async function fetchEvaluationTargets({ patientId }) {
  return request(`/api/resource/evaluation/targets?patientId=${patientId}`);
}
