import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { formatDateFromTime } from '@/utils/format';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  table: {
    minWidth: 650,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
  title: {
    fontSize: '1.17em',
    fontWeight: 500,
  },
  text: {
    fontSize: '1em',
    fontWeight: 400,
  },
}));

// eslint-disable-next-line no-unused-vars
function TesteeInfo({ user, testeeInfo }) {
  const classes = useStyles();
  // console.log('user:', user, 'testeeInfo', testeeInfo);
  // const [, value] = testeeInfo;
  // const values = value.split(':');
  // const [, month] = values;
  // console.log('month:', month);
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>姓名</TableCell>
              <TableCell align="center">性别</TableCell>
              <TableCell align="center">出生日期</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                {user.name}
              </TableCell>
              <TableCell align="center">{user.gender}</TableCell>
              <TableCell align="center">{formatDateFromTime(user.birthday)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default TesteeInfo;
