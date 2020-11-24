import {
  searchScale,
  manage,
  fetchObject,
  // getSimpleSuggest
} from '@/pages/scale/service/compose';
import { login, listType } from './service';

export default {
  namespace: 'scaleDemo',
  state: {},
  effects: {
    *login({ payload, callback }, { call, put }) {
      const records = yield call(login, payload);

      localStorage.setItem('token', records.token);

      yield put({
        type: 'save',
        payload: { login: records },
      });

      callback();
    },

    /**
     * 帶出量表清單
     */
    *listType({ payload }, { call, put }) {
      const types = yield call(listType, payload);

      yield put({
        type: 'save',
        payload: { types },
      });
    },
    /**
     * 帶出量表清單
     */
    *searchScale({ payload }, { call, put }) {
      const scales = yield call(searchScale, payload);

      yield put({
        type: 'save',
        payload: { scales },
      });
    },
    /**
     * 測評紀錄
     */
    *searchRecords({ payload }, { call, put }) {
      const records = yield call(manage, payload);

      yield put({
        type: 'save',
        payload: { records },
      });
    },
    /**
     * 個案清單
     */
    *fetchObject({ payload }, { call, put }) {
      const objects = yield call(fetchObject, payload);

      yield put({
        type: 'save',
        payload: { objects },
      });
    },
    /**
     * 取得訓練計畫
     */
    // *getSimpleSuggest({ payload }, { call, put }) {
    //   console.log('payload:', payload);

    //   const suggests = yield call(getSimpleSuggest, payload);

    //   yield put({
    //     type: 'save',
    //     payload: { suggests },
    //   });
    // },
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
