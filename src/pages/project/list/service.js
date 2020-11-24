import request from '@/utils/request';

export async function fetchProject(pagenumber) {
  return request(`/api/project?page=${pagenumber}&size=9`);
}
