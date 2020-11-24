import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { getExampleData } from '@/pages/scale/suggest/utils';
import LayoutManager from './LayoutManager';
import SuggestItem from './SuggestItem';
import LoadingBox from '@/components/LoadingBox';

/**
 * 對應表
 */
const mapping = [
  { no: 1, value: '11.56' },
  { no: 2, value: '12.29' },
  { no: 3, value: '13.34' },
  { no: 4, value: '13.34' },
  { no: 5, value: '17.11' },
  { no: 6, value: '24.36' },
  { no: 7, value: '26.19' },
  { no: 8, value: '26.61' },
  { no: 9, value: '30.80' },
  { no: 10, value: '36.42' },
  { no: 11, value: '43.17' },
  { no: 12, value: '46.86' },
  { no: 13, value: '49.07' },
  { no: 14, value: '52.66' },
  { no: 15, value: '35.05' },
  { no: 16 },
  { no: 17, value: '39.05' },
  { no: 18, value: '39.62' },
  { no: 19, value: '42.04' },
  { no: 20, value: '42.42' },
  { no: 21, value: '45.91' },
  { no: 22, value: '46.10' },
  { no: 23, value: '47.42' },
  { no: 24, value: '47.84' },
  { no: 25, value: '38.32' },
  { no: 26, value: '39.47' },
  { no: 27, value: '40.18' },
  { no: 28, value: '40.89' },
  { no: 29, value: '42.21' },
  { no: 30, value: '45.10' },
  { no: 31, value: '50.06' },
  { no: 32, value: '52.19' },
  { no: 33, value: '53.23' },
  { no: 34, value: '61.55' },
  { no: 35, value: '70.71' },
  { no: 36, value: '76.03' },
  { no: 37, value: '79.26' },
  { no: 38 },
  { no: 39, value: '39.82' },
  { no: 40, value: '46.06' },
  { no: 41, value: '46.17' },
  { no: 42, value: '47.28' },
  { no: 43, value: '52.96' },
  { no: 44, value: '53.67' },
  { no: 45, value: '60.12' },
  { no: 46, value: '62.18' },
  { no: 47, value: '63.81' },
  { no: 48, value: '64.36' },
  { no: 49, value: '65.11' },
  { no: 50, value: '66.36' },
  { no: 51, value: '68.53' },
  { no: 52, value: '70.65' },
  { no: 53, value: '72.32' },
  { no: 54, value: '73.30' },
  { no: 55, value: '74.09' },
  { no: 56, value: '75.78' },
  { no: 57, value: '76.87' },
  { no: 58, value: '77.97' },
  { no: 59, value: '79.58' },
  { no: 60, value: '80.32' },
];

const getTotalState = model => {
  const { reports } = model;
  const index = reports[0].scoringResults.findIndex(result => result.scoreName === '总分.能力值');
  if (index !== -1) {
    const [value] = reports[0].scoringResults[index].score.split('|');
    return value * 1;
  }
};

/**
 * 取得目前的訓練水平
 */
const getTargetItem = state => {
  let result;
  mapping.forEach(item => {
    if (result === undefined && item.value >= state && mapping[`${item.no - 1}`]) {
      result = item;
    }
  });
  return result;
};

/**
 * 取得目標範圍.使用(总分.能力值)定位.找出上下各五個題項
 */
const getRange = (model, level) => {
  const min = level.no * 1 - 5 <= 0 ? 0 : level.no * 1 - 5;
  const max =
    level.no * 1 + 4 >= model.answers[0].answerQuestions.length
      ? model.answers[0].answerQuestions.length
      : level.no * 1 + 4;

  return { min, max };
};

function FMFM(props) {
  const { model, items, changeValue } = props;

  const [example, setExample] = React.useState();

  const state = getTotalState(model);
  const level = getTargetItem(state); // 現在的水平
  const { min, max } = getRange(model, level); // 訓練範圍

  const filter = ({ item }) => {
    const { 难度值 } = JSON.parse(item.questionContent);
    if (难度值 === undefined) {
      console.log(item.questionContent);
    }

    if (item.questionNo >= min && item.questionNo <= max) {
      return true;
    }

    return false; // 返回 false. 會被剔除
  };

  const nextTarget = ({ score, answerOptions }) => {
    let ret;

    answerOptions.some(opt => {
      if (opt.optionScore * 1 > score * 1) {
        ret = opt;
        return true;
      }
    });

    return ret;
  };

  const define = {
    婴幼儿: {
      render: ({ checked, questionNo, optContent, score, answerOptions }) => {
        const next = nextTarget({ score, answerOptions });
        const status = level.no === questionNo ? 'info' : null;
        return (
          <SuggestItem checked={checked} status={status}>
            {level.no === questionNo && <span>＊</span>}
            <b>现有能力</b>：{optContent}
            {next && (
              <div>
                <b>发展目标</b>：{next.optionContent}
              </div>
            )}
          </SuggestItem>
        );
      },
      getValues: ({ no, questionContent }) => {
        const { title, ...others } = JSON.parse(questionContent);
        return { no, desc: title, comment: others };
      },
    },
  };

  useEffect(() => {
    setExample(getExampleData({ model, filter }));
  }, [model.answers.length]);

  return example ? (
    <div>
      <Typography variant="h6" component="h6" style={{ paddingLeft: '15px', paddingTop: '5px' }}>
        总分 能力值:{state}
      </Typography>
      <LayoutManager
        example={example}
        items={items}
        changeValue={changeValue}
        define={define}
        full // 每個選項佔滿該列
        displayType={false} // 顯示分類標題
      />
    </div>
  ) : (
    <LoadingBox />
  );
}

export default FMFM;
