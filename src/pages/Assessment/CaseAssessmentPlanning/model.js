import { createSavePlan } from './service';

const Model = {
  namespace: 'assessmentAndCaseAssessmentPlanning',
  state: {},
  effects: {
    *savePlan({ payload, callback }, { call }) {
      const result = yield call(createSavePlan, payload);
      callback && callback(result);
    },
  },
};
export default Model;
