import React, { useState } from 'react';

import Scale from '@/pages/scale/components/ScaleAnswer';

function Page({ model, answer, submit }) {
  const { scaleType } = model;

  return <Scale model={model} submit={submit} answer={answer} />;
}

export default Page;
