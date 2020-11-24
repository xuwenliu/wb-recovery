import React from 'react';

import SingleSubScale from '@/pages/scale/components/subScale/SingleSubScale';
import FixSubScale from '@/pages/scale/components/subScale/FixSubScale';

function SubScale(props) {
  const { choiceType } = props;

  if (choiceType === 'SINGLE') {
    return <SingleSubScale {...props} />;
  }

  return <FixSubScale {...props} />;
}

export default SubScale;
