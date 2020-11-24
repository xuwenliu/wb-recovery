import { createGroupAssess } from './service';

const Model = {
  namespace: 'assessmentAndTeamAssessment',
  state: {},
  effects: {
    *create({ payload, callback }, { call }) {
      let result = yield call(createGroupAssess, payload);
      callback && callback(result);
    },
  },
};
export default Model;
