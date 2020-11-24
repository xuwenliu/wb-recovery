import request from '@/utils/request';

export async function getScales() {
  return request('/api/project/scaleComposes');
}

export async function getProject({ id }) {
  return request(`/api/project/${id}`);
}

export async function queryWorks() {
  return request('/api/work');
}

export async function queryProjectList() {
  return request('/api/project/list');
}

export function saveProject(value) {
  return request('/api/project', {
    method: 'POST',
    body: value,
  });
}

export function modifyProject(payload) {
  return request(`/api/project/${payload.id}`, {
    method: 'PUT',
    body: payload.value,
  });
}

export function save({ values }) {
  if (values.id) {
    return request(`/api/project/${values.id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
    });
  }

  return request('/api/project', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function saveDemographics({ values }) {
  if (values.id) {
    return request(`/api/demographics/${values.id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
    });
  }

  return request('/api/demographics', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}
