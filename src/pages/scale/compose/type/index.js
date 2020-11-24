/* eslint-disable compat/compat */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from '@/utils/router';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Header from '@/components/AppHeader';
import CardList from '@/components/CardList';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(1),
    minWidth: 200,
  },
  text: {
    fontSize: 19,
    color: '#ffc300',
  },
}));

function Page(props) {
  const classes = useStyles();
  const {
    scaleComposeType: { categories = [], data },
    dispatch,
  } = props;

  const [scaleType, setScaleType] = useState('综合心理健康量表');

  // eslint-disable-next-line no-unused-vars
  const record = id => {
    router.push({
      pathname: '/scale/answerRecord',
      query: {
        scale: id,
      },
    });
  };

  const answer = ({ id }) => {
    router.push({
      pathname: '/scale/compose/testeeinfo',
      query: { compose: id },
    });
  };

  const fetchCategories = () => {
    dispatch({
      type: 'scaleComposeType/categories',
      payload: {},
    });
  };

  const fetch = type => {
    dispatch({
      type: 'scaleComposeType/fetch',
      payload: { scaleType: type },
    });
  };

  const onChangeScaleType = event => {
    const type = event.target.value;
    setScaleType(type);
    fetch(type);
  };

  useEffect(() => {
    fetchCategories();
    fetch(scaleType);
    return () => {
      dispatch({
        type: 'scaleComposeType/clear',
        payload: {},
      });
    };
  }, []);

  return (
    <div title="量表列表">
      <Header returnUrl="/home">量表清单</Header>
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.text}>量表總類</InputLabel>
        <Select onChange={onChangeScaleType} defaultValue="综合心理健康量表">
          {categories.map(category => (
            <MenuItem value={category} id={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {[...(data ? data.content : [])].map(item => (
        <CardList
          onClick={() => {
            answer(item);
          }}
        >
          <Typography gutterBottom variant="h5" component="h2">
            {item.scaleName}
          </Typography>
          <Typography gutterBottom variant="body2" color="textSecondary" noWrap>
            {item.explanation}
          </Typography>
        </CardList>
      ))}
    </div>
  );
}

export default connect(({ scaleComposeType, loading }) => ({
  scaleComposeType,
  loading: loading.models.scale,
}))(Page);
