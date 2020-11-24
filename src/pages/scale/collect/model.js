import { buildAnswer } from '@/pages/scale/util/utils';

import { getScaleCompose, saveAndCreateReport , getReport } from '../service/compose';

export default {
  namespace: 'scaleCollect',

  state: {},

  effects: {
    *fetchReport({ payload }, { call, put }) {
      const report = yield call(getReport, payload);

      yield put({
        type: 'save',
        payload: { report },
      });
    },
    *fetchCompose({ payload }, { call, put }) {
      const response = yield call(getScaleCompose, payload);

      yield put({
        type: 'save',
        payload: { compose: response },
      });
    },
    *submitAnswer({ payload, callback }, { call, put }) {
      /**
       * compose,
       * subScale,
       * values:{
       *  user,
       *  value,
       *  testeeInfo, [{}]
       * }
       */
      const { project, compose, scale, testeeInfo, answerValues } = payload;

      const value = buildAnswer(scale, [], answerValues);

      const report = yield call(saveAndCreateReport, {
        params: { compose, subScale: `${scale.scaleType}.${scale.scaleName}` },
        values: {
          project,
          testeeInfo,
          value,
        },
      });

      yield put({
        type: 'save',
        payload: { report },
      });

      if (callback) {
        callback();
      }
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
