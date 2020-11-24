import { fetchObject , deleteObject  } from '../../service/user';

export default {
  namespace: 'scaleUser',
  state: {},
  effects: {
    *fetch({ payload }, { call, put }) {
      const record = yield call(fetchObject, payload);
      yield put({
        type: 'save',
        payload: { record },
      });
    },
    *deleteObject({ payload ,callback }, { call }) {
      yield call(deleteObject, payload);
      if (callback)  {
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
