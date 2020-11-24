import { fetchObjectDetail, save } from '../../service/user';

export default {
  namespace: 'scaleUserDetail',
  state: {},
  effects: {
    *fetch({ payload }, { call, put }) {
      const record = yield call(fetchObjectDetail, payload);
      yield put({
        type: 'save',
        payload: { record },
      });
    },
    *saveOrUpdate({ payload,callback }, { call, put }) {
      const record = yield call(save, payload);
      yield put({
        type: 'save',
        payload: { record },
      });
      if (callback) {
        callback();
      }
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
