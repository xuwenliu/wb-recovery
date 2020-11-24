import React from 'react';

import Grid from '@material-ui/core/Grid';
import SuggestItem from './SuggestItem';

function GridLayout(params) {
  const { type, scale, ds, questions, full, getValues, changeValue, UI, items, isChecked } = params;

  return (
    <Grid container spacing={2}>
      {questions.map(
        ({ id, no, questionNo, questionContent, optContent, score, answerOptions }) => (
          <Grid
            key={`${no}`}
            item
            xs={full ? 12 : 6}
            onClick={() => {
              const parans = {
                type,
                scale,
                ds,
                id,
                no,
                questionNo,
                questionContent,
                optContent,
                score,
              };
              if (getValues) {
                changeValue(getValues(parans));
              } else {
                changeValue(parans);
              }
            }}
          >
            {UI ? (
              <UI
                type={type}
                scale={scale}
                ds={ds}
                questionNo={questionNo}
                questionContent={questionContent}
                optContent={optContent}
                score={score}
                answerOptions={answerOptions}
                checked={isChecked({ items, no })}
              />
            ) : (
              <SuggestItem checked={isChecked({ items, no })}>
                {questionNo}.{optContent} {score}分
              </SuggestItem>
            )}
          </Grid>
        )
      )}
    </Grid>
  );
}

export default GridLayout;
