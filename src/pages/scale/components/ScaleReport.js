/* eslint-disable no-restricted-syntax */
/* eslint-disable no-lonely-if */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Chart, Geom, Axis } from 'bizcharts';
import Dimension from './Dimension';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      padding: theme.spacing(2),
      width: '100%',
    },
    lineControl: {
      paddingTop: '20px',
    },
  },
}));

const buildReport = report => {
  const model = {
    scaleName: report.scaleName,
    dimensions: [],
    sums: [],
  };

  const addDimension = (obj, target, item) => {
    const { dimensions = [] } = obj;

    dimensions.forEach(dimension => {
      if (dimension.name === target) {
        if (!dimension.dimensions) {
          // eslint-disable-next-line no-param-reassign
          dimension.dimensions = [];
        }
        dimension.dimensions.push(item);
      } else {
        addDimension(dimension, target, item);
      }
    });

    // eslint-disable-next-line no-param-reassign
    obj.dimensions = dimensions;
  };

  let id = 0;

  const { scoringResults } = report;
  scoringResults.forEach(result => {
    const { scope, scoreType, scoreName } = result;

    if (scope === 'TOTAL_SCORE') {
      // 判斷是總分
      if (scoreType !== 'MeanScore') {
        // 不是均分
        if (scoreName !== 'TOTAL_SCORE') {
          // 判断不显示总分而显示scoreName内容
          model.sums.push({
            score: result.score,
            title: `${result.scoreName}:${result.score}`,
            explain: result.scoreExplain,
          });
        } else {
          // 判断显示总分
          model.sums.push({
            score: result.score,
            title: `你的测试总分为:${result.score}`,
            explain: result.scoreExplain,
          });
        }
      } else {
        // 是均分
        if (scoreName !== 'TOTAL_SCORE') {
          model.sums.push({
            score: result.score,
            title: `${result.scoreName}:${result.score}`,
            explain: result.scoreExplain,
          });
        } else {
          model.sums.push({
            score: result.score,
            title: `你的测试总均分为:${result.score}`,
            explain: result.scoreExplain,
          });
        }
      }
    } else {
      // 判斷是維度
      model.dimensions.push({
        id: (id += 1),
        name: result.scoreName,
        score: result.score,
        scoreType: result.scoreType,
        scoreExplain: result.scoreExplain,
      });
    }
  });

  /**
   * 累加子維度
   */
  scoringResults.forEach(result => {
    const { scope } = result;
    if (scope !== 'DIMENSIONS' && scope !== 'TOTAL_SCORE') {
      /**
       * 增加為子維度
       */

      addDimension(model, scope, {
        id: (id += 1),
        level: 1,
        name: result.scoreName,
        score: result.score,
        scoreType: result.scoreType,
        scoreExplain: result.scoreExplain,
      });
    }
  });

  return model;
};

export default function Page(props) {
  const classes = useStyles();
  const {
    report,
    config = {
      DISPLAY_HEADER: true,
    },
  } = props;
  if (report === null) {
    return null;
  }
  const data = buildReport(report);
  const barData = [];
  for (const dimension of data.dimensions) {
    barData.push({
      x: dimension.name,
      y: dimension.score * 1,
    });
  }

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        {config.DISPLAY_HEADER && (
          <Typography level={2} variant="h4" align="center" gutterBottom>
            {data.scaleName}
          </Typography>
        )}
        {barData.length > 0 && (
          <Chart data={barData} height={300} forceFit>
            <Axis name="x" />
            <Axis name="y" />
            <Geom type="interval" position="x*y" />
          </Chart>
        )}

        {data.sums.map(sum => (
          <div style={{ marginTop: '20px' }}>
            <Typography level={4} variant="h6" color="secondary" gutterBottom>
              {sum.title}
            </Typography>
            {sum.explain.map(item => (
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {item}
              </Typography>
            ))}
            <Divider />
          </div>
        ))}
        {barData.length > 0 ? (
          <div bodyStyle={{ padding: '20px' }}>
            <div height={295} data={barData} />
          </div>
        ) : null}
        <Dimension dimensions={data.dimensions} />
      </Paper>
    </div>
  );
}
