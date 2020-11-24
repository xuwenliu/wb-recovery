/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
const getAnswerQuestionsMap = answerQuestions => {
  const result = {};

  answerQuestions.forEach(question => {
    result[question.questionNo] = question;
  });

  return result;
};

const getItem = (scaleType, scaleName, { questionNo, questionContent, opt }) => {
  return {
    scaleType,
    scaleName,
    questionNo,
    // no: questionNo,
    no: `${scaleType}.${scaleName}.${questionNo}`,
    questionContent,
    optContent: opt.content,
    score: opt.score,
    answerOptions: opt.answerOptions,
  };
};

export function getExampleData({
  model,
  PASS_SCORE, // 有傳及格分.要標註第一次不及格的位置
  filter, // 過濾的方法
}) {
  const record = {};

  const { answers, dimensions } = model;

  let count = 0;
  answers.forEach(av => {
    const { scaleType } = av;
    if (record[scaleType] === undefined) {
      record[scaleType] = [];
    }

    av.answerQuestions = [...av.answerQuestions]
      .sort((a, b) => a.questionNo * 1 - b.questionNo * 1)
      .map(row => {
        const { objectAnswer, answerOptions } = row;
        const index = answerOptions.findIndex(i => i.option * 1 === objectAnswer * 1);
        if (index !== -1) {
          const { optionContent, optionScore } = answerOptions[index];
          return {
            ...row,
            opt: {
              content: optionContent,
              score: optionScore,
              answerOptions,
            },
          };
        }
        return row;
      });

    record[scaleType].push(av);
  });

  const result = [];

  Object.keys(record).forEach(name => {
    const children = [];
    const items = record[name];

    items.forEach(item => {
      const { scaleType, scaleName, answerQuestions } = item;

      const key = scaleType === undefined ? scaleName : `${scaleType}.${scaleName}`;
      const map = getAnswerQuestionsMap(answerQuestions);
      const numbers = dimensions[key]; // 這個量表的維度
      const ds = {};

      const child = { name: scaleName, children: [] };

      if (numbers.length === 0) {
        ds.DEFAULT = answerQuestions; // 沒有維度
        child.children.push({
          name: 'DEFAULT',
          children: answerQuestions.map(i => getItem(scaleType, scaleName, i)),
        });
      } else {
        numbers.forEach(({ name: dname, questions }) => {
          const list = [];
          const sub = {
            name: dname, // 維度
            children: [], // 題目
            tag: undefined,
          };

          if (ds[dname] === undefined) {
            ds[dname] = [];
            questions.forEach(no => {
              ds[dname].push(map[no]);
            });
          }

          questions.forEach((no, index) => {
            const item = getItem(scaleType, scaleName, map[no]);
            if (
              PASS_SCORE !== undefined &&
              sub.tag === undefined &&
              PASS_SCORE === item.score * 1
            ) {
              sub.tag = { index, questionNo: item.questionNo };
            }
            list.push(item);
          });

          if (filter) {
            sub.children = list.filter((i, index) => {
              return filter({ PASS_SCORE, ds: sub, item: i, index });
            });
          } else {
            sub.children = list;
          }

          child.children.push(sub);
        });
      }
      item.ds = ds;

      children.push(child);
    });

    result.push({
      tab: count,
      name,
      children,
    });

    count++;
  });

  return result;
}

export function getResult(suggest) {
  const record = {};

  const { answers, dimensions } = suggest;

  let count = 0;
  answers.forEach(av => {
    const { scaleType } = av;
    if (record[scaleType] === undefined) {
      record[scaleType] = [];
    }

    av.answerQuestions = [...av.answerQuestions]
      .sort((a, b) => a.questionNo * 1 - b.questionNo * 1)
      .map(row => {
        const { objectAnswer, answerOptions } = row;
        const index = answerOptions.findIndex(i => i.option * 1 === objectAnswer * 1);
        if (index !== -1) {
          const { optionContent, optionScore } = answerOptions[index];
          return { ...row, opt: { content: optionContent, score: optionScore } };
        }
        return row;
      });

    record[scaleType].push(av);
  });

  const result = [];

  Object.keys(record).forEach(name => {
    const items = record[name];

    items.forEach(item => {
      const { scaleType, scaleName, answerQuestions } = item;
      const key = scaleType === undefined ? scaleName : `${scaleType}.${scaleName}`;
      const map = getAnswerQuestionsMap(answerQuestions);
      const numbers = dimensions[key]; // 這個量表的維度
      const ds = {};

      if (numbers.length === 0) {
        ds.DEFAULT = answerQuestions; // 沒有維度.例如：照顾者协助
      } else {
        numbers.forEach(({ name: dname, questions }) => {
          if (ds[dname] === undefined) {
            ds[dname] = [];
            questions.forEach(no => {
              ds[dname].push(map[no]);
            });
          }
        });
      }
      item.ds = ds;
    });

    result.push({
      tab: count,
      name,
      items,
    });

    count++;
  });

  return result;
}
