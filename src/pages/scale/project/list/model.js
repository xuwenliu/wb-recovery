import { fetch } from '@/pages/scale/service/project';

export default {
  namespace: 'scaleProject',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetch, payload);
      yield put({
        type: 'save',
        payload: { records: response.content },
      });
    }
  },
  reducers: {
    clear() {
      return {};
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
