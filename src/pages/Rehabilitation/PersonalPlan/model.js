import { updatePlan } from './service';

const Model = {
  namespace: 'rehabilitationAndPersonalPlan',
  state: {},
  effects: {
    *update({ payload, callback }, { call }) {
      const result = yield call(updatePlan, payload);
      callback && callback(result);
    },
  },
  reducers: {},
};
export default Model;
