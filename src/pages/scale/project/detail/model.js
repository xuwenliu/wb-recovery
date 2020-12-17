import { Toast } from 'antd-mobile';
import { create, fetchByCode } from '../../service/testeeinfo';

export default {
  namespace: 'scaleProjectDetail',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchByCode, payload);
      // 
      yield put({
        type: 'save',
        payload: { record: { ...response} },
      });  
    },
    *create({ payload, callback }, { call }) {
      Toast.loading('提交中');
      const result = yield call(create, payload);
      Toast.hide();

      if (callback) {
        callback(result);
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
