import { saveClassPlan, getClassPlanInfo, saveEvaluation } from './service';

const Model = {
  namespace: 'assessmentAndEvaluationCourses',
  state: {},
  effects: {
    *create({ payload, callback }, { call, put }) {
      const result = yield call(saveClassPlan, payload);
      callback && callback(result);
    },
    *getInfo({ payload, callback }, { call, put }) {
      const result = yield call(getClassPlanInfo, payload);
      callback && callback(result);
    },
    *saveEvaluationEffects({ payload, callback }, { call, put }) {
      const result = yield call(saveEvaluation, payload);
      callback && callback(result);
    },
  },
  reducers: {},
};
export default Model;
