import {
  createProject,
  updateProject,
  deleteProject,
  getProjectSingle,
} from './service';

const Model = {
  namespace: 'functionAndResearchProject',
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
        result = yield call(updateProject, payload);
      } else {
        result = yield call(createProject, payload);
      }
      callback && callback(result);
    },
    * remove({
      payload,
      callback
    }, {
      call
    }) {
      const result = yield call(deleteProject, payload);
      callback && callback(result);
    },
    * getInfo({
      payload,
      callback
    }, {
      call
    }) {
      const result = yield call(getProjectSingle, payload);
      callback && callback(result);
    },
  },
};
export default Model;
