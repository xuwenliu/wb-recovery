import { queryCurrent, query as queryUsers } from '@/services/user';
import { getUserPermissions } from '@/pages/Function/Account/service';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    menuData: [],
    loading: true, // loading的初始值为true
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: {
          name: localStorage.getItem('username'),
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        },
      });
    },
    *getMenuData({ callback }, { call, put }) {
      // 每次请求菜单前先把loading设置为true,避免账号切换登录后菜单不会根据账号渲染自己的菜单树
      yield put({
        type: 'setLoading',
        payload: true,
      });
      const response = yield call(getUserPermissions);
      localStorage.setItem('menu', JSON.stringify(response));
      yield put({
        type: 'saveMenuData',
        payload: response,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveMenuData(state, action) {
      return {
        ...state,
        menuData: action.payload || [],
        loading: false, // 后台数据返回了，loading就改成false
      };
    },
    setLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
