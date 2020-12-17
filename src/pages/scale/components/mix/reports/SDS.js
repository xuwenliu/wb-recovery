/* eslint-disable no-restricted-syntax */
/* eslint-disable no-lonely-if */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Chart, Geom, Axis } from 'bizcharts';
import { root1 } from '@/utils/publicStyles'

const useStyles = makeStyles(theme => ({
  root: root1,
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

  if (score <= 53) {
    return {
      title: '基本无抑郁',
      desc: '基本没有出现抑郁相关情绪，心理状态较好， 遇到沮丧的事情懂得自我调节',
      suggest:
        '基本没有出现抑郁相关情绪，心理状态较好，遇到沮丧的事情懂得自我调节。祝贺您，根据您的测试结果，得分低于国内常模 53 分，显示您的抑郁水平很低，事实上，这比大多数人要低得多。表明在过去的七天中，您基本没有出现抑郁相关情绪，心理状态较好，遇到沮丧的事情懂得自我调节。快乐的心情继续保持哦！日常生活中要继续关爱自己，平时多喝水，多吃水果，保持规律的锻炼， 多和爱人朋友在一起，都利于保持好心情。这很可能是由于您积极的态度、健康的生活作息和良好的应对技巧和策略。不过，如果你其实自感痛苦，且难以自控。请及时进行专业的心理咨询。抑郁障碍如同躯体疾病的发烧，是需要借助外力才能战胜的。',
    };
  }

  if (score > 53 && score <= 62) {
    return {
      title: '轻度抑郁',
      desc: '有不适感，但对日常生活影响不大',
      suggest:
        '您的抑郁状态稍高，已感觉到不适，但目前对日常生活没有太大影响。<br>您的结果稍高于国内常模 53 分，属于轻度抑郁。测试结果提示出您在过去的七天，可能有一个重要特点是存在“内苦外乐”的症状。表现您在举止仪表、言谈接触，外表看来无异常表现，如不深入地做精神检查和心理测定，忽视精神抑郁的实质，甚至可以给人一种愉快乐观的假象。如果深入地做精神检查和心理测定，可发现患者内心有痛苦悲观、多思多虑、自卑消极、无法自行排除的精力、体力、脑力的下降和严重顽固的失眠，多种躯体不适等征象。你对以前的爱好失去兴趣，每天唉声叹气，有时还会感觉非常委屈，流眼泪，甚至反复出现轻生的想法和行为。还有部分患者会自责，认为自己没有对他人和社会做出贡献，对生活失去信心，不愿参加集体活动，喜欢独处。如果长期存在精神状态不佳，不高兴，感觉生活有些累等症状，而不是偶尔出现。不仅对兴奋表现得非常淡然，对遇到的令自己不开心的小事会大发脾气，易激动，敏感多疑。如果您感到痛苦， 希望能尽快缓解，可以向心理专家咨询，以便进行进一步评定和专业的心理辅导。',
    };
  }

  if (score > 63 && score <= 72) {
    return {
      title: '中度抑郁',
      desc: '抑郁已经在身体或是情绪上有一定反映，对自己的日常生活有一定困扰。',
      suggest:
        '抑郁情绪已经在身体或是心理上有一定反映，对自己的日常生活有一定困扰。<br>您的结果稍高于国内常模 53 分，属于中度抑郁，抑郁的状态已经在您的身体和心理上有一定的反映。表现为社会功能下降、出现顽固持久、久治难愈的以失眠为中心睡眠障碍、意识清晰，仪表端正，对自己疾病有深切的主观体验，内心感到异常痛苦，因而均有强烈求医愿望，常常为此四处奔走，多方觅法（所谓“急病乱投医”）由于不了解病情的实质，得不到明确诊断，尽管浪费大量人力、财力和精力，最终仍得不到解决。以心境低落，兴趣和愉快感丧失，容易疲劳， 如果无缘无故地持久两周以上，甚至数月不见好转，通常被视为中度抑郁症最典型的症状。您可能对现在的生活状态没那么满意、容易自责和内疚，也可能对他人和原来爱做的事情缺乏兴趣，工作动力和效率降低。您可以试着调整生活节奏、多锻炼、和大自然接触、或者和朋友倾诉来改善抑郁的状态。如果您感到每天大部分时间都处于这样的状态并且这种情绪状态已经影响到了自己的正常生活和社交活动，建议您尽快去寻求专业的心理帮助与支持。',
    };
  }

  if (score > 72) {
    return {
      title: '重度抑郁',
      desc: '严重影响到自己的学习跟生活，明显干扰了社交或职业功能',
      suggest:
        '您的抑郁有点爆表，感到自己经常被各种压抑的情绪环绕，已经严重影响到自己的学习跟生活，明显干扰了社交或职业功能。<br>您的结果远高于常模 53 分，属于重度抑郁。表明在过去的七天，您的抑郁程度已经达到较高水平，可能表现为情绪的持续低落，注意力集中困难，记忆力减退，食欲性欲减退，意志消沉，缺乏兴趣。你可能存在社交能力障碍、不合群、离群、情绪低落、躯体不适、食欲不振等症状，容易失眠，似乎对周围一切事物都不感兴趣，甚至对以往感兴趣和擅长的事物亦是如此；对外界喜怒哀乐的情境视而不见，忧郁心境占优势地位。重型抑郁症患者还会出现悲观厌世、绝望、幻觉妄想、功能减退、并伴有严重的自杀企图，甚至自杀行为。抑郁可能已经对您的生活工作以及社交活动产生比较大的困扰，请您不要因为太忙或者时间太少而忽略身体传递给自己的真实信息。您可以试着找一些方法来自助缓解，例如注重休息、规律锻炼、像信任的人倾诉。如果这种状态已经持续了一段时间且自助的方式难以缓解您的症状，建议您立即寻求专业的心理帮助和支持。',
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
                  y: 53,
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
