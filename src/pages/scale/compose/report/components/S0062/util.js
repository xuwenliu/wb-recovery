const getMap = answer => {
  const map = {};
  answer.answerQuestions.forEach(i => {
    map[i.questionNo] = i;
  });
  return map;
};

const getQuestion = (map, no) => {
  const q = map[no];

  if (q) {
    const { objectAnswer, answerOptions } = q;
    const index = answerOptions.findIndex(e => e.option === objectAnswer * 1);

    let result = { name: q.questionContent };

    if (index !== -1) {
      result = { ...result, score: answerOptions[index].optionScore };
    }

    return result;
  }

  return {
    title: `X-${no}`,
    score: '',
  };
};

export function getData({ reports, answers }) {
  const data = [];

  reports.forEach((report, i) => {
    const { scaleName, scoringResults } = report;
    const map = getMap(answers[i]);
    const item = {
      name: scaleName,
      children: [],
    };

    scoringResults.forEach(result => {
      const { scope, score, scoreName, questions } = result;
      if (scope === 'TOTAL_SCORE') {
        item.score = score * 1;
      } else {
        const child = {
          name: scoreName,
          score,
          children: questions.map(no => {
            return getQuestion(map, no);
          }),
        };

        item.children.push(child);
      }
    });

    data.push(item);
  });

  return data;
}
