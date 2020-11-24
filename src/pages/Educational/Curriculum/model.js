import { removeClass, createClass, getClassInfo } from './service';

const Model = {
  namespace: 'educationalAndCurriculum',
  state: {},
  reducers: {},
  effects: {
    *create({ payload, callback }, { call }) {
      let result = yield call(createClass, payload);
      callback && callback(result);
    },
    *remove({ payload, callback }, { call }) {
      const result = yield call(removeClass, payload);
      callback && callback(result);
    },
    *getInfo({ payload, callback }, { call }) {
      const result = yield call(getClassInfo, payload);
      callback && callback(result);
    },
  },
};
export default Model;
