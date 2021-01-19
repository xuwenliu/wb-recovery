import { listType, fetchScaleData } from '@/pages/scale/service/compose';

export default {
  namespace: 'scaleType',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      const types = yield call(listType, payload);
      yield put({
        type: 'save',
        payload: { types },
      });
    },
    *fetchScale({ payload }, { call, put }) {
      const scales = yield call(fetchScaleData, payload);
      yield put({
        type: 'save',
        payload: { scales },
      });
    },
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
