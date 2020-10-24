import { createEmployee, updateEmployee, deleteEmployee, getEmployeeSingle, } from './service';

const Model = {
  namespace: 'functionAndEmployee',
  state: {},
  reducers: {},
  effects: {
    *create({ payload, callback }, { call }) {
      let result = null;
      if (payload.id) {
        result = yield call(updateEmployee, payload);
      } else {
        result = yield call(createEmployee, payload);
      }
      callback && callback(result);
    },
    *remove({ payload, callback }, { call }) {
      const result = yield call(deleteEmployee, payload);
      callback && callback(result);
    },
    *getInfo({ payload, callback }, { call }) {
      const result = yield call(getEmployeeSingle, payload);
      callback && callback(result);
    },
  },
};
export default Model;
