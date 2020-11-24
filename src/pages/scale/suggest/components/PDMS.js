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


  const define = {
    婴幼儿: {
      render: ({ checked }) => {
        return (
          <SuggestItem checked={checked}>
            hello 
          </SuggestItem>
        );
      },
      getValues: ({ no, questionContent }) => {
        const { title, ...others } = JSON.parse(questionContent);
        return { no, desc: title, comment: others };
      },
    },
  };

  const example = getExampleData({ model, filter });

  return (
    <div>
      <Typography variant="h6" component="h6" style={{ paddingLeft: '15px', paddingTop: '5px' }}>
        123
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
  );
}

export default FMFM;
