import request from '@/utils/request';

export async function fetch() {
  return request('/api/project?close=true');
}
