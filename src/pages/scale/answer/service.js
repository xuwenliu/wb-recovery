import request from '@/utils/request';

/**
 * project
 */

export async function fetchProject({ scaleId }) {
  if (scaleId) {
    return request(`/api/answer/projects?scaleId=${scaleId}`);
  }
  return request('/api/answer/projects');
}

export async function getProject({ id }) {
  return request(`/api/project/${id}`);
}

/**
 * surveyor
 */
export async function getSurveyor() {
  return request('/api/surveyor/list');
}

/**
 * scale
 */
export async function getScale({ scaleId }) {
  return request(`/api/scale/${scaleId}`);
}

export function answer({ values }) {
  return request('/api/answer', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export async function getReport({ id }) {
  return request(`/api/answer/${id}/report`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

/**
 * object
 */
export async function fetchObject({ number }) {
  let url = '/api/object?page=0&limit=10';

  if (number) {
    url += `&number=${number}`;
  }

  return request(url);
}

export async function fetchObjectDetail({ id }) {
  return request(`/api/object/${id}`);
}
