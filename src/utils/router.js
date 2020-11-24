import { history } from 'umi';

function push(params) {
  history.push(params);
}

function goBack() {
  history.goBack();
}

function replace(params) {
  history.replace(params);
}

export default {
  push,
  goBack,
  replace,
};
