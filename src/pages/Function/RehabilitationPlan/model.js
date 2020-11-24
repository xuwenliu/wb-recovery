import { createPackage, updatePackage, removePackage, updatePackageClass } from './service';

const Model = {
  namespace: 'functionAndRehabilitationPlan',
  state: {},
  effects: {
    *createSavePackage({ payload, callback }, { call }) {
      let result = null;
      if (payload.packageId) {
        result = yield call(updatePackage, payload);
      } else {
        result = yield call(createPackage, payload);
      }
      callback && callback(result);
    },
    *removeSavePackage({ payload, callback }, { call }) {
      let result = yield call(removePackage, payload);
      callback && callback(result);
    },
    *createUpdatePackageClass({ payload, callback }, { call }) {
      let result = yield call(updatePackageClass, payload);
      callback && callback(result);
    },
  },
  reducers: {},
};
export default Model;
