import { saveCollectiveEdu, deletePlan } from './service';

const Model = {
  namespace: 'rehabilitationAndCollectivePlan',
  state: {},
  effects: {
    *create({ payload, callback }, { call }) {
      const result = yield call(saveCollectiveEdu, payload);
      callback && callback(result);
    },
    *remove({ payload, callback }, { call }) {
      const result = yield call(deletePlan, payload);
      callback && callback(result);
    },
  },
  reducers: {},
};
export default Model;
