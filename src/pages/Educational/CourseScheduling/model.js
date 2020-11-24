import { createClass } from './service';

const Model = {
  namespace: 'educationalAndCourseScheduling',
  state: {},
  effects: {
    *create({ payload, callback }, { call }) {
      let result = yield call(createClass, payload);
      callback && callback(result);
    },
  },
  reducers: {},
};
export default Model;
