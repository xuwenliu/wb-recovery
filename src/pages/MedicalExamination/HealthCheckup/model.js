import { createPhysique } from './service';

const Model = {
  namespace: 'medicalExaminationAndHealthCheckup',
  state: {},
  reducers: {},
  effects: {
    *create({ payload, callback }, { call }) {
      const result = yield call(createPhysique, payload);
      callback && callback(result);
    },
  },
};
export default Model;
