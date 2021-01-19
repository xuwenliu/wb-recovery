import { fetchScaleData, searchScale, manage } from '@/pages/scale/service/compose';

export default {
  namespace: 'patriarchAssessmentRecord',

  state: {},

  effects: {
    /**
     * 帶出量表清單
     */
    *fetchScaleData({ payload }, { call, put }) {
      
      const scales = yield call(fetchScaleData, payload);

      yield put({
        type: 'save',
        payload: { scales },
      });
    },
    /**
     * 帶出量表清單
     */
    *searchScale({ payload }, { call, put }) {
      const scales = yield call(searchScale, payload);

      yield put({
        type: 'save',
        payload: { scales },
      });
    },
    /**
     * 測評紀錄
     */
    *searchRecords({ payload }, { call, put }) {
      const records = yield call(manage, { values: payload });

      console.log('searchRecords:', records);

      yield put({
        type: 'save',
        payload: { records },
      });
    },
  },
  reducers: {
    clear() {
      console.log('===========clear=========');
      return {};
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
