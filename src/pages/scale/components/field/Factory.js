import React from 'react';

import SingleSelect from '@/pages/scale/components/field/SingleSelect';
import MultiSelect from '@/pages/scale/components/field/MultiSelect';

function Factory({ questionType, ...others }, ref) {
  
  if (questionType === 'SIG_SELECTION') {
    return <SingleSelect {...others} />;
  }

  if (questionType === 'MULTISELECT') {
    return <MultiSelect {...others} />;
  }

  return <div />;
}

export default React.forwardRef(Factory);
