import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import router from '@/utils/router';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(2),
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  pos: {
    marginBottom: 12,
  },
  actions: {
    marginLeft: '-12px',
  },
}));

function Page(props) {
  const classes = useStyles();
  const {
    scaleProject: { records = [] },
    dispatch,
    loading,
  } = props;

  const fetch = () => {
    dispatch({
      type: 'scaleProject/fetch',
      payload: {},
    });
  };

  const view = ({ code }) => {
    router.push({
      pathname: `/project/detail/${code}`,
      query: {},
    });
  };

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleProject/clear',
        payload: {},
      });
    };
  }, []);

  return (
    <Fragment>
      {!loading &&
        records &&
        records.map(({ id, name, description, code }) => (
          <div style={{ marginTop: '-58px' }}>
            <Card key={id} raised className={classes.card}>
              <CardActionArea>
                <CardMedia className={classes.media} image="/images/1.jpg" />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions className={classes.actions}>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => {
                    view({ id, code });
                  }}
                >
                  进入
                </Button>
              </CardActions>
            </Card>
          </div>
        ))}
    </Fragment>
  );
}

export default connect(({ scaleProject, loading }) => ({
  scaleProject,
  loading: loading.models.scaleProject,
}))(Page);
