import router from '@/utils/router';

import { uniqueId } from 'lodash/util';
import { buildAnswer } from '@/pages/scale/util/utils';

import {
  fetchProject,
  getProject,
  getScaleCompose,
  // getReport,
  // answer,
  fetchObject,
  fetchObjectDetail,
  getSurveyor,
  saveAndCreateReport,
} from '../service/compose';

export default {
  namespace: 'scaleAnswer',

  state: {},

  effects: {
    *fetchProject({ payload }, { call, put }) {
      const content = yield call(fetchProject, payload);
      yield put({
        type: 'save',
        payload: { projects: content },
      });
    },
    *getProject({ payload }, { call, put }) {
      const { id } = payload;
      if (id === '') {
        yield put({
          type: 'save',
          payload: { project: null },
        });
      } else {
        const response = yield call(getProject, payload);

        yield put({
          type: 'save',
          payload: { project: response },
        });
      }
    },
    *fetchSurveyor({ payload }, { call, put }) {
      const response = yield call(getSurveyor, payload);

      const data = {};

      response.forEach(({ id, name, agency }) => {
        if (!data[agency]) {
          data[agency] = {
            value: uniqueId(),
            title: agency,
            children: [],
            selectable: false,
          };
        }
        data[agency].children.push({ value: id, title: name });
      });

      const treeData = [];
      Object.values(data).forEach(value => {
        treeData.push(value);
      });

      yield put({
        type: 'save',
        payload: { surveyors: treeData },
      });
    },
    *fetchCompose({ payload }, { call, put }) {
      const response = yield call(getScaleCompose, payload);

      yield put({
        type: 'save',
        payload: { compose: response },
      });
    },
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
    *testeeInfo({ payload }, { put }) {
      const { values } = payload;

      delete values.id;

      yield put({
        type: 'save',
        payload: { testeeInfo: Object.assign({}, values) },
      });

      router.push({
        pathname: '/scale/answer/collect',
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
    /** 
    *fetchReport({ payload }, { call, put }) {
      const response = yield call(getReport, payload);

      yield put({
        type: 'save',
        payload: { report: response },
      });
    },
    */
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
