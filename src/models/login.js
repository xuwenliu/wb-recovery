import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin, fakeAccountLogout } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const token = yield call(fakeAccountLogin, payload);
      const response = {};
      if (token) {
        response.status = 'ok';
        response.currentAuthority = 'admin';
        response.type = payload.loginType;
        localStorage.setItem('token', token);
        localStorage.setItem('username', payload.username);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        history.replace('/');
      }
    },

    *logout({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogout, payload);
      if (response) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('antd-pro-authority');

        if (window.location.pathname !== '/user/login') {
          history.replace({
            pathname: '/user/login',
          });
        }
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
export default Model;
