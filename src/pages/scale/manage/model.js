import { manage, getReport, searchScale } from '../service/compose';

export default {
  namespace: 'scaleManage',
  state: {},
  effects: {
    *fetch({ payload }, { call, put }) {
      const records = yield call(manage, payload);
      yield put({
        type: 'save',
        payload: { records },
      });
    },
    *getReport({ payload }, { call, put }) {
      const record = yield call(getReport, payload);
      yield put({
        type: 'save',
        payload: { record },
      });
    },
    *fetchScales({ payload }, { call, put }) {
      const response = yield call(searchScale, payload);

      yield put({
        type: 'save',
        payload: { scales: response },
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    clear() {
      return {};
    },
  },
};
