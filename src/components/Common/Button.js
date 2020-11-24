import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles(() => ({
  progress: {
    color: green[500],
  },
}));

function Page(props) {
  const classes = useStyles();
  const { loading = false, children } = props;

  if (loading) {
    return (
      <Button {...props} disabled>
        <CircularProgress size={20} style={{ marginRight: '5px' }} className={classes.progress} />
        {children}
      </Button>
    );
  }

  return <Button {...props}>{children}</Button>;
}

export default Page;
