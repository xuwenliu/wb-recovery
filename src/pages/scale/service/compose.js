import request from '@/utils/request';

export async function fetchById({ id }) {
  return request(`/api/scale/compose/${id}`);
}

export async function fetchIdByName({ name }) {
  const url = `/api/scale/compose/id?name=${name}`;
  return request(url, {
    method: 'POST',
  });
}

export async function fetchIdByCode({ code }) {
  const url = `/api/scale/compose/id?code=${code}`;
  return request(url, {
    method: 'POST',
  });
}

export async function fetchAll({ id }) {
  return request(`/api/scale/compose/search/${id}`);
}

export async function fetchSubScaleNames({ id, demographics }) {
  const url = `/api/scale/compose/${id}/names`;

  if (demographics) {
    return request(url, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
      body: JSON.stringify(demographics),
    });
  }
  return request(url, {
    method: 'POST',
  });
}

export async function createAnswer({ compose, values = {} }) {
  const url = `/api/scale/compose/${compose}/answer/create`;
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: JSON.stringify(values),
  });
}

/**
 * 答題清單
 */
export async function getGuide({ compose, id, takeAnswer }) {
  if (takeAnswer) {
    return request(`/api/scale/compose/${compose}/answer/${id}/guide?takeAnswer=true`);
  }

  return request(`/api/scale/compose/${compose}/answer/${id}/guide`);
}

export async function createReport({ compose, answer }) {
  const url = `/api/scale/compose/${compose}/answer/${answer}/report`;

  return request(url, {
    method: 'POST',
  });
}

/**
 * 答題明細
 */
export async function getAnswer({ compose, id, subScale }) {
  let url = `/api/scale/compose/${compose}/answer/${id}`;

  if (subScale) {
    url += `?subScale=${subScale}`;
  }

  return request(url);
}

export async function saveAnswer({ params, values = {} }) {
  const { compose, answer, subScale } = params;
  const url = `/api/scale/compose/${compose}/answer/${answer}/${subScale}`;

  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'PUT',
    body: JSON.stringify(values),
  });
}

export async function saveAndCreateReport({ params, values = {} }) {
  // console.log('saveAndCreateReport:', params, values);

  const { compose, subScale } = params;
  const url = `/api/scale/compose/${compose}/answer/${subScale}`;

  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: JSON.stringify(values),
  });
}

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
 *
 * @param {*} param0
 */
export async function getTesteeinfo({ scaleId }) {
  return request(`/api/scale/${scaleId}`);
}

/**
 * scale
 */
export async function getScaleCompose({ scaleId }) {
  return request(`/api/scale/compose/${scaleId}`);
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

/**
 * 查詢量表清單
 */
export async function searchScale({ scaleType }) {
  if (scaleType) {
    return request(`/api/scale/compose?page=0&limit=100&scaleType=${scaleType}`);
  }
  return request('/api/scale/compose?page=0&limit=100');
}

/**
 * 查詢量表分類
 */
export async function categories() {
  return request('/api/scale/compose/category');
}

export async function fetchScaleData() {
  return request('/api/scale/compose/data');
}

/**
 * 查詢量表清單
 */
export async function fetchRecord() {
  return request('/api/scale/compose/records');
}

export async function manage({ values = {}, pagination = { page: 0, size: 8 } }) {
  const { page, size } = pagination;
  const url = `/api/scale/compose/manage?page=${page}&size=${size}`;
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: JSON.stringify(values),
  });
}

/**
 * 報表
 */
export async function getReport({ id }) {
  return request(`/api/scale/compose/answer/${id}/report`);
}

export async function getAnswerHistory({ id }) {
  return request(`/api/scale/compose/answer/${id}/history`);
}

/**
 * suggest
 */
export async function getSuggest({ id }) {
  return request(`/api/scale/compose/answer/${id}/suggest`);
}

export async function getSimpleSuggest({ id }) {
  return request(`/api/scale/compose/answer/${id}/suggest/simple`);
}

export async function saveSuggest({ id, values = [] }) {
  const url = `/api/scale/compose/answer/${id}/suggest`;
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: JSON.stringify(values),
  });
}

/**
 * plan
 */
export async function getSuggestPlan({ values }) {
  const url = '/api/scale/compose/plan';
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export async function download({ name, page }) {
  const url = '/api/download';
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'POST',
    responseType: 'blob',
    body: JSON.stringify({ name, url: page }),
  });
}

export async function listType() {
  const url = '/api/scale/type';
  return request(url, {
    method: 'GET',
  });
}
