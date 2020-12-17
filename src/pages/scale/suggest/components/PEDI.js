import React, { useEffect } from 'react';

import { getExampleData } from '@/pages/scale/suggest/utils';
import LayoutManager from './LayoutManager';
import SuggestItem from './SuggestItem';
import LoadingBox from '@/components/LoadingBox';

function PEDI(props) {
  const { model, items, changeValue } = props;

  const [example, setExample] = React.useState();

  const getStatus = (standard, score) => {
    if (score * 1 <= standard) {
      return 'error';
    }
  };

  const define = {
    功能性技巧: {
      render: ({ checked, questionNo, score }) => {
        return (
          <SuggestItem checked={checked} status={getStatus(0, score)}>
            ({questionNo}).{score}分
          </SuggestItem>
        );
      },
      getValues: ({ no, questionContent }) => {
        return { no, desc: `${questionContent}` };
      },
    },
    照顾者协助: {
      render: ({ checked, questionNo, optContent, score }) => {
        return (
          <SuggestItem checked={checked} status={getStatus(1, score)}>
            ({questionNo}).{optContent} {score}分
          </SuggestItem>
        );
      },
      getValues: ({ no, questionContent }) => {
        return { no, desc: `${questionContent}` };
      },
    },

    环境改造: {
      render: ({ checked, questionNo, optContent }) => {
        return (
          <SuggestItem checked={checked}>
            ({questionNo}).{optContent}
          </SuggestItem>
        );
      },
      getValues: ({ no, questionContent }) => {
        return { no, desc: `${questionContent}` };
      },
    },
  };

  useEffect(() => {
    setExample(getExampleData({ model, PASS_SCORE: 0 }));
  }, [model.answers.length]);

  return example ? (
    <LayoutManager example={example} items={items} changeValue={changeValue} define={define} />
  ) : (
    <LoadingBox />
  );
}

export default PEDI;
