import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import ScaleAnswer from '@/pages/scale/components/ScaleAnswer';
import Header from '@/components/AppHeader';
import Paper from '@material-ui/core/Paper';
import Result from '@/components/Result';
import router from '@/utils/router';
import Button from '@material-ui/core/Button';
import styles from './index.less'

// import ScaleReport from '@/pages/scale/components/ScaleReport';

/**
 *

<Result
          message="答题完成.谢谢你的参与."
          next={{ desc: '回到项目', go: `/project/detail/${code}` }}
        />
 */

function Page(props) {
  const {
    dispatch,
    scaleCollect: { compose = { computes: [] }, testeeInfo, report },
  } = props;
  const paperRef = useRef(null);
  const { computes = [], instruction = '' } = compose;
  const [compute = {}] = computes;
  const { scale } = compute;
  const [step, setStep] = useState();
  const {
    match: {
      params: { id },
    },
    location: {
      query: { code, project },
    },
  } = props;

  const fetch = () => {
    dispatch({
      type: 'scaleCollect/fetchCompose',
      payload: { scaleId: id },
      callback:(resp) => {
        const { explanation } = resp;
        if (explanation) {
          setStep(0);
        } else {
          setStep(1);
        }
      }
    });
    /**
    dispatch({
      type: 'scaleCollect/fetchReport',
      payload: { id: '5f570e309823d63fb388e999' },
    });
     */
  };
  
  const submit = answerValues => {
    dispatch({
      type: 'scaleCollect/submitAnswer',
      payload: { project, compose: id, scale, testeeInfo, answerValues },
      callback: () => {
        setStep(step + 1);
      },
    });
  };

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleCollect/clear',
        payload: {},
      });
    };
  }, []);

  const test = true;
  
  const getcontent = (text) => {
    if (paperRef.current) {
      paperRef.current.innerHTML = text
    }
  }

  return (
    <div>
      <Header>{scale && scale.scaleName}</Header>
      {step === 0 && scale && test && (
        <Paper className={styles.instruction} >
          <h3>指导语：</h3>
          <div ref={paperRef} className={styles.content}>
            {getcontent(instruction)}
          </div>
          <Button
            className={styles.intobutton}
            variant="contained"
            color="primary"
            onClick={() => {
              setStep(step + 1)
            }}
          >
            继续
          </Button>
        </Paper>
      )}

      {step === 1 && scale && <ScaleAnswer model={scale} submit={submit} answer={{}} />}
      {step === 2 && report && (
        <Result
          title="答题完成.谢谢你的参与."
          extra={
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                router.replace({
                  pathname: `/project/detail/${code}`,
                  query: {},
                });
              }}
              fullWidth
            >
              回到项目
            </Button>
          }
        />
      )}
    </div>
  );
}

const warp = createForm({})(Page);

export default connect(({ scaleCollect, loading }) => ({
  scaleCollect,
  loading: loading.models.scaleCollect,
}))(warp);
