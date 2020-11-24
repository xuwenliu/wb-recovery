import { getReport } from '../service/compose';

export default {
  namespace: 'scaleReport',
  state: {},
  effects: {
    *fetch({ payload }, { call, put }) {
      const record = yield call(getReport, payload);
      yield put({
        type: 'save',
        payload: { record },
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
