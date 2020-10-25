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
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupSingle,
} from './service';

const Model = {
  namespace: 'functionAndEmployee',
  state: {},
  reducers: {},
  effects: {
    // 员工
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

    // 部门
    *createDepartment({ payload, callback }, { call }) {
      let result = null;
      if (payload.deptId) {
        result = yield call(updateDept, payload);
      } else {
        result = yield call(createDept, payload);
      }
      callback && callback(result);
    },
    *removeDepartment({ payload, callback }, { call }) {
      const result = yield call(deleteDept, payload);
      callback && callback(result);
    },
    *getInfoDepartment({ payload, callback }, { call }) {
      const result = yield call(getDeptSingle, payload);
      callback && callback(result);
    },

    //角色
    *createRoleType({ payload, callback }, { call }) {
      let result = null;
      if (payload.roleId) {
        result = yield call(updateRole, payload);
      } else {
        result = yield call(createRole, payload);
      }
      callback && callback(result);
    },
    *removeRoleType({ payload, callback }, { call }) {
      const result = yield call(deleteRole, payload);
      callback && callback(result);
    },
    *getInfoRoleType({ payload, callback }, { call }) {
      const result = yield call(getRoleSingle, payload);
      callback && callback(result);
    },

    //评估小组
    *createGroupType({ payload, callback }, { call }) {
      let result = null;
      if (payload.id) {
        result = yield call(updateGroup, payload);
      } else {
        result = yield call(createGroup, payload);
      }
      callback && callback(result);
    },
    *removeGroupType({ payload, callback }, { call }) {
      const result = yield call(deleteGroup, payload);
      callback && callback(result);
    },
    *getInfoGroupType({ payload, callback }, { call }) {
      const result = yield call(getGroupSingle, payload);
      callback && callback(result);
    },
  },
};
export default Model;
