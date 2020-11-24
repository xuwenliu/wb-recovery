import React from 'react';

import CheckIcon from '@material-ui/icons/Check';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: '#fff',
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    fontSize: '18px',
  },
}));

function SuggestItem({ status, checked, children }) {
  const classes = useStyles();

  // const getStatusStyle = () => {
  //   if (status !== undefined && status === 'error') {
  //     return 'error';
  //   }

  //   return 'success';
  // };

  const getStyle = () => {
    const style = {};

    if (status !== undefined && status === 'error') {
      return { border: '2px solid #fe752f', borderRadius: '8px', color: '#fe752f' };
    }

    if (status !== undefined && status === 'info') {
      return { border: '2px solid #E9F3FB', borderRadius: '8px' };
    }

    return style;
  };

  /**
     * Alert
     * 
     * <div style={{textAlign:'left'}}>
        {checked && <CheckIcon />} {children}
      </div>
    <div className={classes.paper} style={getStyle()}>
      <div style={{textAlign:'left'}}>
        <div style={{ verticalAlign:'middle',display: 'inline-block'}}>{children}</div>
        <div style={{ paddingLeft:'5px', verticalAlign:'middle',display: 'inline-block'}}>{checked && <CheckIcon />}</div>
      </div>
    </div>
     */
  return (
    <div className={classes.paper} style={getStyle()}>
      <div style={{ textAlign: 'left' }}>
        <div style={{ verticalAlign: 'middle', display: 'inline-block' }}>{children}</div>
        <div style={{ paddingLeft: '5px', verticalAlign: 'middle', display: 'inline-block' }}>
          {checked && <CheckIcon />}
        </div>
      </div>
    </div>
  );
}

export default SuggestItem;
