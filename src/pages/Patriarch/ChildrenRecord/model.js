import { createPatientInfo, updatePatientInfo, getPatientInfoSingle } from './service';

const Model = {
  namespace: 'patriarchAndChildrenRecord',
  state: {},
  reducers: {},
  effects: {
    *create({ payload, callback }, { call }) {
      let result = null;
      if (payload.patientId) {
        result = yield call(updatePatientInfo, payload);
      } else {
        result = yield call(createPatientInfo, payload);
      }
      callback && callback(result);
    },
    *getInfo({ payload, callback }, { call }) {
      const result = yield call(getPatientInfoSingle, payload);
      callback && callback(result);
    },
  },
};
export default Model;
