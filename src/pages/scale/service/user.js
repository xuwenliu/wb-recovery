import request from '@/utils/request';

export async function fetchObject({ values = {}, pagination = { page: 0, size: 8 } }) {
  const { page, size } = pagination;

  let url = `/api/object?page=${page}&size=${size}`;

  Object.keys(values).forEach(key => {
    if (values[key] !== undefined && values[key] !== '') {
      url += `&${key}=${values[key]}`;
    }
  });

  return request(url);
}

export async function fetchObjectDetail({ id }) {
  return request(`/api/object/${id}`);
}

export async function deleteObject({ id }) {
  return request(`/api/object/${id}`, {
    method: 'DELETE',
  });
}

export async function save({ values }) {
  if (values.id) {
    return request(`/api/object/${values.id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
    });
  }
  return request('/api/object', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}
