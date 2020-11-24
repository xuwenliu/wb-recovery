import React, { useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Header from '@/components/AppHeader';
import router from '@/utils/router';
import { connect } from 'dva';

import { createForm } from 'rc-form';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Pagination from '@/components/Pagination';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { Modal } from 'antd-mobile';

const { alert } = Modal;

const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    height: '40px',
    marginTop: '10px',
    marginLeft: theme.spacing(20),
  },
  Typography: {
    marginTop: '4%',
    marginLeft: '7%',
    marginBottom: '3%',
  },
  paper: {
    padding: '2px 4px',
    marginTop: '-8.6%',
    marginLeft: '56%',
    marginBottom: '3%',
    display: 'flex',
    alignItems: 'center',
    width: 300,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

const columns = [
  { id: 'number', label: '编号', minWidth: 100 },
  { id: 'name', label: '姓名', minWidth: 100 },
  { id: 'fun', label: '功能' },
];

function Page({
  dispatch,
  form,
  scaleUser: { record = {} },
  match: {
    params: { id },
  },
}) {
  const { getFieldDecorator } = form;

  const fetch = () => {
    dispatch({
      type: 'scaleUser/fetch',
      payload: { id },
    });
  };

  const edit = row => {
    router.push({
      pathname: '/scale/user/detail',
      query: row.id ? { id: row.id } : {},
    });
  };

  const remove = row => {
    alert('警示信息', '确定删除?', [
      { text: '取消', onPress: () => console.log('取消') },
      {
        text: '确定',
        onPress: () => {
          dispatch({
            type: 'scaleUser/deleteObject',
            payload: { id: row.id },
            callback: () => {
              fetch();
            },
          });
        },
      },
    ]);
  };

  const { content = [], totalPages } = record;
  const [page, setPage] = React.useState(1);
  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'scaleUser/fetch',
          payload: { values, pagination: { page: newPage - 1, size: 8 } },
        });
      }
    });
    setPage(newPage);
  };

  const handleClick = () => {
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'scaleUser/fetch',
          payload: { values },
        });
      }
    });
  };

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleUser/clear',
        payload: {},
      });
    };
  }, []);

  return (
    <Fragment>
      <Header returnUrl="/home">
        个案
        <Button
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: '16px',
            lineHeight: '48px',
            fontWeight: 'bold',
          }}
          onClick={() => {
            edit({});
          }}
          fontSize="large"
        >
          新增
        </Button>
      </Header>
      <Paper variant="outlined">
        <Typography className={classes.Typography} variant="h4">
          搜索 关键字
        </Typography>
        <Paper className={classes.paper}>
          <IconButton className={classes.iconButton} onClick={handleClick}>
            <SearchIcon />
          </IconButton>
          <FormControl component="fieldset">
            {getFieldDecorator('text', {})(
              <InputBase className={classes.input} placeholder="搜索  关键字" />
            )}
          </FormControl>
        </Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.id} align="center" style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {content.map(row => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="center">{row.number}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          edit(row);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      ｜
                      <IconButton
                        onClick={() => {
                          remove(row);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Pagination totalPages={totalPages} page={page} onChange={handleChangePage} />
        </TableContainer>
      </Paper>
    </Fragment>
  );
}
const warp = createForm({})(Page);

export default connect(({ scaleUser, loading }) => ({
  loading: loading.effects['scaleUser/fetch'],
  scaleUser,
}))(warp);
