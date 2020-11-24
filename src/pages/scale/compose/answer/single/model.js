import { buildAnswer } from '@/pages/scale/util/utils';
import { getAnswer, saveAnswer } from '@/pages/scale/service/compose';

export default {
  namespace: 'scaleComplseAnswerSingle',

  state: {},

  effects: {
    *fetchAnswer({ payload }, { call, put }) {
      const record = yield call(getAnswer, payload);
      const answer = {};
      yield put({
        type: 'save',
        payload: {
          record,
          answer,
        },
      });
    },
    *submitAnswer({ payload, callback }, { call, select }) {
      const { answerValues } = payload;

      const { record } = yield select(state => state.scaleComplseAnswerSingle);

      const { compose, id, scale } = record;

      const testeeInfo = [];

      const params = { compose, answer: id, subScale: `${scale.scaleType}.${scale.scaleName}` };

      const values = buildAnswer(scale, testeeInfo, answerValues);

      // 如果是單一量表.會直接產生報告
      const result = yield call(saveAnswer, { params, values });

      callback(result);
    },
  },

  reducers: {
    clear() {
      return {};
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
