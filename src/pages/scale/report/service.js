import request from '@/utils/request';

export async function fetch() {
  return request('/api/report/scale');
}

export async function fetchReportDetail({ id }) {
  return request(`/api/report/scale/${id}`);
}
