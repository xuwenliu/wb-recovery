import {
  stringify
} from 'querystring';
import {
  history
} from 'umi';
import {
  fakeAccountLogin,
  fakeAccountLogout
} from '@/services/login';
import {
  setAuthority
} from '@/utils/authority';
import {
  getPageQuery
} from '@/utils/utils';
import {
  message
} from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * login({
      payload
    }, {
      call,
      put
    }) {
      const response = yield call(fakeAccountLogin, payload);
      console.log('res', response)
      if (response.data) {
        response.status = 'ok';
        response.currentAuthority = 'admin';
        response.type = payload.loginType;
        localStorage.setItem('token', response.data);
        localStorage.setItem('username', payload.username);
      } else {
        message.error(response.msg);

      }

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let {
          redirect
        } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
    },

    * logout({
      payload
    }, {
      call,
      put
    }) {
      const {
        redirect
      } = getPageQuery(); // Note: There may be security issues, please note
      const response = yield call(fakeAccountLogout, payload);
      if (response) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('antd-pro-authority');
      
        if (window.location.pathname !== '/user/login' && !redirect) {
          history.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
        }
      }


    },
  },
  reducers: {
    changeLoginStatus(state, {
      payload
    }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type
      };
    },
  },
};
export default Model;
