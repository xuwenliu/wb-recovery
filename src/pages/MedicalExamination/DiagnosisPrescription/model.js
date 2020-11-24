import { createVisiting } from './service';

const Model = {
  namespace: 'medicalExaminationAndDiagnosisPrescription',
  state: {},
  effects: {
    *create({ payload, callback }, { call }) {
      let result = yield call(createVisiting, payload);
      callback && callback(result);
    },
  },
  reducers: {},
};
export default Model;
