import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Chart, Geom, Axis } from 'bizcharts';
import { root1 } from '@/utils/publicStyles'
const useStyles = makeStyles(theme => ({
  root: root1
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

const getDisplay = value => {
  const score = value * 1;

  if (score <= 50) {
    return {
      title: '基本无焦虑',
      desc: '基本没有出现焦虑相关情绪',
      suggest:
        '祝贺您，根据您的测试结果，得分低于国内常模 50 分，显示您的焦虑水平很低，事实上，这比大多数人要低得多。表明在过去的七天中，您基本没有出现焦虑相关情绪，焦虑水平正常，可以说基本上是淡定地过好每一天。建议继续保持目前状况！',
    };
  }

  if (score > 50 && score <= 59) {
    return {
      title: '轻度焦虑',
      desc: '有不适感，但对日常生活影响不大',
      suggest:
        '根据您的测试结果，近两周来您存在轻度焦虑，这会让您有不适感，但通过自我调节，可以减低这种不适感。建议：改变认知，有些人产生焦虑往往是因为对造成焦虑的事实或情境认识有偏差。因此，首先要告诫自己冷静下来，仔细考虑焦虑的真正内容和来源。可以尝试给自己开个清单，把每个可能引起焦虑的潜在因素都记录下来，然后审查、分析。这样可避免焦虑的扩散。积极行动，当面临的问题确实可以通过行动加以解决时，就可采取以问题为中心的策略，迅速采取行动消除问题。',
    };
  }

  if (score > 60 && score <= 69) {
    return {
      title: '中度焦虑',
      desc: '焦虑已经在身体或是情绪上有一定反映',
      suggest:
        '您的焦虑已经在身体或情绪上有所体现，需要引起关注。建议改变认知，尝试多角度看待问题；积极行动，通过解决具体问题减轻焦虑感；扩大交往对象的范围，建立和谐的人际关系，通过可靠、广泛的社会支持系统排解焦虑。如果焦虑感已经影响到您的正常工作生活和人际交往，则需要寻求专业的心理帮助。',
    };
  }

  if (score > 69) {
    return {
      title: '重度焦虑',
      desc: '压力大，可能被各种焦躁的情绪环绕',
      suggest:
        '测试结果显示您的焦虑程度较高，近两周来强大的压力感已影响到了您的正常生活，建议引起重视！注意休息、加强锻炼，多与周围人沟通交流，调节认知结构，如果如果通过一段时间的自身调节不适感仍不能减轻，应及时寻求专业的心理帮助和支持。',
    };
  }
};

export default function Page(props) {
  const classes = useStyles();
  const { report } = props;
  if (report === null) {
    return null;
  }
  const data = buildReport(report);

  const display = getDisplay(data.sums[0].score);

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <Typography level={2} variant="h4" align="center" gutterBottom>
          {data.scaleName}
        </Typography>

        {data.sums.map(sum => (
          <div style={{ marginTop: '20px' }}>
            <Chart
              data={[
                {
                  x: '警戒线',
                  y: 50,
                },
                {
                  x: '你的得分',
                  y: sum.score * 1,
                },
              ]}
              height={300}
              forceFit
            >
              <Axis name="x" />
              <Axis name="y" />
              <Geom
                type="interval"
                position="x*y"
                color={[
                  'x',
                  value => {
                    if (value === '警戒线') {
                      return '#DC143C';
                    }
                    return '#3CB371';
                  },
                ]}
              />
            </Chart>
            <Typography level={4} variant="h6" color="secondary" gutterBottom>
              {display.title}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {display.desc}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {display.suggest}
            </Typography>
          </div>
        ))}
      </Paper>
    </div>
  );
}
