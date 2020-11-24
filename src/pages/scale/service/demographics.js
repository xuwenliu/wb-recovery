import request from '@/utils/request';

export async function search({ values = {}, pagination = { page: 0, size: 20 } }) {
  const { page, size } = pagination;
  const { code, owner } = values;

  let url = `/api/demographics?page=${page}&size=${size}`;

  if (code) {
    url += `&code=${code}`;
  }

  if (owner) {
    url += `&owner=${owner}`;
  }

  return request(url);
}
