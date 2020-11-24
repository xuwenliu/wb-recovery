/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import { getSuggest, saveSuggest , getSuggestPlan } from '../service/compose';
import { Toast } from 'antd-mobile';

const getItemData = suggest => {
  const { suggests: items } = suggest;

  const result = {};

  items.forEach(({ no, desc }) => {
    result[no] = { no, desc };
  });

  return result;
};

export default {
  namespace: 'scaleSuggest',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      const suggest = yield call(getSuggest, payload);
      yield put({
        type: 'save',
        payload: { data: getItemData(suggest), model: suggest },
      });
    },
    *getSuggestPlan({ payload }, { call, put }) {
      const plans = yield call(getSuggestPlan, payload);
      yield put({
        type: 'save',
        payload: { plans },
      });
    },
    *saveSuggest({ payload }, { call, put }) {
      const suggest = yield call(saveSuggest, payload);
      /**
      yield put({
        type: 'save',
        payload: { suggest, result: getResult(suggest) },
      });
       */
      Toast.success('设定成功');
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
