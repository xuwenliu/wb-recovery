import {
  fetchIdByCode,
  fetchIdByName,
  fetchAll,
  fetchSubScaleNames,
  createAnswer,
} from '@/pages/scale/service/compose';

export default {
  namespace: 'scaleCompose',

  state: {},

  effects: {
    *fetchIdByCode({ payload }, { call, put }) {
      const { id } = yield call(fetchIdByCode, payload);
      yield put({
        type: 'save',
        payload: { compose: id },
      });

      yield put({
        type: 'fetchAll',
        payload: { id },
      });
    },
    *fetchIdByName({ payload }, { call, put }) {
      const { id } = yield call(fetchIdByName, payload);
      yield put({
        type: 'save',
        payload: { compose: id },
      });

      yield put({
        type: 'fetchAll',
        payload: { id },
      });
    },
    *fetchAll({ payload }, { call, put }) {
      const records = yield call(fetchAll, payload);
      yield put({
        type: 'save',
        payload: { records: records.content, totalPages: records.totalPages },
      });
    },
    *fetchSubScaleNames({ payload }, { call, put }) {
      const subScaleNames = yield call(fetchSubScaleNames, payload);
      yield put({
        type: 'save',
        payload: { subScaleNames },
      });
    },
    *createAnswer({ payload, callback }, { call }) {
      const answer = yield call(createAnswer, payload);
      callback(answer);
    },
  },

  reducers: {
    clear() {
      return {};
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
    deleteSubScaleNames(state) {
      // eslint-disable-next-line no-param-reassign
      delete state.subScaleNames;
      return { ...state };
    },
  },
};
