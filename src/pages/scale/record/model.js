import { fetchRecord } from '../service/compose';

export default {
  namespace: 'scaleRecord',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      const records = yield call(fetchRecord, payload);
      yield put({
        type: 'save',
        payload: { records },
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
