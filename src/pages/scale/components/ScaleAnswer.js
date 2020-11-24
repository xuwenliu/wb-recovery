import React, { useState, useEffect } from 'react';
import { createForm } from 'rc-form';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Alert from '@/components/Alert';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import ScaleToolbar from '@/pages/scale/components/ScaleToolbar';
import Factory from '@/pages/scale/components/field/Factory';

function ScaleAnswer(props) {
  const {
    form,
    submit,
    current = 0,
    model,
    model: { scaleQuestions = [] },
    renderQuestionContent: RenderQuestionContent,
    renderOptionContent: RenderOptionContent,
    onChange,
    sortOptions,
  } = props;

  const { getFieldDecorator, getFieldError } = form;

  const [currentStep, setCurrentStep] = useState(0);
  const [answerValues, setAnswerValues] = useState({});

  const changeStep = nextStep => {
    setCurrentStep(nextStep);
  };

  const skipStep = nextStep => {
    setCurrentStep(nextStep);
    if (onChange) {
      onChange({
        type: 'SKIP',
        step: nextStep,
      });
    }
  };

  const changeAnswer = (questionNo, value) => {
    const v = { ...answerValues };
    v[questionNo] = value;

    setAnswerValues(v);

    if (onChange) {
      onChange({
        type: 'ANSWER',
        no: currentStep + 1,
        value,
        values: v,
        step: currentStep,
        changeStep,
        questionSize: scaleQuestions.length,
        setAnswerValues,
      });
    }
  };

  const questions = () => {
    model.scaleQuestions.sort((a, b) => a.questionNo * 1 - b.questionNo * 1);

    const question = model.scaleQuestions[currentStep];

    if (sortOptions) {
      sortOptions(question.scaleOptions);
    } else {
      question.scaleOptions.sort((a, b) => a.option * 1 - b.option * 1);
    }

    const { questionType, scaleOptions } = question;

    const errors = getFieldError(`${question.questionNo}`);

    return [
      <div key={question.questionNo}>
        <div>
          <FormControl
            style={{ width: '100%', cursor: 'pointer' }}
            key={question.questionNo}
            component="fieldset"
          >
            <div
              style={{
                margin: 20,
              }}
            >
              <FormLabel style={{ lineHeight: '30px' }} component="legend" focused={false}>
                {RenderQuestionContent ? (
                  <RenderQuestionContent model={model} question={question} />
                ) : (
                  <Typography>
                    {question.questionNo}.{question.questionContent}
                  </Typography>
                )}
              </FormLabel>
            </div>

            {getFieldDecorator(`${question.questionNo}`, {
              initialValue: answerValues[`${question.questionNo}`] || '',
              onChange: e => {
                if (e.target) {
                  changeAnswer(question.questionNo, e.target.value);
                } else {
                  changeAnswer(question.questionNo, e);
                }
              },
              rules: [{ required: true, message: '这道题必须回答' }],
            })(
              <Factory
                questionType={questionType}
                scaleOptions={scaleOptions}
                RenderOptionContent={RenderOptionContent}
              />
            )}
          </FormControl>
        </div>
        {errors ? <Alert type="error">{errors.join(',')}</Alert> : null}
      </div>,
    ];
  };

  useEffect(() => {
    if (current !== 0) {
      skipStep(current);
    }
  }, []);

  return (
    <div>
      <Paper style={{ paddingBottom: '10px', margin: 10 }} elevation={3}>
        {questions()}
      </Paper>
      <ScaleToolbar
        form={form}
        submit={submit}
        answerValues={answerValues}
        scaleQuestions={scaleQuestions}
        changeStep={changeStep}
        currentStep={currentStep}
      />
    </div>
  );
}

export default createForm({})(ScaleAnswer);
