import { addRule, updateRule, getInfo, removeRule } from './service';

const Model = {
  namespace: 'functionAndEmployee',
  state: {},
  reducers: {},
  effects: {
    *create({ payload, callback }, { call }) {
      let result = null;
      if (payload.id) {
        result = yield call(updateRule, payload);
      } else {
        result = yield call(addRule, payload);
      }
      callback && callback(result);
    },
    *remove({ payload, callback }, { call }) {
      const result = yield call(removeRule, payload);
      callback && callback(result);
    },
    *getInfo({ payload, callback }, { call, put }) {
      const result = yield call(getInfo, payload);
      callback && callback(result);
    },
  },
};
export default Model;
