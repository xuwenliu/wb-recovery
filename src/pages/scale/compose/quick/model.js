import {
  searchScale,
  getScaleCompose,
  fetchObject,
  fetchObjectDetail,
  createAnswer,
  fetchSubScaleNames,
} from '../../service/compose';

export default {
  namespace: 'scaleComposeQuick',

  state: {},

  effects: {
    /**
     * 量表
     */
    *fetch({ payload }, { call, put }) {
      const response = yield call(searchScale, payload);

      yield put({
        type: 'save',
        payload: { scales: response },
      });
    },
    *fetchScale({ payload }, { call, put }) {
      const response = yield call(getScaleCompose, payload);

      yield put({
        type: 'save',
        payload: { scale: response },
      });
    },
    /**
     * 使用者
     */
    *fetchObject({ payload }, { call, put }) {
      const response = yield call(fetchObject, payload);

      yield put({
        type: 'save',
        payload: { objects: response, object: null },
      });
    },
    *fetchObjectDetail({ payload }, { call, put }) {
      const response = yield call(fetchObjectDetail, payload);

      yield put({
        type: 'save',
        payload: { object: response },
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
      const response = yield call(createAnswer, payload);
      callback(response);
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
