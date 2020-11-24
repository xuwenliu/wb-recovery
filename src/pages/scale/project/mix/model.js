import { Toast } from 'antd-mobile';
import { create, fetchByCode } from '../../service/testeeinfo';
import { buildAnswer } from '@/pages/scale/util/utils';

import { fetchById, saveAndCreateReport, getReport } from '../../service/compose';

export default {
  namespace: 'scaleProjectMix',

  state: {
    scales: [],
    reports: [],
  },

  effects: {
    *fetchReport({ payload }, { select, call, put }) {
      const reports = yield select(state => state.scaleProjectMix.reports);
      const report = yield call(getReport, payload);
      reports.push(report);
      yield put({
        type: 'save',
        payload: { reports },
      });
    },

    *fetchScale({ payload }, { select, call, put }) {
      const scales = yield select(state => state.scaleProjectMix.scales);
      const scale = yield call(fetchById, payload);
      scales.push(scale);
      yield put({
        type: 'save',
        payload: { scales },
      });
    },
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(fetchByCode, payload);
      yield put({
        type: 'save',
        payload: { record: response },
      });
      if (callback) {
        callback(response);
      }
    },
    *create({ payload, callback }, { call }) {
      Toast.loading('提交中');
      const result = yield call(create, payload);
      Toast.hide();

      if (callback) {
        callback(result);
      }
    },
    *submitAnswer({ payload, callback }, { select, call, put }) {
      const reports = yield select(state => state.scaleProjectMix.reports);

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

      reports.push(report);

      yield put({
        type: 'save',
        payload: { reports },
      });

      if (callback) {
        callback();
      }
    },
  },
  reducers: {
    clear() {
      return {
        scales: [],
        reports: [],
      };
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
