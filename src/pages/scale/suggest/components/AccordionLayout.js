import React from 'react';

import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SuggestItem from './SuggestItem';

function AccordionLayout(params) {
  const { questions, full, getValues, changeValue, UI, items, isChecked } = params;
  return (
    <div>
        {
            /**
             * 
             */
        }
      {questions.map(
        ({ id, no, questionNo, questionContent, optContent, score, answerOptions }) => (
          <ExpansionPanel key={`${no}`} TransitionProps={{ unmountOnExit: true }}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions1-content"
              id="additional-actions1-header"
            >
              <FormControlLabel
                aria-label="Acknowledge"
                onClick={event => event.stopPropagation()}
                onFocus={event => event.stopPropagation()}
                control={<Checkbox />}
                label={
                  UI ? (
                    <UI
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
                  )
                }
              />
            </ExpansionPanelSummary>
          </ExpansionPanel>
        )
      )}

      
    </div>
  );
}

export default AccordionLayout;
