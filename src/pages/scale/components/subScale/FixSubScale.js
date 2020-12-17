import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {rootflexGrow, paperCenter} from '@/utils/publicStyles'
const useStyles = makeStyles(theme => ({
  root: rootflexGrow,
  paper: paperCenter,
}));

function FixSubScale(props) {
  const { data = [], value = [] } = props;
  const record = {};
  const classes = useStyles();

  data.forEach(name => {
    const array = name.split('.');
    if (record[array[0]] === undefined) {
      record[array[0]] = [];
    }
    record[array[0]].push({ name: array[1] });
  });

  return (
    <>
      {Object.keys(record).map(name => (
        <div key={name} style={{ margin: '20px' }}>
          <div style={{ fontSize: '16px', marginBottom: '12px' }}>{name}</div>
          <div className={classes.root}>
            <Grid container spacing={3}>
              {record[name].map(item => (
                <Grid
                  item
                  xs={value.length === 1 ? 24 : 6}
                  sm={value.length === 1 ? 24 : 4}
                  key={`${name}.${item.name}`}
                >
                  <ButtonGroup
                    className={classes.paper}
                    // color="secondary"
                    style={{ width: '100%' }}
                    aria-label="outlined primary button group"
                  >
                    <Button
                      disableRipple
                      variant="outlined"
                      key={item.name}
                      style={{ width: '100%' }}
                      startIcon={<CheckIcon />}
                    >
                      {item.name}
                    </Button>
                  </ButtonGroup>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      ))}
    </>
  );
}

export default FixSubScale;
