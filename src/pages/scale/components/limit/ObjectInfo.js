import React from 'react';
import { createForm } from 'rc-form';
import Button from '@material-ui/core/Button';
import ScaleLimit from './ScaleLimit';

function ObjectInfo({ form, object = {}, scale, collect }) {
  const submit = () => {
    form.validateFields((err, values) => {
      if (!err) {
        collect(values);
      }
    });
  };

  return (
    <div style={{ margin: '20px' }}>
      <ScaleLimit form={form} object={object} scale={scale} />
      <Button variant="contained" color="primary" onClick={submit} fullWidth>
        確定
      </Button>
    </div>
  );
}

export default createForm({})(ObjectInfo);
