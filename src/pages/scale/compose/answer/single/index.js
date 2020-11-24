import React, { useEffect } from 'react';
import { connect } from 'dva';
import router from '@/utils/router';
import Header from '@/components/AppHeader';
import Scale from '@/pages/scale/components/ScaleAnswer';
import LoadingBox from '@/components/LoadingBox';
import DefaultQuestionContent from './QuestionContent';
import { getCmponent } from './components';

function Page({
  loading,
  dispatch,
  location: {
    query: { compose, id, subScale },
  },
  model: { current, record = {}, answer },
}) {
  const { code, name, scale, testeeInfo } = record;

  const back = () => {
    router.goBack();
  };

  const submit = answerValues => {
    dispatch({
      type: 'scaleComplseAnswerSingle/submitAnswer',
      payload: {
        answerValues,
        params: {
          compose,
          answer: id,
          subScale: `${scale.scaleType}.${scale.scaleName}`,
        },
      },
      callback: back,
    });
  };

  const getUI = () => {
    const UI = getCmponent(code);

    return UI ? (
      <UI model={scale} submit={submit} answer={answer} testeeInfo={testeeInfo} />
    ) : (
      <Scale
        current={current}
        model={scale}
        submit={submit}
        answer={answer}
        renderQuestionContent={DefaultQuestionContent}
      />
    );
  };

  const fetch = (params = {}) => {
    dispatch({
      type: 'scaleComplseAnswerSingle/fetchAnswer',
      payload: { compose, id, subScale, ...params },
    });
  };

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleComplseAnswerSingle/clear',
        payload: {},
      });
    };
  }, []);

  return (
    <>
      <Header>{name}</Header>
      <LoadingBox loading={loading} data={scale}>
        {code && getUI()}
      </LoadingBox>
    </>
  );
}

export default connect(({ scaleComplseAnswerSingle, loading }) => ({
  loading: loading.effects['scaleComplseAnswerSingle/fetchAnswer'],
  model: scaleComplseAnswerSingle,
}))(Page);
