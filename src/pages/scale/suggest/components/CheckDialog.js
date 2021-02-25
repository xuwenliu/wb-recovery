import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import ScaleSuggestList from '@/pages/scale/components/ScaleSuggestList';

function CheckDialog(props) {
    const { items, open, onClose, submit } = props;
  
    return (
      <Dialog open={open} onClose={onClose} >
        <DialogTitle>评估清单</DialogTitle>
        <DialogContent>
          <ScaleSuggestList items={items} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button
            onClick={() => {
              submit();
            }}
            color="primary"
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  export default CheckDialog;