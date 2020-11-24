import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Spin } from 'antd';
import { useDebounceFn } from '@umijs/hooks';

import Demo1 from './demo1';
import Demo3 from './demo3';

function Demo({ dispatch, ...others }) {
  /**
   * 避免短時間內重複查詢
   */
  const { run: handleSearch } = useDebounceFn((number) => {
    dispatch({
      type: 'scaleDemo/fetchObject',
      payload: { number },
    });
  }, 500);

  /**
   * 帶出量表分類
   */
  const listType = () => {
    dispatch({
      type: 'scaleDemo/listType',
      payload: {},
    });
  };

  /**
   * 帶出列表清單
   */
  const searchScale = ({ scaleType }) => {
    dispatch({
      type: 'scaleDemo/searchScale',
      payload: { scaleType },
    });
  };

  /**
   * 帶出測評紀錄
   */
  const listRecords = (objectId) => {
    dispatch({
      type: 'scaleDemo/searchRecords',
      payload: {
        values: {
          user: objectId,
        },
      },
    });
  };

  /**
   * 帶出訓練計畫
   */
  const getSimpleSuggest = (id) => {
    dispatch({
      type: 'scaleDemo/getSimpleSuggest',
      payload: { id },
    });
  };

  useEffect(() => {
    // login();
    return () => {
      dispatch({
        type: 'scaleDemo/clear',
        payload: {},
      });
    };
  }, []);

  const params = { handleSearch, listType, searchScale, listRecords, getSimpleSuggest, ...others };

  return (
    <div>
      {/**
       * 医学诊断与处方
       * <Demo1 {...params} />
       */}

      {/**
       * 教学课程评量
       *
       */}
      <Demo3 {...params} />
    </div>
  );
}

export default connect(({ scaleDemo, loading }) => ({
  scaleDemo,
  logining: loading.effects['scaleDemo/login'],
  objectsLoading: loading.effects['scaleDemo/fetchObject'],
  typeLoading: loading.effects['scaleDemo/listType'],
  scalesLoading: loading.effects['scaleDemo/searchScale'],
  recordsLoading: loading.effects['scaleDemo/searchRecords'],
  suggestsLoading: loading.effects['scaleDemo/getSimpleSuggest'],
}))(Demo);
