import React from 'react';

import { uniqueId } from 'lodash/util';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const getInfo = report => {
  const { scoringResults } = report;

  const result = [];

  scoringResults
    .sort((a, b) => a.scoreName.localeCompare(b.scoreName, 'zh-CN'))
    .forEach(({ scoreName, score, scoreExplain }) => {
      result.push({ scoreName, score, explain: scoreExplain.join() });
    });

  return result;
};

function DefaultReportTable({ reports }) {
  return (
    <div>
      {reports.map(report => {
        return (
          <TableContainer key={uniqueId()} component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>scoreName</TableCell>
                  <TableCell>score</TableCell>
                  <TableCell>explain</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getInfo(report).map(row => (
                  <TableRow key={uniqueId()}>
                    <TableCell component="th" scope="row">
                      {row.scoreName}
                    </TableCell>
                    <TableCell align="right">{row.score}</TableCell>
                    <TableCell align="right">{row.explain}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      })}
    </div>
  );
}

export default DefaultReportTable;
