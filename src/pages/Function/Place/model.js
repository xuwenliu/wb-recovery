import { saveSite, getInfo, removeSite } from './service';

const Model = {
  namespace: 'functionAndPlace',
  state: {},
  reducers: {},
  effects: {
    *create({ payload, callback }, { call }) {
      let result = yield call(saveSite, payload);
      callback && callback(result);
    },
    *remove({ payload, callback }, { call }) {
      const result = yield call(removeSite, payload);
      callback && callback(result);
    },
    *getInfo({ payload, callback }, { call, put }) {
      const result = yield call(getInfo, payload);
      callback && callback(result);
    },
  },
};
export default Model;
