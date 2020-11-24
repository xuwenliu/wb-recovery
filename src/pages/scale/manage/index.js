import React, { useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Header from '@/components/AppHeader';
import { connect } from 'dva';
import router from '@/utils/router';
import { createForm } from 'rc-form';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Pagination from '@/components/Pagination';
import TableRow from '@material-ui/core/TableRow';
import DateFnsUtils from '@date-io/date-fns';
// import { DateRangePicker, DateRange, DateRangeDelimiter } from '@material-ui/pickers';

import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import SearchIcon from '@material-ui/icons/Search';
import { formatDateFromTime } from '@/utils/format';

const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    height: '40px',
    marginTop: '10px',
    marginLeft: theme.spacing(20),
  },
  formControl: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(1),
    minWidth: 120,
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
}));

const columns = [
  {
    id: 'reportDate',
    label: '答题时间',
    minWidth: 100,
    render: value => {
      return value ? formatDateFromTime(value) : '';
    },
  },
  { id: 'userName', label: '姓名', minWidth: 100 },
  { id: 'number', label: '报告编号', minWidth: 100 },
  { id: 'scaleName', label: '量表类型', minWidth: 100 },
  { id: 'fun', label: '操作' },
];

function Page({ dispatch, form, scaleManage: { scales = { content: [] }, records = {} } }) {
  const { getFieldDecorator } = form;

  const fetchScales = () => {
    dispatch({
      type: 'scaleManage/fetchScales',
      payload: {},
    });
  };

  const fetch = () => {
    dispatch({
      type: 'scaleManage/fetch',
      payload: {},
    });
  };

  const view = row => {
    router.push({
      pathname: '/scale/compose/report',
      query: { compose: row.scale, id: row.id, name: row.scaleName },
    });
  };

  const { content = [], totalPages } = records;
  const [page, setPage] = React.useState(1);
  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'scaleManage/fetch',
          payload: { values, pagination: { page: newPage - 1, size: 8 } },
        });
      }
    });
    setPage(newPage);
  };

  const handleClick = () => {
    form.validateFields((err, values) => {
      if (!err) {
        const { date, ...others } = values;
        let v = { ...others };
        if (date) {
          v = { date: formatDateFromTime(values.date), ...v };
        }
        dispatch({
          type: 'scaleManage/fetch',
          payload: { values: v },
        });
      }
    });
  };

  useEffect(() => {
    fetchScales();
    fetch();
    return () => {
      dispatch({
        type: 'scaleManage/clear',
        payload: {},
      });
    };
  }, []);

  return (
    <Fragment>
      <Header returnUrl="/home">测评记录</Header>
      <Paper variant="outlined">
        <Paper>
          <FormControl className={classes.formControl} style={{ width: '500' }}>
            <FormLabel component="legend">选择日期</FormLabel>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              {getFieldDecorator('date', {
                initialValue: new Date(),
                rules: [{ required: true, message: '请输入' }],
              })(<KeyboardDatePicker variant="inline" format="yyyy/MM/dd" margin="normal" />)}
            </MuiPickersUtilsProvider>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.text}>量表总类</InputLabel>
            {getFieldDecorator('scale', {
              // initialValue: new Date(),
              rules: [],
            })(
              <Select>
                {scales.content.map(scale => (
                  <MenuItem value={scale.id} id={scale.id}>
                    {scale.scaleName}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
          <FormControl className={classes.formControl}>
            <Button onClick={handleClick}>
              <SearchIcon />
              查询
            </Button>
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
                    {columns.map(column => (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.render ? column.render(row[column.id]) : row[column.id]}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          view(row);
                        }}
                      >
                        查看
                      </Button>
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

export default connect(({ scaleManage, loading }) => ({
  loading: loading.effects['scaleManage/fetch'],
  scaleManage,
}))(warp);
