import { searchScale, categories } from '../../service/compose';

export default {
  namespace: 'scaleComposeType',

  state: {},

  effects: {
    *categories({ payload }, { call, put }) {
      const data = yield call(categories, payload);
      yield put({
        type: 'save',
        payload: { categories: data },
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(searchScale, payload);

      yield put({
        type: 'save',
        payload: { data: response },
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
