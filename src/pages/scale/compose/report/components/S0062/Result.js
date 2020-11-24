import React, { useEffect, useState } from 'react';

import Paper from '@material-ui/core/Paper';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'domain', label: '领域', width: '10%' },
  { id: 'analysis', label: '情况分析', width: '30%' },
  { id: 'infer', label: '原因推断', width: '30%' },
  { id: 'suggest', label: '建议策略', width: '30%' },
];

function Page({ data }) {
  const [rows, setRows] = useState([]);

  const buildRows = () => {
    const rs = [];

    data.forEach(e => {
      const row = {
        id: e.name,
        domain: [e.name],
        analysis: {
          advantage: [],
          weak: [],
        },
        infer: [],
        suggest: [],
      };

      e.children.forEach(child => {
        child.children.forEach(c => {
          const score = c.score * 1;
          if (score <= 1) {
            row.analysis.weak.push(c.name); // 情况分析.弱
          } else if (score === 2) {
            row.suggest.push(c.name); // 建议策略
          } else if (score === 3) {
            row.analysis.advantage.push(c.name); // 情况分析强
          }
        });
      });
      rs.push(row);
    });

    console.log(rs);

    setRows(rs);
  };

  const getDisplay = ({ column, value }) => {
    if (column.id === 'analysis') {
      return [<p>优:{value.advantage.join('、')}</p>, <p>弱:{value.weak.join('、')}</p>];
    }

    return value.join(',');
  };

  useEffect(() => {
    buildRows();
    return () => {};
  }, [data]);

  return (
    <Paper style={{ width: '100%', margin: '1%', paddingTop: '5px' }} variant="outlined">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} style={{ width: column.width }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map(column => {
                    return (
                      <TableCell key={column.id}>
                        {getDisplay({ column, value: row[column.id] })}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Page;
