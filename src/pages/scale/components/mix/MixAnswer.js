/* eslint-disable compat/compat */
/* eslint-disable no-restricted-globals */
import React, { Fragment, useEffect, useState } from 'react';
import ScaleAnswer from '@/pages/scale/components/ScaleAnswer';

const build = scales => {
  const scaleQuestions = [];

  scales.forEach((sclae, index) => {
    sclae.scaleQuestions.forEach(q => {
      const { questionNo, ...others } = q;
      const no = (index + 1) * 1000 + questionNo;
      // if (questionNo * 1 < 2) {
      scaleQuestions.push({
        questionNo: no,
        ...others,
      });
      // }
    });
  });

  return {
    scaleQuestions,
  };
};

export default function page({ scales, submit }) {
  const [page, setPage] = useState();

  const handle = values => {
    const answers = {};

    Object.keys(values).forEach(key => {
      const value = values[key];
      const index = Math.floor(key / 1000);
      const { scale } = scales[index - 1].computes[0];
      // console.log('index:',index,value,scale);
      if (answers[index] === undefined) {
        answers[index] = {
          id: scales[index - 1].id,
          scale,
          subScale: `${scale.scaleType}.${scale.scaleName}`,
          values: {},
        };
      }
      answers[index].values[key - index * 1000] = value;
      // console.log('answers:', answers);
    });

    submit(Object.values(answers));
  };

  useEffect(() => {
    if (scales.length > 0) {
      const ary = [];
      scales.forEach(i => {
        ary.push(i.computes[0].scale);
      });
      setPage(build(ary));
    }
  }, [scales]);

  return <Fragment>{page && <ScaleAnswer model={page} submit={handle} />}</Fragment>;
}
