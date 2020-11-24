import { getGuide, getAnswerHistory } from '@/pages/scale/service/compose';

const getData = ({ guide }) => {
  const {
    code,
    scaleName,
    shortName,
    reportDate,
    totalReport,
    reports,
    user,
    testeeInfo,
    suggests,
    answers,
  } = guide;
  const result = {
    code,
    scaleName,
    shortName,
    totalReport,
    reports,
    reportDate,
    user,
    testeeInfo,
    suggests,
    answers,
  };

  return result;
};

export default {
  namespace: 'scaleComposeReport',

  state: {},

  effects: {
    *fetchGuide(
      {
        payload: { compose, id, takeAnswer },
      },
      { call, put }
    ) {
      const guide = yield call(getGuide, { compose, id, takeAnswer });

      const data = getData({ guide });

      if (data.reports && data.reports.length > 0) {
        data.history = yield call(getAnswerHistory, { id });
      }

      yield put({
        type: 'save',
        payload: { data },
      });
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
