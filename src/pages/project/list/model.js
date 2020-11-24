import { fetchProject } from './service';

export default {
  namespace: 'project',

  state: {
    works: [],
    list: [],
  },

  effects: {
    *fetch({ payload: pagenumber }, { call, put }) {
      const response = yield call(fetchProject, pagenumber);
      yield put({
        type: 'save',
        payload: { list: response },
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
