import { saveSpecialEdu, updatePlan } from './service';

const Model = {
  namespace: 'rehabilitationAndPersonalPlan',
  state: {},
  effects: {
    *create({ payload, callback }, { call }) {
      const result = yield call(saveSpecialEdu, payload);
      callback && callback(result);
    },
    *update({ payload, callback }, { call }) {
      const result = yield call(updatePlan, payload);
      callback && callback(result);
    },
  },
  reducers: {},
};
export default Model;
