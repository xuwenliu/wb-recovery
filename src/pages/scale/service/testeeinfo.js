import request from '@/utils/request';

export async function create({ project, values = {} }) {
  const url = `/api/testeeinfo/project/${project}`;
  return request(url, {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export async function fetchByCode({ code }) {
  return request(`/api/testeeinfo/project/${code}`);
}
