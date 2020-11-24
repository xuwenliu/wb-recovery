import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import Header from '@/components/AppHeader';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';

import ScaleAnswer from '@/pages/scale/components/ScaleAnswer';
import Report from '@/pages/scale/components/ScaleReport';
import ObjectInfo from '../components/limit/ObjectInfo';

function Page(props) {
  const {
    dispatch,
    scaleAnswer: { compose = { computes: [] }, report, testeeInfo },
  } = props;

  const { computes = [] } = compose;
  const [compute = {}] = computes;
  const { scale } = compute;
  const [step, setStep] = useState(0);

  const {
    match: {
      params: { id },
    },
    location: {
      query: { project },
    },
  } = props;

  console.log('project:', project);

  /**
   * 帶出 1.量表 2.個人資料 3.項目清單
   */
  const fetch = () => {
    dispatch({
      type: 'scaleAnswer/fetchCompose',
      payload: { scaleId: id },
    });
    /**
    dispatch({
      type: 'scaleAnswer/fetchSurveyor',
    });
    dispatch({
      type: 'scaleAnswer/fetchProject',
      payload: { scaleId: id },
    }); 
     */
  };

  const collectObjectInfo = ({ limits }) => {
    dispatch({
      type: 'scaleAnswer/save',
      payload: { testeeInfo: limits },
    });

    setStep(step + 1);
  };

  const submit = answerValues => {
    dispatch({
      type: 'scaleAnswer/submitAnswer',
      payload: { project, compose: id, scale, testeeInfo, answerValues },
      callback: () => {
        setStep(step + 1);
      },
    });
  };

  console.log('project:', project);

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleAnswer/clear',
        payload: {},
      });
    };
  }, []);

  return (
    <div>
      {project ? null : <Header returnUrl="/home">量表答題</Header>}

      <Stepper nonLinear activeStep={step}>
        {['确认信息', '填写问券', '完成'].map(name => (
          <Step key={name}>
            <StepButton onClick={() => {}}>{name}</StepButton>
          </Step>
        ))}
      </Stepper>

      {step === 0 && <ObjectInfo object={{}} scale={scale} collect={collectObjectInfo} />}

      {step === 1 && scale && (
        <div style={{ margin: '20px', paddingTop: '10px' }}>
          <ScaleAnswer model={scale} submit={submit} answer={{}} />
        </div>
      )}

      {step === 2 && report && <Report report={report} />}
    </div>
  );
}

const warp = createForm({})(Page);

export default connect(({ scaleAnswer, loading }) => ({
  scaleAnswer,
  loading: loading.models.scaleAnswer,
}))(warp);
