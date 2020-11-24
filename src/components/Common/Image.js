import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '708px',
    height: '256px',
    border: '1px solid black',
    verticalAlign: 'middle',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    margin: 'auto',
  },
});

function Page(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState();
  const { width, height } = props;

  if (loading) {
    return <div variant="rect" width={width} height={height} />;
  }

  return (
    <div className={classes.root}>
      <img
        className={classes.img}
        {...props}
        onLoad={() => {
          setLoading(false);
        }}
        alt=""
      />
    </div>
  );
}

export default Page;
