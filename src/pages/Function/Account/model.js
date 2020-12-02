import { updateUserInfo } from './service';

const Model = {
  namespace: 'functionAndAccount',
  state: {},
  effects: {
    *update({ payload, callback }, { call, put }) {
      const result = yield call(updateUserInfo, payload);
      callback && callback(result);
    },
  },
  reducers: {},
};
export default Model;
