import { getGuide, createReport } from '@/pages/scale/service/compose';
import { Toast } from 'antd-mobile';

const getData = ({ guide, current }) => {
  const { code, scaleName, names = [], totalReport, reports } = guide;

  const progress = { count: 0, total: names.length };
  const data = {};

  names.forEach(({ name, finish }) => {
    const fields = name.split('.');
    const category = fields[0];
    const subScaleName = fields[1];

    if (data[`${category}`] === undefined) {
      data[`${category}`] = {
        name: category,
        scales: [],
      };
    }
    data[`${fields[0]}`].scales.push({
      category,
      name: subScaleName,
      finish,
    });

    if (finish) {
      progress.count += 1;
    }
  });

  const ret = [];

  Object.keys(data).forEach(key => {
    ret.push(data[key]);
    data[key].finish = data[key].scales.findIndex(i => i.finish === false) === -1;
  });

  const result = {
    code,
    scaleName,
    current: current === undefined ? ret[0].name : current,
    items: ret,
    progress,
    totalReport,
    reports,
  };

  result.items.forEach(item => {
    if (result.current === item.name) {
      result.scales = [...item.scales];
    }
  });

  return result;
};

export default {
  namespace: 'scaleComposeAnswer',

  state: {},

  effects: {
    *fetchGuide(
      {
        payload: { compose, id, current },
      },
      { call, put }
    ) {
      const guide = yield call(getGuide, { compose, id });
      yield put({
        type: 'save',
        payload: { data: getData({ guide, current }) },
      });
    },
    *changeCurrent(
      {
        payload: { current },
      },
      { select, put }
    ) {
      const data = yield select(state => state.scaleComposeAnswer.data);

      data.current = current;
      data.items.forEach(item => {
        if (data.current === item.name) {
          data.scales = [...item.scales];
        }
      });

      yield put({
        type: 'save',
        payload: { data },
      });
    },
    *createReport({ payload, callback }, { call }) {
      Toast.loading('报告产生中...');
      const result = yield call(createReport, payload);
      Toast.hide();

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
