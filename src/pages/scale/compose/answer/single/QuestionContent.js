import React from 'react';

import { isPlainObject } from 'lodash/lang';

function QuestionContent({ question }) {
  
  const { questionNo, questionContent } = question;

  if (isPlainObject(questionContent) === false) {
    return questionContent;
  }

  return (
    <table width="100%">
      <tbody>
        <tr>
          <td width="30%">项目 {questionNo}</td>
          <td width="70%">hello</td>
        </tr>
        
      </tbody>
    </table>
  );
}

export default QuestionContent;
