import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { formatDateFromTime } from '@/utils/format';

function ScaleToolbar({ form, submit, answerValues, scaleQuestions, changeStep, currentStep }) {
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.mediumScreen);

  const result = [];

  result.push(
    <Grid key="pre-button" item>
      <Button
        disabled={currentStep === 0}
        variant="contained"
        color="primary"
        onClick={() => {
          /**
                    form.validateFields(err => {
                      if (!err) {
                        changeStep(currentStep - 1);
                      }
                    });
                     */
          changeStep(currentStep - 1);
        }}
      >
        上一题
      </Button>
    </Grid>
  );

  result.push(
    <Grid
      key="process"
      style={{ textAlign: 'center', lineHeight: '35px', marginLeft: '10px', marginRight: '10px' }}
      item
    >
      {Object.keys(answerValues).length === scaleQuestions.length ? (
        <Button
          variant="contained"
          color="primary"
          style={{ width: '100%' }}
          onClick={() => {
            form.validateFields(err => {
              if (!err) {
                submit(answerValues);
              } else {
                console.log('err:', err);
              }
            });
          }}
        >
          提 交
        </Button>
      ) : (
        <div>
          {currentStep + 1} / {scaleQuestions.length}
        </div>
      )}
    </Grid>
  );

  result.push(
    <Grid key="next-button" item>
      <Button
        disabled={currentStep === scaleQuestions.length - 1}
        variant="contained"
        color="primary"
        onClick={() => {
          form.validateFields(err => {
            if (!err) {
              changeStep(currentStep + 1);
            }
          });
        }}
      >
        下一题
      </Button>
    </Grid>
  );

  const stylemobile = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 7,
    backgroundColor: 'white',
    borderTop: '1px solid rgb(240,240,240)',
  };
  const styleIpad = { margin: 20 };

  const flag = mediumScreen ? '' : { justify: 'center', alignItems: 'center' };

  return (
    <div style={mediumScreen ? styleIpad : stylemobile}>
      <Grid container {...flag}>
        {result}
      </Grid>
    </div>
  );
}

export default ScaleToolbar;
