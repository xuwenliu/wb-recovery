import {
  saveRoughActivity,
  saveTrainAndTarget,
  saveCareFulActivity,
  saveTrainCognition,
  saveTrainAdaptation,
  saveTrainEnv,
  saveLanguageInfo,
  saveTrainSelfCare,
  saveFeelInfo,
} from './service';

const Model = {
  namespace: 'assessmentAndTrainingObjectives',
  state: {},
  effects: {
    *createSaveRoughActivity({ payload, callback }, { call }) {
      const res = yield call(saveRoughActivity, payload);
      callback && callback(res);
    },
    *createSaveFeelInfo({ payload, callback }, { call }) {
      const res = yield call(saveFeelInfo, payload);
      callback && callback(res);
    },
    *createSaveTrainAndTarget({ payload, callback }, { call }) {
      const res = yield call(saveTrainAndTarget, payload);
      callback && callback(res);
    },
    *createSaveCareFulActivity({ payload, callback }, { call }) {
      const res = yield call(saveCareFulActivity, payload);
      callback && callback(res);
    },
    *createSaveTrainCognition({ payload, callback }, { call }) {
      const res = yield call(saveTrainCognition, payload);
      callback && callback(res);
    },
    *createSaveTrainAdaptation({ payload, callback }, { call }) {
      const res = yield call(saveTrainAdaptation, payload);
      callback && callback(res);
    },
    *createSaveTrainEnv({ payload, callback }, { call }) {
      const res = yield call(saveTrainEnv, payload);
      callback && callback(res);
    },
    *createSaveLanguageInfo({ payload, callback }, { call }) {
      const res = yield call(saveLanguageInfo, payload);
      callback && callback(res);
    },
    *createSaveTrainSelfCare({ payload, callback }, { call }) {
      const res = yield call(saveTrainSelfCare, payload);
      callback && callback(res);
    },
  },
};
export default Model;
