import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';

// https://github.com/iamhosseindhv/notistack/blob/master/examples/redux-example/Notifier.js
// https://github.com/iamhosseindhv/notistack/issues/30
// add a <div> child to body under which to mount the snackbars
const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
const AUTO_HIDE_DURATION = 3000;

export default {
  success(msg) {
    this.toast(msg, 'success');
  },
  warning(msg) {
    this.toast(msg, 'warning');
  },
  info(msg) {
    this.toast(msg, 'info');
  },
  error(msg) {
    this.toast(msg, 'error');
  },
  toast(msg, variant = 'default') {
    const ShowSnackbar = ({ message }) => {
      const { enqueueSnackbar } = useSnackbar();
      enqueueSnackbar(message, { variant });
      return null;
    };
    ReactDOM.render(
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        autoHideDuration={AUTO_HIDE_DURATION} // add by bella
      >
        <ShowSnackbar message={msg} variant={variant} />
      </SnackbarProvider>,
      mountPoint,
    );
  },
};
