/* eslint-disable react/no-danger */
/* eslint-disable no-plusplus */
import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { getExampleData } from '@/pages/scale/suggest/utils';

import Paper from '@material-ui/core/Paper';
import styles from '@/utils/publicstyle';
import { trim } from 'lodash/string';
import LayoutManager from './LayoutManager';
import SuggestItem from './SuggestItem';
import LoadingBox from '@/components/LoadingBox';

/**
 * 每個維度下找出第一個分數0的題目.
 * 帶出本身的長期目標和下一個長期目標
 */
function AEPS(props) {
  const { model, items, changeValue, fetchPlan, plans } = props;

  const [example, setExample] = React.useState();

  const getExample = () => {
    /**
     * 過濾掉沒有得分為0的.
     * 只出現本身的長期目標和下一個長期目標
     */
    let group = {};
    const refs = [];

    const filter = ({ ds, item, index }) => {
      const { name, tag } = ds;

      if (group.name !== name) {
        group = { name, targetCount: 0 };
        // console.log('filter dname:', group.name, tag);
      }

      const { check } = JSON.parse(item.questionContent);

      let flag = false;

      if (tag === undefined) {
        return false; // 沒有未達標的分數
      }

      if (tag && index >= tag.index) {
        if (group.targetCount < 2) {
          // console.log('show index ', index, check, group.targetCount);
          flag = true;
        }

        if (check.startsWith('G')) {
          group.targetCount++; // 記錄長期目標
        }
      }

      if (flag) {
        refs.push(`${item.scaleType}_${item.scaleName}_${trim(ds.name)}_${check}`);
      }

      return flag; // 返回 false. 會被剔除
    };

    return {
      example: getExampleData({ model, PASS_SCORE: 0, filter }),
      refs,
    };
  };

  const getStatus = (standard, score) => {
    if (score * 1 === standard) {
      return 'error';
    }
  };

  const FUN = {
    render: ({ type, scale, ds, checked, questionNo, questionContent, optContent, score }) => {
      const { title } = JSON.parse(optContent);
      const { check } = JSON.parse(questionContent);
      const display = ref => {
        if (plans) {
          const html = plans[ref];
          if (html) {
            return (
              <Paper
                elevation={1}
                style={{
                  whiteSpace: 'normal',
                  wordBreak: 'break-all',
                  overflow: 'hidden',
                  padding: '15px',
                  margin: '15px',
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: html || '' }} />
              </Paper>
            );
          }
          return (
            <div
              style={{
                whiteSpace: 'normal',
                wordBreak: 'break-all',
                overflow: 'hidden',
                padding: '15px',
                margin: '15px',
              }}
            >
              查无方案：{ref}
            </div>
          );
        }
      };

      return (
        <SuggestItem checked={checked} status={getStatus(0, score)} check={check}>
          <div>
            {getStatus(0, score) !== undefined && getStatus(0, score) === 'error' ? (
              <div style={{ display: 'inline-block', paddingRight: '5px' }}>
                <Avatar style={styles.avatar}>{check}</Avatar>
              </div>
            ) : (
              <div style={{ display: 'inline-block', paddingRight: '5px' }}>
                <Avatar>{check}</Avatar>
              </div>
            )}
            <div style={{ display: 'inline-block' }}>
              ({questionNo}).{score}分 {title}
            </div>
            {display(`${type}_${scale}_${trim(ds)}_${check}`)}
          </div>
        </SuggestItem>
      );
    },
    getValues: ({ type, scale, ds, no, questionContent }) => {
      const { question, ...others } = JSON.parse(questionContent);
      const html = plans[`${type}_${scale}_${trim(ds)}_${others.check}`];
      return { no, desc: question, comment: others, plan: html };
    },
  };

  const define = {
    '0-3岁': FUN,
    '3-6岁': FUN,
  };

  useEffect(() => {
    console.log('**** init once ****');
    const result = getExample();
    setExample(result.example);
    fetchPlan(result.refs);
    console.log('plans size:', result.refs.length);
  }, [model.answers.length]);

  console.log('AEPS render....items:', items);

  return example ? (
    <LayoutManager
      example={example}
      items={items}
      changeValue={changeValue}
      define={define}
      full // 每個選項佔滿該列
    />
  ) : (
    <LoadingBox />
  );
}

export default AEPS;
