import { history } from 'umi';
import { search } from '@/pages/scale/service/demographics';
import { getProject, getScales, save, saveDemographics } from './service';

export default {
  namespace: 'projectDetail',

  state: {},

  effects: {
    *saveDemographics({ payload: { values }, callback }, { call }) {
      yield call(saveDemographics, { values });
      callback();
    },
    *searchDemographics({ payload }, { call, put }) {
      const demographics = yield call(search, payload);
      yield put({
        type: 'save',
        payload: { demographics: demographics.content },
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProject, payload);
      yield put({
        type: 'save',
        payload: { data: response },
      });
    },
    *scales({ payload }, { call, put }) {
      const response = yield call(getScales, payload);
      yield put({
        type: 'save',
        payload: { scales: response },
      });
    },
    *saveOrUpdate({ payload: { values } }, { call, select }) {
      const data = yield select((state) => state.projectDetail.data);

      if (data && data.id) {
        // eslint-disable-next-line no-param-reassign
        values = { ...values, id: data.id };
      }

      yield call(save, { values });

      history.push({
        pathname: '/project',
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
    clearDemographics(state) {
      return { ...state, demographics: [] };
    },
  },
};
