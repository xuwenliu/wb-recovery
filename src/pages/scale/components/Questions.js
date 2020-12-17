import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { formatDateFromTime } from '@/utils/format';

function Questions({ form, submit, answerValues, scaleQuestions, changeStep, currentStep }) {
    
    return (
        <div style={mediumScreen ? styleIpad : stylemobile}>
            <Grid container {...flag}>
                {result}
            </Grid>
        </div>
    );
}

export default Questions;
