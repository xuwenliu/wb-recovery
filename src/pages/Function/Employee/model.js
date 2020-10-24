import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeSingle,


  createDept,
  updateDept,
  deleteDept,
  getDeptSingle,

  createRole,
  updateRole,
  deleteRole,
  getRoleSingle,

} from './service';

const Model = {
  namespace: 'functionAndEmployee',
  state: {},
  reducers: {},
  effects: {
    * create({
      payload,
      callback
    }, {
      call
    }) {
      let result = null;
      if (payload.id) {
        result = yield call(updateEmployee, payload);
      } else {
        result = yield call(createEmployee, payload);
      }
      callback && callback(result);
    },
    * remove({
      payload,
      callback
    }, {
      call
    }) {
      const result = yield call(deleteEmployee, payload);
      callback && callback(result);
    },
    * getInfo({
      payload,
      callback
    }, {
      call
    }) {
      const result = yield call(getEmployeeSingle, payload);
      callback && callback(result);
    },

    * createDepartment({
      payload,
      callback
    }, {
      call
    }) {
      let result = null;
      if (payload.id) {
        result = yield call(updateDept, payload);
      } else {
        result = yield call(createDept, payload);
      }
      callback && callback(result);
    },
    * removeDepartment({
      payload,
      callback
    }, {
      call
    }) {
      const result = yield call(deleteDept, payload);
      callback && callback(result);
    },
    // * getInfoDepartment({
    //   payload,
    //   callback
    // }, {
    //   call
    // }) {
    //   const result = yield call(getDeptSingle, payload);
    //   callback && callback(result);
    // },

  },
};
export default Model;
