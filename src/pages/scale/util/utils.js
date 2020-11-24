export function buildAnswer(scale, testeeInfo, values) {
  const model = {
    testeeInfo,
    scaleName: scale.scaleName,
    startTime: new Date().getTime(),
    endTime: null,
    answerQuestions: [],
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const question of scale.scaleQuestions) {
    
    const item = {
      questionNo: question.questionNo,
      questionType: question.questionType,
      questionData: question.questionData,
      questionContent: question.questionContent,
      objectAnswer: values[question.questionNo] || values[`${question.questionNo}`], // 設定答案
      answerOptions: [],
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const opt of question.scaleOptions) {
      item.answerOptions.push({
        option: opt.option,
        optionData: opt.optionData,
        optionContent: opt.optionContent,
        optionScore:opt.optionScore,
      });
    }

    model.answerQuestions.push(item);
  }

  return model;
}
