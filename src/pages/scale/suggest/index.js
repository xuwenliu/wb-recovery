import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import Header from '@/components/AppHeader';
import Button from '@material-ui/core/Button';
import Alert from '@/components/Alert';
import { ActivityIndicator } from 'antd-mobile';

import CheckDialog from './components/CheckDialog';
import { getCmponent } from './components';

function Page(props) {
  const {
    match: {
      params: { answer },
    },
    scaleSuggest: { data = [], model, plans },
    dispatch,
  } = props;

  const [open, setOpen] = React.useState(false);
  const [items, setItems] = useState(() => {
    return data || [];
  });

  const changeValue = values => {
    const { no, desc, comment, plan } = values;

    const value = { ...items };

    if (value[no] === undefined) {
      value[no] = { no, desc, comment, plan };
    } else {
      delete value[no];
    }

    setItems(value);
  };

  const fetch = () => {
    dispatch({
      type: 'scaleSuggest/fetch',
      payload: { id: answer },
    });
  };

  const fetchPlan = values => {
    dispatch({
      type: 'scaleSuggest/getSuggestPlan',
      payload: { values },
    });
  };

  const submit = () => {
    dispatch({
      type: 'scaleSuggest/saveSuggest',
      payload: { id: answer, values: Object.values(items) },
    });
    setOpen(false);
  };

  const getUI = () => {
    const UI = getCmponent(model.scaleCode);

    if (UI) {
      return (
        <>
          <UI
            changeValue={changeValue}
            model={model}
            items={items}
            fetchPlan={fetchPlan}
            plans={plans}
          />
          <CheckDialog
            items={Object.values(items)}
            open={open}
            submit={submit}
            onClose={() => {
              setOpen(false);
            }}
          />
        </>
      );
    }

    return (
      <Alert style={{ marginTop: 15 }} severity="info">
        该量表未有训练目标的功能
      </Alert>
    );
  };

  useEffect(() => {
    fetch();
    return () => {
      dispatch({
        type: 'scaleSuggest/clear',
        payload: {},
      });
    };
  }, []);

  useEffect(() => {
    setItems(data);
  }, [Object.keys(data).length]);

  return (
    <div>
      <Header>
        训练目标
        <Button
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: '16px',
            lineHeight: '48px',
            fontWeight: 'bold',
          }}
          aria-label="delete"
          onClick={() => {
            setOpen(true);
          }}
          fontSize="large"
        >
          确定
        </Button>
      </Header>
      {model === undefined ? (
        <div
          style={{
            margin: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ActivityIndicator animating size="large" />
        </div>
      ) : (
        <>{getUI()}</>
      )}
    </div>
  );
}

export default connect(({ scaleSuggest }) => ({
  scaleSuggest,
}))(Page);
